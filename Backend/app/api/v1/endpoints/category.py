from fastapi import APIRouter, Depends, HTTPException, Form
from typing import List, Optional
from sqlalchemy.orm import Session
from app import crud, schemas
from app.crud import category
from app.api import deps

router = APIRouter()

@router.post("/categories/", response_model=schemas.Category)
async def create_category(
    name: str = Form(..., description="Required"),
    description: Optional[str] = Form(None),
    db: Session = Depends(deps.get_db)
):
    try:
        category_data = {
            "name": name.strip(),
            "description": description.strip() if description else None
        }
        
        if not name:
            raise HTTPException(status_code=400, detail="Name is required")

        category_in = schemas.CategoryCreate(**category_data)
        return category.create_category(db, obj_in=category_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/categories/", response_model=List[schemas.Category])
def get_categories(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
):
    return category.get_categories(db, skip=skip, limit=limit)

@router.get("/categories/{id}", response_model=schemas.Category)
def get_category(
    id: int,
    db: Session = Depends(deps.get_db)
):
    category = crud.category.get(db, id=id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/categories/{id}", response_model=schemas.Category)
async def update_category(
    id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    db: Session = Depends(deps.get_db)
):
    try:
        category = category.get_category(db, id=id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        update_data = {}
        if name is not None:
            update_data["name"] = name.strip()
        if description is not None:
            update_data["description"] = description.strip()
        
        category_in = schemas.CategoryUpdate(**update_data)
        return category.update_category(db, db_obj=category, obj_in=category_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/categories/{id}", response_model=schemas.Category)
def delete_category(
    id: int,
    db: Session = Depends(deps.get_db)
):
    category = category.get_category(db, id=id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category.delete_category(db, id=id)
