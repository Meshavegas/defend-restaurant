from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.delivery import Delivery, DeliveryStatus
from app.models.order import Order, OrderStatus
from app.schemas.delivery import DeliveryCreate, DeliveryUpdate
from app.crud.base import CRUDBase

class CRUDDelivery(CRUDBase[Delivery, DeliveryCreate, DeliveryUpdate]):
    def create_for_order(
        self, db: Session, *, order_id: int, delivery_person_id: Optional[int] = None
    ) -> Delivery:
        # Vérifier si la commande existe et est prête pour la livraison
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise ValueError(f"Order with id {order_id} not found")
        
        # Créer la livraison
        db_obj = Delivery(
            order_id=order_id,
            delivery_person_id=delivery_person_id,
            status=DeliveryStatus.ASSIGNED
        )
        db.add(db_obj)
        
        # Mettre à jour le statut de la commande
        order.status = OrderStatus.DELIVERY_ASSIGNED
        db.add(order)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_delivery_person(
        self, db: Session, *, delivery_person_id: int, skip: int = 0, limit: int = 100
    ) -> List[Delivery]:
        return (
            db.query(Delivery)
            .filter(Delivery.delivery_person_id == delivery_person_id)
            .order_by(desc(Delivery.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_status(
        self, db: Session, *, status: DeliveryStatus, skip: int = 0, limit: int = 100
    ) -> List[Delivery]:
        return (
            db.query(Delivery)
            .filter(Delivery.status == status)
            .order_by(desc(Delivery.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def update_status(
        self, db: Session, *, delivery_id: int, status: DeliveryStatus
    ) -> Delivery:
        delivery = self.get(db, id=delivery_id)
        if not delivery:
            return None
        
        delivery.status = status
        
        # Mettre à jour le statut de la commande en fonction du statut de livraison
        order = db.query(Order).filter(Order.id == delivery.order_id).first()
        if order:
            if status == DeliveryStatus.PICKED_UP:
                order.status = OrderStatus.DELIVERING
            elif status == DeliveryStatus.DELIVERED:
                order.status = OrderStatus.DELIVERED
                delivery.actual_delivery_time = datetime.utcnow()
            db.add(order)
        
        db.add(delivery)
        db.commit()
        db.refresh(delivery)
        return delivery
    
    def update_location(
        self, db: Session, *, delivery_id: int, longitude: float, latitude: float
    ) -> Delivery:
        delivery = self.get(db, id=delivery_id)
        if not delivery:
            return None
        
        delivery.longitude = longitude
        delivery.latitude = latitude
        
        db.add(delivery)
        db.commit()
        db.refresh(delivery)
        return delivery

delivery = CRUDDelivery(Delivery)