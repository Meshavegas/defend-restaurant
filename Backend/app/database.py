from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Créer une instance de moteur pour SqLite
DATABASE_URL = "sqlite:///./app/database.db"

# Créer le moteur
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Créer une session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Créer toutes les tables
Base = declarative_base()

# Fonctions pour obtenir une session
def get_db():
    try:
        db = SessionLocal()
        yield db
        # print("database call")
    finally:
        db.close()