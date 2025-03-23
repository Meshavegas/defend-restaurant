from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.order import OrderStatus, PaymentStatus

# Schéma pour OrderItem
class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int = Field(..., gt=0)
    special_instructions: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemUpdate(OrderItemBase):
    menu_item_id: Optional[int] = None
    quantity: Optional[int] = None
    special_instructions: Optional[str] = None

class OrderItemInDBBase(OrderItemBase):
    id: int
    order_id: int
    unit_price: float
    created_at: datetime
    updated_at: datetime

    class Config:
       
        from_attributes = True

class OrderItem(OrderItemInDBBase):
    pass

# Schéma pour Order
class OrderBase(BaseModel):
    notes: Optional[str] = None
    address: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(OrderBase):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None

class OrderInDBBase(OrderBase):
    id: int
    user_id: int
    total_amount: float
    status: OrderStatus
    payment_status: PaymentStatus
    created_at: datetime
    updated_at: datetime

    class Config: 
        from_attributes = True

class Order(OrderInDBBase):
    items: List[OrderItem]