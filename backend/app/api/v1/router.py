from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, specialists, categories, services, orders, reviews

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(specialists.router, prefix="/specialists", tags=["Specialists"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(services.router, prefix="/services", tags=["Services"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])




