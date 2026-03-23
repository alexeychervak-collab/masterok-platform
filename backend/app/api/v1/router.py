from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, specialists, categories, services,
    orders, reviews, payment, order_bids, chat,
    uploads, milestones, matching, progress, portfolio,
    verification, disputes, admin, search, blog, faq,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(specialists.router, prefix="/specialists", tags=["Specialists"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(services.router, prefix="/services", tags=["Services"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
api_router.include_router(payment.router, prefix="/payments", tags=["Payments"])
api_router.include_router(order_bids.router, tags=["Order Bids"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])
api_router.include_router(milestones.router, tags=["Milestones"])
api_router.include_router(matching.router, tags=["Matching"])
api_router.include_router(progress.router, tags=["Progress"])
api_router.include_router(portfolio.router, tags=["Portfolio"])
api_router.include_router(verification.router, tags=["Verification"])
api_router.include_router(disputes.router, tags=["Disputes"])
api_router.include_router(admin.router, tags=["Admin"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(blog.router, prefix="/blog", tags=["Blog"])
api_router.include_router(faq.router, prefix="/faq", tags=["FAQ"])
