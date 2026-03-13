# MasterOK Platform — Project Memory

## Описание
МастерОК — маркетплейс строительных услуг (аналог profi.ru / yodu / авито).
Цель: связать заказчиков с мастерами строительных специальностей.

## Стек
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, SQLAlchemy async, PostgreSQL
- **Деплой**: Docker Compose (postgres + backend + landing + nginx)
- **Сервер**: 77.105.168.219 (Ubuntu 22.04)
- **GitHub**: alexeychervak-collab/masterok-platform

## Архитектура

### Frontend (landing/)
- 48 страниц, SSR + клиентские компоненты
- `Providers.tsx` — обёртка с AuthProvider
- `api-adapter.ts` — сначала API, потом fallback на моки
- `mock-data.ts` — 20 категорий, 50 специалистов, заказы, отзывы
- `api.ts` — HTTP-клиент с относительными URL (/api/v1)

### Backend (backend/)
- 36 async эндпоинтов, JWT авторизация
- `seed.py` — идемпотентный сид: 20 категорий, 80 скиллов, 50 специалистов, 150 сервисов, 30 заказов, 200+ отзывов
- Эскроу-платежи через YooKassa (15% комиссия, 7% Premium)
- CORS: localhost + 77.105.168.219 + masterok.ru

### Деплой
- `docker-compose.prod.yml`: postgres → backend → landing → nginx
- nginx: /api/ → backend:8000, / → landing:3000
- NODE_OPTIONS="--max_old_space_size=1536" для билда

## Важные паттерны
- SSR: всегда `typeof window !== 'undefined'` перед navigator/localStorage
- Все useAuth() только в клиентских компонентах ('use client')
- Seed запускается автоматически при первом старте через main.py lifespan

## Текущий статус
- Все 48 страниц готовы и обогащены контентом
- Backend API работает, seed автоматический
- Docker Compose настроен для продакшена
- Логин и регистрация подключены к реальному API
