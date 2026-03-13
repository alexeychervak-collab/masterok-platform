from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.session import engine
from app.db.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Auto-seed if database is empty
    try:
        from app.seed import seed_database
        await seed_database()
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f"Seed skipped: {e}")

    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="МастерОК API",
    description="API платформы строительных услуг МастерОК",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "name": "МастерОК API",
        "version": "2.0.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}




