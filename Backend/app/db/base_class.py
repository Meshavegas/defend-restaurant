from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, DateTime
from datetime import datetime

# app/database.py
from sqlalchemy import create_engine 

SQLALCHEMY_DATABASE_URL = "sqlite:///./restaurant.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
Base = declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine)


class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
