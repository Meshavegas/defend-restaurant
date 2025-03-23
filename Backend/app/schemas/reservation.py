from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.reservation import ReservationStatus

# Schéma de base pour Reservation
class ReservationBase(BaseModel):
    date: datetime
    number_of_guests: int = Field(..., gt=0)
    special_requests: Optional[str] = None

# Propriétés pour recevoir via API pour la création
class ReservationCreate(ReservationBase):
    pass

# Propriétés pour recevoir via API pour la mise à jour
class ReservationUpdate(ReservationBase):
    date: Optional[datetime] = None
    number_of_guests: Optional[int] = None
    status: Optional[ReservationStatus] = None

# Propriétés partagées par les modèles stockés en DB
class ReservationInDBBase(ReservationBase):
    id: int
    user_id: int
    status: ReservationStatus
    created_at: datetime
    updated_at: datetime

    class Config: 
        from_attributes = True

# Propriétés pour retourner via API
class Reservation(ReservationInDBBase):
    pass