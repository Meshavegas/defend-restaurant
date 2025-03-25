# app/crud/menu.py
from typing import List, Optional, Dict, Any, Union, Type
from sqlalchemy.orm import session
from fastapi import UploadFile
import uuid
from app.models.menu import MenuItem, Category
from app.schemas.menu import MenuItemCreate, MenuItemUpdate, CategoryCreate, CategoryUpdate
from app.crud.base import CRUDBase
from app.core.minio_client import MinioClient

class CRUDMenuItem(CRUDBase[MenuItem, MenuItemCreate, MenuItemUpdate]):
    def __init__(self, model: Type[MenuItem]):
        super().__init__(model)
        self.minio_client = MinioClient()

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

    async def create_with_image(
        self, 
        db: session, 
        *, 
        obj_in: MenuItemCreate, 
        image: Optional[UploadFile] = None
    ) -> MenuItem:
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
                image_url = await self.minio_client.upload_file(image, object_name)
                obj_in_data["image_url"] = image_url
                obj_in_data["image_object_name"] = object_name

            # Create database object
            db_obj = self.model(**obj_in_data)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
            
        except Exception as e:
            db.rollback()
            raise ValueError(f"Error creating menu item: {str(e)}")

    async def update_with_image(
        self,
        db: session,
        *,
        db_obj: MenuItem,
        obj_in: Union[MenuItemUpdate, Dict[str, Any]],
        image: Optional[UploadFile] = None
    ) -> MenuItem:
        obj_data = db_obj.__dict__
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)

        if image:
            # Delete old image if exists
            if db_obj.image_object_name:
                self.minio_client.delete_file(db_obj.image_object_name)

            # Upload new image
            file_ext = image.filename.split('.')[-1]
            object_name = f"{uuid.uuid4()}.{file_ext}"
            image_url = await self.minio_client.upload_file(image, object_name)
            
            update_data["image_url"] = image_url
            update_data["image_object_name"] = object_name

        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def remove(self, db: session, *, id: int) -> MenuItem:
        obj = db.query(self.model).get(id)
        if obj.image_object_name:
            self.minio_client.delete_file(obj.image_object_name)
        return super().remove(db, id=id)

class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate]):
    def get_by_name(self, db: session, *, name: str) -> Optional[Category]:
        return db.query(Category).filter(Category.name == name).first()