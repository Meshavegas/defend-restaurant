from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base, TimestampMixin

class Category(Base, TimestampMixin):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    
    # Relations
    menu_items = relationship("MenuItem", back_populates="category")
    

class MenuItem(Base, TimestampMixin):
    __tablename__ = "menu_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    preparation_time = Column(Integer, nullable=True)  # temps en minutes
    
    # Relations
    category = relationship("Category", back_populates="menu_items")
    order_items = relationship("OrderItem", back_populates="menu_item")
