
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Password(Base):
    __tablename__ = 'password'

    id = Column(Integer, ForeignKey('user_account.id'), primary_key=True)  # Fixed table reference
    password_ = Column(String(254), index=True)

    user_account = relationship("User", back_populates="compte_securities")
