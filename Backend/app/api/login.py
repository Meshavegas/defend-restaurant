from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas, crud
from app.database import get_db

Login = APIRouter(prefix="/logins", tags=["login"])
LoginAD = APIRouter(prefix="/loginad", tags=["loginad"])

@Login.post("/login/", response_model=schemas.login.UserAccountResponse | dict[str,str])
async def post_create_Client_endpoint(loginValues: schemas.login.LoginStructure, db: Session = Depends(get_db)):
    """
    api pour insertion de mots de passe
    """
    try:
        if loginValues.password:
            # print(loginValues.password)
            if loginValues.email:
                # print(loginValues.username)
                # return loginValues
                # return {'a': 1}
        #         pass
                # print("zcv")
                user = crud.login.login(data=loginValues, db=db)
        #     print("zqqqcv")
        # print("qqqqqzcv")
        
            
    except Exception as e:
        print("asdfg")
        loginValues.username = "0"
        loginValues.password = '0'
    finally:
        if user:
            return user
        else:
            return {"erreur de connexion": 0 }

    # db_client = crud.password.create_password(passwordcrud=clientep, db=db)
    # if db_client is None:
    #     raise HTTPException(status_code=404, detail="Client oups")
    # return db_client
    # return loginValues

# API Routes
@LoginAD.post("/user_a_compte/", response_model=schemas.login.UserAccountResponse)
def create_personnel(personnel: schemas.login.UserAccountBase, password: schemas.login.PasswordBase, db: Session = Depends(get_db)):
    # return crud.login.create_medical_personnel(db, personnel)
    return crud.login.create_user_account_and_password(db, personnel, password)

@LoginAD.get("/user_a_compte/{personnel_id}", response_model=schemas.login.UserAccountResponse)
def read_personnel(personnel_id: int, db: Session = Depends(get_db)):
    personnel = crud.login.get_user_account(db, personnel_id)
    if personnel is None:
        raise HTTPException(status_code=404, detail="Medical personnel not found")
    return personnel

@LoginAD.get("/user_a_compte/", response_model=List[schemas.login.UserAccountResponse])
def read_all_personnel(db: Session = Depends(get_db)):
    return crud.login.get_all_user_account(db)

@LoginAD.put("/user_a_compte/{personnel_id}", response_model=schemas.login.UserAccountResponse)
def update_personnel(personnel_id: int, personnel_update: schemas.login.UserAccountBase, db: Session = Depends(get_db)):
    personnel = crud.login.update_user_account(db, personnel_id, personnel_update)
    if personnel is None:
        raise HTTPException(status_code=404, detail="Medical personnel not found")
    return personnel

@LoginAD.delete("/user_a_compte/{personnel_id}", response_model=schemas.login.UserAccountResponse)
def delete_personnel(personnel_id: int, db: Session = Depends(get_db)):
    personnel = crud.login.delete_user_account(db, personnel_id)
    if personnel is None:
        raise HTTPException(status_code=404, detail="Medical personnel not found")
    return personnel

# @route.post()



# @route.post("/read/password/", response_model=schemas.password.Password | dict[str,str])
# async def post_password_endpoint(password: str, db: Session = Depends(get_db)) -> schemas.password.Password | dict[str,str]:
#     """
#     api pour read de mots de passe
#     """
#     try:
#         db_pwd = crud.password.read_password(db=db, pwd=password)
#         if not db_pwd:
#             raise HTTPException(status_code=404, detail="password non trouvé")
#         return db_pwd
#     except Exception as e:
#         return {"mot de passe":"introuvable{str(e)}"}


