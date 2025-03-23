from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.db.base_class import Base, TimestampMixin

class ReservationStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Reservation(Base, TimestampMixin):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    number_of_guests = Column(Integer, nullable=False)
    special_requests = Column(String, nullable=True)
    status = Column(Enum(ReservationStatus), default=ReservationStatus.PENDING)
    
    # Relations
    user = relationship("User", back_populates="reservations")
    
