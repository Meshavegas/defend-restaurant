# app/api/v1/endpoints/menu.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from typing import List, Optional
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps 

router = APIRouter()

@router.post("/menu-items/", response_model=schemas.MenuItem)
async def create_menu_item(
    request: Request,
    db: Session = Depends(deps.get_db),
    name: str = Form(..., description="Required"),
    price: float = Form(..., description="Required"),
    category_id: int = Form(..., description="Required"),
    description: Optional[str] = Form(None),
    is_available: bool = Form(True),
    preparation_time: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(default=None)
):
    try:
        # Validate numeric fields
        try: 
            price = float(price)
            category_id = int(category_id)
            if preparation_time is not None:
                preparation_time = int(preparation_time)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid numeric value")

        item_data = {
            "name": name.strip(),
            "description": description.strip() if description else None,
            "price": price,
            "is_available": is_available,
            "category_id": category_id,
            "preparation_time": preparation_time
        }
        
        # Validate required fields
        if not name or not price or not category_id:
            raise HTTPException(status_code=400, detail="Missing required fields")

        item_in = schemas.MenuItemCreate(**item_data)
        return await crud.MenuItem.create_with_image(db, obj_in=item_in, image=image)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/menu-items/{id}", response_model=schemas.MenuItem)
async def update_menu_item(
    id: int,
    request: Request,
    db: Session = Depends(deps.get_db),
    name: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    description: Optional[str] = Form(None),
    is_available: Optional[bool] = Form(None),
    category_id: Optional[int] = Form(None),
    preparation_time: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    try:
        menu_item = crud.MenuItem.get(db, id=id)
        if not menu_item:
            raise HTTPException(status_code=404, detail="Menu item not found")
        
        # Convert and validate numeric fields
        update_data = {}
        if name is not None:
            update_data["name"] = name.strip()
        if price is not None:
            update_data["price"] = float(price)
        if category_id is not None:
            update_data["category_id"] = int(category_id)
        if description is not None:
            update_data["description"] = description.strip()
        if is_available is not None:
            update_data["is_available"] = is_available
        if preparation_time is not None:
            update_data["preparation_time"] = int(preparation_time)
        
        item_in = schemas.MenuItemUpdate(**update_data)
        return await crud.menu_item.update_with_image(
            db, db_obj=menu_item, obj_in=item_in, image=image
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/menu-items/{id}", response_model=schemas.MenuItem)
def delete_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int
):
    menu_item = crud.MenuItem.get(db, id=id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return crud.menu_item.remove(db, id=id)