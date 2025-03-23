from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.models.delivery import DeliveryStatus

class DeliveryBase(BaseModel):
    delivery_notes: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None

class DeliveryCreate(DeliveryBase):
    order_id: int
    delivery_person_id: Optional[int] = None
    estimated_delivery_time: Optional[datetime] = None

class DeliveryUpdate(DeliveryBase):
    status: Optional[DeliveryStatus] = None
    delivery_person_id: Optional[int] = None
    estimated_delivery_time: Optional[datetime] = None
    actual_delivery_time: Optional[datetime] = None

class DeliveryInDBBase(DeliveryBase):
    id: int
    order_id: int
    delivery_person_id: Optional[int]
    status: DeliveryStatus
    estimated_delivery_time: Optional[datetime]
    actual_delivery_time: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config: 
        from_attributes = True

class Delivery(DeliveryInDBBase):
    pass