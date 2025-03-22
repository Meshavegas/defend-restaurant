from . import  login
from app.database import engine, Base
from fastapi import FastAPI

app = FastAPI()

Base.metadata.create_all(bind=engine)# Créer les tables de la base de données
"""models.personne.Base.metadata.create_all(bind=engine)
models.profil.Base.metadata.create_all(bind=engine)
models.adress.Base.metadata.create_all(bind=engine)
models.user_compte.Base.metadata.create_all(bind=engine)
models.compte_security.Base.metadata.create_all(bind=engine)"""


# Inclure les routes des API
app.include_router(login.Login)
app.include_router(login.LoginAD)