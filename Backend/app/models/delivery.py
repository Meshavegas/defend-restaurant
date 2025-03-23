from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Float
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.db.base_class import Base, TimestampMixin

class DeliveryStatus(str, enum.Enum):
    ASSIGNED = "assigned"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    FAILED = "failed"

class Delivery(Base, TimestampMixin):
    __tablename__ = "deliveries"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True, nullable=False)
    delivery_person_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(Enum(DeliveryStatus), default=DeliveryStatus.ASSIGNED)
    estimated_delivery_time = Column(DateTime, nullable=True)
    actual_delivery_time = Column(DateTime, nullable=True)
    delivery_notes = Column(String, nullable=True)
    longitude = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    
    # Relations
    order = relationship("Order", back_populates="delivery")
    delivery_person = relationship("User")
    