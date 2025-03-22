from sqlalchemy.orm import relationship, Session
from typing import Optional

from app import models, schemas
# CRUD Operations
def create_user_account(db: Session, personnel: schemas.login.UserAccountBase):
    """
    Fonction de creation d'un nouvelle utilisateur
    db: fonction de connexion aa la base de connee et de gestion des session
    personnel : schemas qui charger de recuperation des informations d'un utilisateur
    """
    try:
        # requete de creation d'un nouvelle user
        new_personnel = models.user_a_compte.User(
            full_name=personnel.full_name,
            email=personnel.email, 
            role=personnel.role,
            phone=personnel.phone,      
        )
        db.add(new_personnel)
        # commit et refresh annuler car il devrons etre appel lors de la creation du mot de passe ce qui fera egalement le commit pour cette operation ded cration de compte utilisateur
        db.commit() 
        db.refresh(new_personnel)
    except Exception as e:
        print(e)
    finally:
        return new_personnel


def create_user_account_and_password(db: Session, personnel: schemas.login.UserAccountBase, password: schemas.login.PasswordBase):
    """
    fonction de reation d'un nouvelle utilisateur avec un compte
    db: varible de gestion des session de connexion
    personnel: schema de recupreation des donnees de l'utilisateur
    password: schemas de recuperation du mot de passe pour les prochaines connexion
    create_medical_personnel: fonction appeler pour la creation d'un nouvelle utilisateur
    creat_passord: fonction appeler pour la creation d'un mot de passe

    """
    try:
        new_personnel = create_user_account(db = db, personnel = personnel)
        password = create_password(password = password.password_, user=new_personnel.user_id, db = db)
        print(password)
    except Exception as e:
        print(e)
    finally:
        return new_personnel
    

def get_user_account(
    db: Session, 
    personnel_id: Optional[int] = None, 
    personnel_username: Optional[str] = None
):
    """
    fonction de recuperation des donnees d'un utilisateur fonction de son plusieur information
    personnel_id: identifiant de l'utilisateur
    personnel_username: nom d'utilisateur
    """
    if personnel_id:
        return db.query(models.user_a_compte.User).filter(models.user_a_compte.User.id == personnel_id).first()
    elif personnel_username:
        return db.query(models.user_a_compte.User).filter(models.user_a_compte.User.email == personnel_username).first()



def get_all_user_account(db: Session):
    return db.query(models.user_a_compte.User).all()

def update_user_account(db: Session, personnel_id: int, personnel_update: schemas.login.UserAccountBase):
    personnel = db.query(models.user_a_compte.User).filter(models.user_a_compte.User.id == personnel_id).first()
    if personnel:
        for key, value in personnel_update.dict(exclude_unset=True).items():
            setattr(personnel, key, value)
        db.commit()
        db.refresh(personnel)
    return personnel

def delete_user_account(db: Session, personnel_id: int):
    personnel = db.query(models.user_a_compte.User).filter(models.user_a_compte.User.user_id == personnel_id).first()
    if personnel:
        db.delete(personnel)
        db.commit()
    return personnel




import hashlib
def hash_password(password: str) -> str: 
    # fonction de hashage de mot de passe pour plus de securite
    return hashlib.sha256(password.encode()).hexdigest()



def create_password(password: str, user: int, db: Session) ->  dict[str, str]:
    """
    Fonction de creation d'un mot de passe hasher pour un utilisateur
    user: l'identifant de l'utilisateur
    password: le mots de pass de l'utilisateur
    db: la fonction de gestion des session de connexion  a la basse de donnee
    pwd: mont de pass hasher
    """
    pwd = hash_password(password)
    try:
        db_Client = models.password.Password(
            id=user,
            password_=pwd
        )
        db.add(db_Client)
        db.commit()
        db.refresh(db_Client)
        return db_Client
    except Exception as e:
        db.rollback()
        return {"erreur insertion du client": str(e)}



def get_password(db: Session, user: str) -> schemas.password.Password | dict[str,str]:
    """
    fonction utiliser lors de la connexion a l'application pour recuperer le mot de passe
    user: identifiant de l"utilisateur
    db: gestion des session de conexion
    """
    try:
        # Vérifiez l'existence de l'identifiant password
        user = db.query(models.password.Password).filter(user == models.password.Password.id).first()
        # print(user)
        # print(type(user))
        if not user:
            raise HTTPException(status_code=404, detail="password non trouvé")
        return user
    except Exception as e:
        return {"erreur de connexion": str(e)}
    
    


def login(db: Session, data: schemas.login.LoginStructure) -> schemas.login.UserAccountResponse | dict[str,str]:
    """
    fonction utiliser pour la connexion a l'application 
    data: schema de stockage des donnees de connexion
    db: gestion des session de conexion
    get_medical_personnel: fonction utiliser ici pour la recuperation du compte fonction de email
    get_password: fonction de recuperation des donne de la classe password fonction de l'identifiant de l'utilisateur
    """
    try: 
        a = 0
        user = get_user_account(personnel_username = data.email, db=db)
        real_password = get_password(user=user.id, db=db)
        if real_password.password_ == hash_password(data.password):
            # hashage du pass entre par l'utilisateur et evalution de ce dernier avec celui existant dans la base de donnee
            a = 1 
    except Exception as e:
        pass
    finally:
        if a == 1:
            return user
        else:
            return {"erreur de connexion": str(e)}
    



