from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, menu_item, category

api_router = APIRouter()

# Inclusion des routes spécifiques
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(reservations.router, prefix="/reservations", tags=["reservations"])
api_router.include_router(menu_item.router, prefix="/menu-items", tags=["menu-items"])
api_router.include_router(category.router, prefix="/categories", tags=["categories"])
# api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
# api_router.include_router(delivery.router, prefix="/delivery", tags=["delivery"])