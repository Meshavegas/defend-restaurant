from fastapi import HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

import hashlib

def hash_password(password: str) -> str: 
    # fonction de hashage de mot de passe pour plus de securite
    return hashlib.sha256(password.encode()).hexdigest()


def create_password(passwordcrud: schemas.password.PasswordCreate, db: Session) -> schemas.password.Password | dict[str, str]:
    """
    fonction de creation d'un mot de passe hasher pour un utilisateur
    """
    pwd = hash_password(passwordcrud.password_)
    try:
        # Vérifiez l'existence de l'identifiant utilisateur
        # au preable un mot de passe doit etre unique pour un utilisateur 
        #mais dans ce cas il n'y a pas de compte utilisateur
        """
        user_compte = db.query(models.useracompte.UserCompte).filter(usercompteridcrud == models.useracompte.UserCompte.identifiant_usercompte).first()
        if not user_compte:
            raise HTTPException(status_code=404, detail="UserCompte existe déjà")
        """
        db_Client = models.password.Password(
            #identifiant_usercompte=usercompteridcrud,
            password_=pwd
        )
        #db_Client.identifiant_usercompte = usercompterid
        db.add(db_Client)
        db.commit()
        db.refresh(db_Client)
        return db_Client
    except Exception as e:
        db.rollback()
        return {"erreur insertion du client": str(e)}


def read_password(db: Session, pwd: str) -> schemas.password.Password | dict[str,str]:
    """
    fonction utilise lors de la connexion au l'app
    """
    try:
        hash_pwd = hash_password(pwd)
        # Vérifiez l'existence de l'identifiant password
        pwd = db.query(models.password.Password).filter(hash_pwd == models.password.Password.password_).first()

        print(pwd)
        print(type(pwd))
        if not pwd:
            raise HTTPException(status_code=404, detail="password non trouvé")
        return pwd
    except Exception as e:
        return {"erreur de connexion": str(e)}


