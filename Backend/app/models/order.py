from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, Enum, Text, String
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.db.base_class import Base, TimestampMixin

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    DELIVERY_ASSIGNED = "delivery_assigned"
    DELIVERING = "delivering"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class Order(Base, TimestampMixin):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    notes = Column(Text, nullable=True)
    address = Column(String, nullable=True)  # Pour la livraison
    
    # Relations
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    delivery = relationship("Delivery", back_populates="order", uselist=False)
    

class OrderItem(Base, TimestampMixin):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    special_instructions = Column(String, nullable=True)
    
    # Relations
    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem", back_populates="order_items")
    