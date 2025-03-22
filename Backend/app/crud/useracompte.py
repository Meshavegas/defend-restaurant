from typing import Annotated

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import schemas, models, crud


def read_onse_userAcompte(username: Annotated[str ,"identifiant du compte utilisateur"], db: Annotated[Session, "session de base de donne"] ) -> schemas.useracompte.UserACompte | dict[str, str] :
    """
    Fonction de recuperation d'un compte à base du mon d'utilisateur
    on a besoin des nom d'utilisateur depuis le model UserACompte
    """
    try:
        result = db.query(models.user_a_compte.UserACompte).filter(username == models.user_a_compte.UserACompte.User_name).first()
        if result:
            print(type(result))
            return result
        else:
            return {"detail": "Personne non trouvée"}
    except Exception as e:
        return {"detail": f"Erreur interne du serveur "}


def create_user_compte(db: Session, compte: schemas.useracompte.UserACompteCreate, )->schemas.useracompte.UserACompte  | dict[str, str]:
    """
    Fonction d'insertion d'un compte utilisateur
    """
    try:
            db_user_compte = models.user_a_compte.UserACompte(
                User_name = compte.User_name,
                etat = compte.etat,
                date_creation = compte.date_creation,
                type = compte.type,
            )
            #print(type(db_user_compte))
            db.add(db_user_compte)
            db.commit()
            db.refresh(db_user_compte)
            return db_user_compte
    except IntegrityError as e:
        db.rollback()
        #raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà utilisé")
        return {"status_code=400,": "detail=Nom d'utilisateur déjà utilisé"}
    except Exception as e:
        db.rollback()
        #raise HTTPException(status_code=400, detail=f"Problème de création de compte : {str(e)}")
        return {"status_code=400,": """detail=f"Problème de création de compte : {str(e)}"""}



