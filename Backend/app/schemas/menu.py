from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

# Schéma de base pour Category
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name: Optional[str] = None

class CategoryInDBBase(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
       
        from_attributes = True

class Category(CategoryInDBBase):
    pass

# Schéma de base pour MenuItem
class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    is_available: bool = True
    category_id: Optional[int] = None
    preparation_time: Optional[int] = None
    image_url: Optional[str] = None 

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(MenuItemBase):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    is_available: Optional[bool] = None
    category_id: Optional[int] = None
    preparation_time: Optional[int] = None
    image_url: Optional[str] = None

class MenuItemInDBBase(MenuItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config: 
        from_attributes = True

class MenuItem(MenuItemInDBBase):
    pass

class MenuItemWithCategory(MenuItem):
    category: Category