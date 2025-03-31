from fastapi import APIRouter, Depends, HTTPException, Form
from typing import List, Optional
from sqlalchemy.orm import Session
from app import crud, schemas
from app.crud import category
from app.api import deps
from fastapi import Body

router = APIRouter()

@router.post("/", response_model=schemas.Category)
async def create_category(
    category_in: schemas.CategoryCreate = Body(...),
    db: Session = Depends(deps.get_db)
):
    try:
        if not category_in.name:
            raise HTTPException(status_code=400, detail="Name is required")
        
        return category.create_category(db, category_in)  # Changed this line
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.Category])
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
    db_category = category.get_category(db, category_id=id)  # Changed this line
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.put("/categories/{id}", response_model=schemas.Category)
async def update_category(
    id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    db: Session = Depends(deps.get_db)
):
    try:
        db_category = category.get_category(db, category_id=id)  # Changed this line
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        update_data = {}
        if name is not None:
            update_data["name"] = name.strip()
        if description is not None:
            update_data["description"] = description.strip()
        
        category_in = schemas.CategoryUpdate(**update_data)
        return category.update_category(db, id, category_in)  # Changed this line
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/categories/{id}", response_model=schemas.Category)
def delete_category(
    id: int,
    db: Session = Depends(deps.get_db)
):
    db_category = category.get_category(db, category_id=id)  # Changed this line
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category.delete_category(db, category_id=id)  # Changed this line
