from typing import List, Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from app.models.menu import MenuItem, Category
from app.schemas.menu import MenuItemCreate, MenuItemUpdate, CategoryCreate, CategoryUpdate
from app.crud.base import CRUDBase

class CRUDMenuItem(CRUDBase[MenuItem, MenuItemCreate, MenuItemUpdate]):
    def get_by_category(
        self, db: Session, *, category_id: int, skip: int = 0, limit: int = 100
    ) -> List[MenuItem]:
        return (
            db.query(MenuItem)
            .filter(MenuItem.category_id == category_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_available(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[MenuItem]:
        return (
            db.query(MenuItem)
            .filter(MenuItem.is_available == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def search_by_name(
        self, db: Session, *, name: str, skip: int = 0, limit: int = 100
    ) -> List[MenuItem]:
        return (
            db.query(MenuItem)
            .filter(MenuItem.name.ilike(f"%{name}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Category]:
        return db.query(Category).filter(Category.name == name).first()

menu_item = CRUDMenuItem(MenuItem)
category = CRUDCategory(Category)