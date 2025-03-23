from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.reservation import Reservation, ReservationStatus
from app.schemas.reservation import ReservationCreate, ReservationUpdate
from app.crud.base import CRUDBase

class CRUDReservation(CRUDBase[Reservation, ReservationCreate, ReservationUpdate]):
    def create_with_user(
        self, db: Session, *, obj_in: ReservationCreate, user_id: int
    ) -> Reservation:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = Reservation(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Reservation]:
        return (
            db.query(Reservation)
            .filter(Reservation.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_date_range(
        self, db: Session, *, start_date: datetime, end_date: datetime, skip: int = 0, limit: int = 100
    ) -> List[Reservation]:
        return (
            db.query(Reservation)
            .filter(Reservation.date >= start_date)
            .filter(Reservation.date <= end_date)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def update_status(
        self, db: Session, *, reservation_id: int, status: ReservationStatus
    ) -> Reservation:
        reservation = self.get(db, id=reservation_id)
        if not reservation:
            return None
        reservation.status = status
        db.add(reservation)
        db.commit()
        db.refresh(reservation)
        return reservation

reservation = CRUDReservation(Reservation)

# app/crud/menu.py
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