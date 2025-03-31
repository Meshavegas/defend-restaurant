# app/crud/menu.py
from typing import List, Optional, Dict, Any, Union, Type
from sqlalchemy.orm import session
from fastapi import UploadFile
import uuid
from app.models.menu import MenuItem, Category
from app.schemas.menu import MenuItemCreate, MenuItemUpdate, CategoryCreate, CategoryUpdate
from app.crud.base import CRUDBase
from app.core.minio_client import MinioClient

def get_by_category(
        self, db: session, *, category_id: int, skip: int = 0, limit: int = 100
    ) -> List[MenuItem]:
        return (
            db.query(MenuItem)
            .filter(MenuItem.category_id == category_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
def get_available(
        self, db: session, *, skip: int = 0, limit: int = 100
    ) -> List[MenuItem]:
        return (
            db.query(MenuItem)
            .filter(MenuItem.is_available == True)
            .offset(skip)
            .limit(limit)
            .all()
        )

def search_by_name(
        self, db: session, *, name: str, skip: int = 0, limit: int = 100
    ) -> List[MenuItem]:
        return (
            db.query(MenuItem)
            .filter(MenuItem.name.ilike(f"%{name}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )
async def update_with_image(
        self,
        db: session,
        *,
        db_obj: MenuItem,
        obj_in: MenuItemUpdate,
        image: Optional[UploadFile] = None
    ) -> MenuItem:
        update_data = obj_in.dict(exclude_unset=True)
        
        if image:
            # Delete old image if exists
            if db_obj.image_url and os.path.exists(db_obj.image_url):
                os.remove(db_obj.image_url)
            
            # Save new image
            image_path = f"static/menu_items/{db_obj.id}_{image.filename}"
            os.makedirs(os.path.dirname(image_path), exist_ok=True)
            
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            update_data["image_url"] = image_path

        for field, value in update_data.items():
            setattr(db_obj, field, value)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
async def create_with_image(
      
        db: session, 
        *, 
        obj_in: MenuItemCreate, 
        image: Optional[UploadFile] = None
    ) -> MenuItem:
        
        minio_client = MinioClient()

        try:
            # Ensure obj_in is properly converted to dict
            if isinstance(obj_in, str):
                raise ValueError("Input data must be a valid MenuItemCreate object")
            
            # Convert Pydantic model to dict
            obj_in_data = obj_in.model_dump() if hasattr(obj_in, 'model_dump') else obj_in.dict()
            
            # Validate required fields
            if not obj_in_data.get("name") or not obj_in_data.get("price"):
                raise ValueError("Name and price are required fields")
            
            # Handle image upload
            if image:
                # Validate image file
                if not image.filename:
                    raise ValueError("Invalid image file")
                    
                # Validate file extension
                file_ext = image.filename.split('.')[-1].lower()
                allowed_extensions = ['jpg', 'jpeg', 'png']
                if file_ext not in allowed_extensions:
                    raise ValueError(f"Invalid file extension. Allowed: {allowed_extensions}")
                
                # Generate unique filename
                object_name = f"{uuid.uuid4()}.{file_ext}"
                
                # Upload to MinIO and get URL
                try:
                    image_url = await minio_client.upload_file(image, object_name)
                    obj_in_data["image_url"] = image_url
                    obj_in_data["image_object_name"] = object_name
                    print(f"Image uploaded: {image_url}")
                except Exception as minio_error:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to upload image: {str(minio_error)}"
                    )

            # Create database object
            db_obj = MenuItem(**obj_in_data)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
            
        except Exception as e:
            db.rollback()
            raise ValueError(f"Error creating menu item: {str(e)}")
        
def remove(self, db: session, *, id: int) -> MenuItem:
        obj = db.query(self.model).get(id)
        if obj.image_object_name:
            self.minio_client.delete_file(obj.image_object_name)
        return super().remove(db, id=id)

# get all items group by category like list of category and inside category list of menu item

def get_items_by_categories(db: session) -> List[Dict[str, Any]]:
    # Get all categories with their menu items
    categories = (
        db.query(Category)
        .outerjoin(MenuItem)
        .all()
    )

    # Format the result
    result = []
    for category in categories:
        category_data = {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "menu_items": [
                {
                    "id": item.id,
                    "name": item.name,
                    "description": item.description,
                    "price": item.price,
                    "is_available": item.is_available,
                    "image_url": item.image_url,
                    "preparation_time": item.preparation_time
                }
                for item in category.menu_items
            ]
        }
        result.append(category_data)

    return result

def get_items_and_categories(db: session):
    """Get all menu items with their category details"""
    results = db.query(MenuItem, Category).join(Category).all()
    return [
        {
             
                "id": menu_item.id,
                "name": menu_item.name,
                "description": menu_item.description,
                "price": menu_item.price,
                "is_available": menu_item.is_available,
                "image_url": menu_item.image_url,
                "preparation_time": menu_item.preparation_time,
             
            "category": {
                "id": category.id,
                "name": category.name,
                "description": category.description,
            },
        }
        for menu_item, category in results
    ]