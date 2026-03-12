# 🏗️ МастерОК - Платформа строительных услуг

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Flutter](https://img.shields.io/badge/Flutter-3.16%2B-blue)](https://flutter.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com)
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success)](/)

> Современная платформа для поиска строительных специалистов с безопасными платежами через ЮKassa и real-time коммуникацией

![МастерОК Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=МастерОК+-+Платформа+строительных+услуг)

---

## 🎯 Возможности

- 💳 **Безопасные платежи** - Эскроу-счета через ЮKassa (холдирование, capture, refund)
- 🔔 **Push-уведомления** - Firebase Cloud Messaging для iOS и Android
- 💬 **Real-time чат** - WebSocket общение между клиентами и специалистами
- 🔍 **Умный поиск** - Поиск специалистов по компетенциям и локации
- ⭐ **Рейтинг и отзывы** - Система оценок с верификацией
- 📱 **Мобильное приложение** - Flutter для iOS и Android
- 🌐 **Современный лендинг** - Next.js 14 с App Router
- 🔐 **Безопасность** - JWT аутентификация, шифрование данных

---

## 📁 Структура проекта

```
masterok/
├── 📱 mobile/          # Flutter приложение (iOS + Android)
├── 🌐 landing/         # Next.js лендинг
├── ⚡ backend/         # FastAPI бэкенд
└── 📚 docs/            # Документация
```

---

## 🚀 Быстрый старт

### Требования

- **Node.js** 18+
- **Python** 3.11+
- **Flutter** 3.16+
- **PostgreSQL** 14+

### Backend (5 минут)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows или source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Настроить переменные
uvicorn app.main:app --reload
```

✅ Backend: http://localhost:8000  
📚 Swagger: http://localhost:8000/docs

### Frontend (5 минут)

```bash
cd landing
npm install
cp .env.example .env.local  # Настроить переменные
npm run dev
```

✅ Frontend: http://localhost:3000

### Mobile (5 минут)

```bash
cd mobile
flutter pub get
flutter run
```

---

## 🌍 Прод‑деплой (сайт + API + web‑версия)

См. **`PRODUCTION_SERVER_COMMANDS.md`** — там готовые команды для сервера (Docker Compose + Nginx в контейнере), и как добавить:

- `/webapp/` (Flutter Web)
- `/downloads/app-release.apk` (ссылка на APK на сайте)

---

## 📱 Сборка мобильного приложения

### Android APK

```bash
cd mobile

# Автоматическая сборка
build-apk.bat  # Windows
./build-apk.sh  # Mac/Linux

# Результат: build/app/outputs/flutter-apk/app-release.apk
```

### iOS IPA

```bash
cd mobile/ios
pod install
open Runner.xcworkspace
# В Xcode: Product → Archive → Distribute
```

---

## 💳 Интеграция ЮKassa

### Настройка

1. Зарегистрироваться на [yookassa.ru](https://yookassa.ru)
2. Получить `shopId` и `secretKey`
3. Добавить в `backend/.env`:

```env
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=live_XXXXXXXXXXXXX
```

4. Настроить webhook: `https://api.masterok.ru/api/v1/payment/webhook`

### Схема эскроу-платежей

```
1. Клиент создаёт заказ
   ↓
2. Клиент оплачивает → Средства холдируются
   ↓
3. Специалист выполняет работу
   ↓
4. Клиент подтверждает → Capture → Деньги специалисту
   
   Или: Спор → Refund → Возврат клиенту
```

### API Endpoints

```http
POST /api/v1/payment/create   - Создать платёж (холдирование)
POST /api/v1/payment/capture  - Подтвердить платёж
POST /api/v1/payment/refund   - Вернуть платёж
GET  /api/v1/payment/{id}     - Статус платежа
POST /api/v1/payment/webhook  - Webhook от ЮKassa
```

---

## 🔥 Интеграция Firebase

### Настройка

1. Создать проект на [Firebase Console](https://console.firebase.google.com)
2. Добавить Android app (`com.masterok.app`)
3. Скачать `google-services.json` → `mobile/android/app/`
4. Добавить iOS app (`com.masterok.app`)
5. Скачать `GoogleService-Info.plist` → `mobile/ios/Runner/`
6. Включить Cloud Messaging

### Типы уведомлений

- 🔔 Новый заказ по компетенциям
- 💬 Новое сообщение в чате
- 💰 Оплата получена
- ⭐ Новый отзыв
- 📋 Изменение статуса заказа

---

## 🏗️ Архитектура

### Backend Stack

- **Framework:** FastAPI (async)
- **Database:** PostgreSQL + SQLAlchemy
- **Auth:** JWT токены
- **Payments:** ЮKassa SDK
- **Notifications:** Firebase Admin SDK
- **WebSocket:** Real-time чат

### Frontend Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State:** React Context + Hooks
- **Forms:** React Hook Form

### Mobile Stack

- **Framework:** Flutter 3.16+
- **Language:** Dart 3.2+
- **State:** Riverpod
- **Routing:** GoRouter
- **HTTP:** Dio + Retrofit
- **Storage:** FlutterSecureStorage

---

## 📚 Документация

### Для второго разработчика

**Начните здесь:**

1. 📄 [START_HERE.md](START_HERE.md) - Входная точка
2. 📄 [🎯_ДЛЯ_ВТОРОГО_РАЗРАБОТЧИКА.md](🎯_ДЛЯ_ВТОРОГО_РАЗРАБОТЧИКА.md) - Пошаговый гайд (60 минут)
3. 📄 [🏗️_MasterOK_FINAL_PACKAGE.md](🏗️_MasterOK_FINAL_PACKAGE.md) - Технические детали

### Специализированные гайды

- [mobile/BUILD_APK.md](mobile/BUILD_APK.md) - Сборка Android
- [mobile/DEVELOPER_GUIDE.md](mobile/DEVELOPER_GUIDE.md) - Разработка мобилки
- [mobile/README_RU.md](mobile/README_RU.md) - Русская документация
- [DEPLOYMENT_COMPLETE_GUIDE.md](DEPLOYMENT_COMPLETE_GUIDE.md) - Деплой

---

## 🔌 API Документация

### Основные endpoints

```http
# Аутентификация
POST /api/v1/auth/register      - Регистрация
POST /api/v1/auth/login         - Вход
POST /api/v1/auth/refresh       - Обновить токен

# Специалисты
GET  /api/v1/specialists        - Список специалистов
GET  /api/v1/specialists/{id}   - Профиль специалиста
POST /api/v1/specialists        - Создать профиль

# Заказы
GET  /api/v1/orders             - Список заказов
POST /api/v1/orders             - Создать заказ
PUT  /api/v1/orders/{id}        - Обновить заказ

# Платежи
POST /api/v1/payment/create     - Создать платёж
POST /api/v1/payment/capture    - Подтвердить платёж
POST /api/v1/payment/refund     - Вернуть платёж

# Чат
WS   /ws/chat/{chat_id}         - WebSocket чат
GET  /api/v1/chat/{chat_id}     - История сообщений
```

**Полная документация:** http://localhost:8000/docs

---

## 🌍 Деплой

### Backend (Heroku)

```bash
heroku create masterok-api
heroku addons:create heroku-postgresql:mini
git subtree push --prefix backend heroku main
heroku run alembic upgrade head
```

### Frontend (Vercel)

```bash
cd landing
vercel --prod
```

### Mobile (Google Play)

```bash
cd mobile
flutter build appbundle --release
# Загрузить в Play Console
```

---

## 🧪 Тестирование

### Backend

```bash
cd backend
pytest tests/ -v
```

### Frontend

```bash
cd landing
npm test
```

### Mobile

```bash
cd mobile
flutter test
```

---

## 🛠️ Разработка

### Установка зависимостей

```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install

# Mobile
flutter pub get
```

### Миграции базы данных

```bash
cd backend

# Создать миграцию
alembic revision -m "Description"

# Применить
alembic upgrade head

# Откатить
alembic downgrade -1
```

### Генерация кода (Mobile)

```bash
cd mobile
flutter pub run build_runner build --delete-conflicting-outputs
```

---

## 📊 Статистика проекта

- 📝 **Код:** ~30,000 строк
- 📚 **Документация:** ~6,000 строк
- 📦 **Dependencies:** 100+ пакетов
- 🔌 **API endpoints:** 40+
- 📄 **Страницы:** 30+
- 📱 **Экраны:** 25+
- ⏱️ **Время сборки APK:** 15 минут
- 💯 **Готовность:** 100%

---

## 🤝 Вклад в проект

Мы приветствуем вклад от сообщества!

1. Fork проекта
2. Создайте feature ветку (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

## 📞 Поддержка

- 🐛 **Issues:** [GitHub Issues](https://github.com/YOUR/masterok-platform/issues)
- 📧 **Email:** dev@masterok.ru
- 💬 **Telegram:** @masterok_dev
- 📖 **Docs:** [START_HERE.md](START_HERE.md)

---

## 🙏 Благодарности

- [Flutter](https://flutter.dev) - За отличный фреймворк
- [Next.js](https://nextjs.org) - За современный React
- [FastAPI](https://fastapi.tiangolo.com) - За быстрый API
- [ЮKassa](https://yookassa.ru) - За безопасные платежи
- [Firebase](https://firebase.google.com) - За push-уведомления

---

## 🎉 Production Ready!

**МастерОК готов к запуску!**

Все компоненты протестированы и готовы к production использованию:

✅ Backend с API  
✅ Frontend с лендингом  
✅ Mobile приложение (iOS + Android)  
✅ ЮKassa безопасные платежи  
✅ Firebase push-уведомления  
✅ WebSocket real-time чат  
✅ Comprehensive документация  

**Начните с [START_HERE.md](START_HERE.md) прямо сейчас! 🚀**

---

<div align="center">
  
**Сделано с ❤️ для российского рынка строительства**

[Документация](START_HERE.md) · [API](http://localhost:8000/docs) · [Issues](https://github.com/YOUR/masterok-platform/issues)

</div>
