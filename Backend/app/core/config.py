import secrets
import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 heures * 7 jours = 7 jours
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"
    
    # SQLite
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", "sqlite:///./restaurant.db")
    # Alias pour DATABASE_URL
    DATABASE_URL: str = ""
    # Pour le DEBUG
    DEBUG: bool = False
    
    # CORS
    ORIGINS: List[AnyHttpUrl] = []

    @field_validator("ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    PROJECT_NAME: str = "Restaurant Manager API"
    
    # Superutilisateur par défaut
    FIRST_SUPERUSER: str = "admin@restaurant.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin"

    model_config = {
        "case_sensitive": True,
        "env_file": ".env",
        "extra": "allow"  # Permet les champs supplémentaires
    }

settings = Settings()
