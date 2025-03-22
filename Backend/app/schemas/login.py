from pydantic import BaseModel
from typing import Optional
from datetime import date


# Pydantic Schemas
class LoginStructure(BaseModel):
    """Classe de pour le login"""
    username: str
    password: str

class UserAccountBase(BaseModel):
    """classe pour UserAccount"""
    full_name: str 
    phone: str
    role: str
    email: str

class UserAccountCreate(UserAccountBase):
    password_: str

class UserAccountResponse(UserAccountBase):
    user_id: int

    class Config:
        from_attributes = True


class PasswordBase(BaseModel):
    password_: str

class PasswordCreate(PasswordBase):
    pass

class PasswordResponse(PasswordBase):
    id: int

    class Config:
        from_attributes = True

