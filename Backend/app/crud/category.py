from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase

from app.models.menu import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate]):
    def __init__(self):
        super().__init__(model=Category)
    
    def get_category(self, db: Session, category_id: int) -> Optional[Category]:
        return db.query(self.model).filter(self.model.id == category_id).first()

    def get_categories(self, db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create_category(self, db: Session, category: CategoryCreate) -> Category:
        db_category = self.model(
            name=category.name,
            description=category.description
        )
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category

    def update_category(self, db: Session, category_id: int, category: CategoryUpdate) -> Optional[Category]:
        db_category = self.get_category(db, category_id)
        if not db_category:
            return None
        
        update_data = category.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)
        
        db.commit()
        db.refresh(db_category)
        return db_category

    def delete_category(self, db: Session, category_id: int) -> bool:
        db_category = self.get_category(db, category_id)
        if not db_category:
            return False
        
        db.delete(db_category)
        db.commit()
        return True
