from typing import List, Optional, Dict, Any, Union, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.menu import MenuItem
from app.schemas.order import OrderCreate, OrderUpdate, OrderItemCreate
from app.crud.base import CRUDBase

class CRUDOrderItem(CRUDBase[OrderItem, OrderItemCreate, OrderItemCreate]):
    def create_with_order(
        self, db: Session, *, obj_in: OrderItemCreate, order_id: int
    ) -> OrderItem:
        # Obtenir le prix unitaire du menu
        menu_item = db.query(MenuItem).filter(MenuItem.id == obj_in.menu_item_id).first()
        if not menu_item:
            raise ValueError(f"Menu item with id {obj_in.menu_item_id} not found")
        
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = OrderItem(
            **obj_in_data,
            order_id=order_id,
            unit_price=menu_item.price
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

class CRUDOrder(CRUDBase[Order, OrderCreate, OrderUpdate]):
    def create_with_items(
        self, db: Session, *, obj_in: OrderCreate, user_id: int
    ) -> Order:
        # Calculer le montant total
        total_amount = 0
        for item in obj_in.items:
            menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
            if not menu_item:
                raise ValueError(f"Menu item with id {item.menu_item_id} not found")
            total_amount += menu_item.price * item.quantity
        
        # Créer la commande
        db_obj = Order(
            user_id=user_id,
            total_amount=total_amount,
            notes=obj_in.notes,
            address=obj_in.address,
            status=OrderStatus.PENDING,
            payment_status=PaymentStatus.PENDING
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Créer les éléments de commande
        for item in obj_in.items:
            menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
            order_item = OrderItem(
                order_id=db_obj.id,
                menu_item_id=item.menu_item_id,
                quantity=item.quantity,
                unit_price=menu_item.price,
                special_instructions=item.special_instructions
            )
            db.add(order_item)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        return (
            db.query(Order)
            .filter(Order.user_id == user_id)
            .order_by(desc(Order.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_status(
        self, db: Session, *, status: OrderStatus, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        return (
            db.query(Order)
            .filter(Order.status == status)
            .order_by(desc(Order.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def update_status(
        self, db: Session, *, order_id: int, status: OrderStatus
    ) -> Order:
        order = self.get(db, id=order_id)
        if not order:
            return None
        order.status = status
        db.add(order)
        db.commit()
        db.refresh(order)
        return order
    
    def update_payment_status(
        self, db: Session, *, order_id: int, payment_status: PaymentStatus
    ) -> Order:
        order = self.get(db, id=order_id)
        if not order:
            return None
        order.payment_status = payment_status
        db.add(order)
        db.commit()
        db.refresh(order)
        return order

order = CRUDOrder(Order)
order_item = CRUDOrderItem(OrderItem)