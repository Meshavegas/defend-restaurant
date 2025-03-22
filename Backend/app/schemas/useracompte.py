from typing import Optional

from pydantic import BaseModel
from datetime import datetime

class UserACompteBase(BaseModel):
    """Classe de base du compte utilisateur"""
    User_name: str
    etat: str
    date_creation: datetime
    type : str

class UserACompteCreate(UserACompteBase):
    """Classe de Creation d'un utilisateur"""
    pass

class LoginDetail(BaseModel):
    """Classe de pour le login"""
    username: str
    password: str

class UserACompte(UserACompteBase):
    """Classe de retour du compte utilisateur au frontend"""
    identifiant_user_a_compte: int
    
    class Config:
        #orm_mode = True
        from_attributes = True



