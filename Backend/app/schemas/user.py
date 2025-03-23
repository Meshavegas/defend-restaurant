from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from app.models.user import UserRole

# Schéma de base pour User
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    role: Optional[UserRole] = UserRole.CLIENT

# Propriétés pour recevoir via API pour la création
class UserCreate(UserBase):
    email: EmailStr
    password: str

# Propriétés pour recevoir via API pour la mise à jour
class UserUpdate(UserBase):
    password: Optional[str] = None

# Propriétés partagées par les modèles stockés en DB
class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config: 
        from_attributes = True

# Propriétés pour retourner via API
class User(UserInDBBase):
    pass

# Propriétés stockées en DB
class UserInDB(UserInDBBase):
    password: str