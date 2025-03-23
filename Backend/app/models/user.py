from sqlalchemy import Boolean, Column, Integer, String, Enum
from sqlalchemy.orm import relationship

from app.db.base_class import Base, TimestampMixin
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STAFF = "staff"
    CLIENT = "client"

class User(Base, TimestampMixin): 
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    address = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CLIENT)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # Relations
    reservations = relationship("Reservation", back_populates="user")
    orders = relationship("Order", back_populates="user")
    