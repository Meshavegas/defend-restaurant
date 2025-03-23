from fastapi import APIRouter

from app.api.v1.endpoints import auth, users

api_router = APIRouter()

# Inclusion des routes spécifiques
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(reservations.router, prefix="/reservations", tags=["reservations"])
# # api_router.include_router(menu.router, prefix="/menu", tags=["menu"])
# api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
# api_router.include_router(delivery.router, prefix="/delivery", tags=["delivery"])