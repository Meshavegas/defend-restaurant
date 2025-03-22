from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

route = APIRouter(prefix="/password", tags=["password"])

@route.post("/create/password/", response_model=schemas.password.Password)
async def post_create_Client_endpoint(clientep: schemas.password.PasswordCreate,  db: Session = Depends(get_db)):
    """
    api pour insertion de mots de passe
    """
    db_client = crud.password.create_password(passwordcrud=clientep, db=db)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client oups")
    return db_client

@route.post("/read/password/", response_model=schemas.password.Password | dict[str,str])
async def post_password_endpoint(password: str, db: Session = Depends(get_db)) -> schemas.password.Password | dict[str,str]:
    """
    api pour read de mots de passe
    """
    try:
        db_pwd = crud.password.read_password(db=db, pwd=password)
        if not db_pwd:
            raise HTTPException(status_code=404, detail="password non trouvé")
        return db_pwd
    except Exception as e:
        return {"mot de passe":"introuvable{str(e)}"}