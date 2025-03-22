from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/user_compte", tags=["usercompte"])


@router.get("/read/usercompte/{username}", response_model=schemas.useracompte.UserACompte)
async def get_onse_usercompte_endpoint(username: str, db: Session = Depends(get_db)) -> schemas.useracompte.UserACompte:
    db_usercompte = crud.useracompte.read_onse_userAcompte(db=db, username=username)
    #db_usercompte = db.query(models.usercompte.UserCompte).filter(username == models.usercompte.UserCompte.User_name).first()
    if db_usercompte is None:
        raise HTTPException(status_code=404, detail="usercompte non trouvée")
    return db_usercompte

@router.post("/post/add", response_model=schemas.useracompte.UserACompte)
#def create_user_compte_endpoint(user_compte: schemas.UserCompteCreate, personne_id: int, db: Session = Depends(get_db)):
def create_user_compte_endpoint( compte: schemas.useracompte.UserACompteCreate, db: Session = Depends(get_db))->schemas.useracompte.UserACompte:
    db_user =  crud.useracompte.create_user_compte(db=db, compte=compte,)
    if not db_user:
        raise HTTPException(status_code=404, detail="compre oups")
    return db_user
"""
@router.post("/", response_model=schemas.UserCompte)
def create_user_compte(user_compte: schemas.UserCompteCreate, db: Session = Depends(get_db)):
    db_user_compte = crud.get_user_compte_by_username(db, User_name=user_compter.User_name)
    if db_user_compte:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà utilisé")
    return crud.create_user_compte(db=db, user_compte=user_compte)
"""