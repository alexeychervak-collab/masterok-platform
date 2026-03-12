"""
МастерОК Backend - Упрощённая версия для быстрого старта
Без PostgreSQL, с SQLite
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Создаём приложение
app = FastAPI(
    title="МастерОК API",
    description="API для платформы строительных услуг",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Главная страница API"""
    return {
        "message": "МастерОК API v1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/api/v1/health")
async def health():
    """Health check"""
    return {
        "status": "ok",
        "database": "sqlite",
        "version": "1.0.0"
    }


@app.get("/api/v1/specialists")
async def get_specialists():
    """Получить список специалистов (mock данные)"""
    return {
        "specialists": [
            {
                "id": 1,
                "name": "Иван Петров",
                "specialization": "Ремонт квартир",
                "rating": 4.8,
                "price_from": 1500,
                "avatar": "https://via.placeholder.com/150"
            },
            {
                "id": 2,
                "name": "Сергей Иванов",
                "specialization": "Электрика",
                "rating": 4.9,
                "price_from": 2000,
                "avatar": "https://via.placeholder.com/150"
            },
            {
                "id": 3,
                "name": "Алексей Сидоров",
                "specialization": "Сантехника",
                "rating": 4.7,
                "price_from": 1800,
                "avatar": "https://via.placeholder.com/150"
            }
        ]
    }


@app.get("/api/v1/categories")
async def get_categories():
    """Получить список категорий (mock данные)"""
    return {
        "categories": [
            {"id": 1, "name": "Ремонт", "icon": "🔨"},
            {"id": 2, "name": "Электрика", "icon": "⚡"},
            {"id": 3, "name": "Сантехника", "icon": "🚰"},
            {"id": 4, "name": "Отделка", "icon": "🎨"},
            {"id": 5, "name": "Строительство", "icon": "🏗️"},
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)




