# YODO Backend API

Python FastAPI бэкенд для платформы YODO.

## Технологии

- FastAPI
- SQLAlchemy + asyncpg
- PostgreSQL
- JWT авторизация
- YooKassa интеграция

## Установка

```bash
# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск
uvicorn app.main:app --reload
```

## Переменные окружения

Создайте `.env` файл:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/yodo
SECRET_KEY=your-secret-key
DEBUG=true
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
```

## API Documentation

После запуска доступно:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Структура

```
app/
├── main.py              # Entry point
├── core/
│   ├── config.py        # Настройки
│   └── security.py      # JWT, хеширование
├── db/
│   ├── base.py          # Base model
│   └── session.py       # Database session
├── models/              # SQLAlchemy модели
├── schemas/             # Pydantic схемы
└── api/v1/
    ├── router.py        # Main router
    └── endpoints/       # API endpoints
```

## Docker

```bash
docker build -t yodo-api .
docker run -p 8000:8000 yodo-api
```

## Endpoints

```
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/users/me
GET  /api/v1/specialists
GET  /api/v1/specialists/{id}
POST /api/v1/specialists
GET  /api/v1/categories
POST /api/v1/services
GET  /api/v1/services/specialist/{id}
POST /api/v1/orders
POST /api/v1/orders/{id}/accept
POST /api/v1/orders/{id}/complete
POST /api/v1/orders/{id}/cancel
GET  /api/v1/reviews/specialist/{id}
POST /api/v1/reviews
```




