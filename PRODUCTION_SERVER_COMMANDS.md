# МастерОК — прод‑запуск (backend + landing + web + mobile)

Ниже — **готовые команды для сервера**, чтобы работало:
- **Сайт (landing)** — `http://YOUR_DOMAIN/`
- **API** — `http://YOUR_DOMAIN/api/v1/...`
- **Swagger** — `http://YOUR_DOMAIN/docs`
- **Веб‑версия приложения (Flutter Web)** — `http://YOUR_DOMAIN/webapp/`
- **Ссылка на APK** — `http://YOUR_DOMAIN/downloads/app-release.apk`

## 1) Подготовка сервера (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y git docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

## 2) Клонирование и запуск прод‑стека (Docker Compose)

```bash
cd ~
git clone <ВАШ_REPO_URL> masterok-platform
cd masterok-platform

# Прод запуск (nginx внутри compose, слушает 80 порт)
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

Проверка:

```bash
curl -s http://127.0.0.1/api/v1 | head
curl -s http://127.0.0.1/ | head
curl -s http://127.0.0.1/health | head
```

## 3) Как добавить веб‑приложение (Flutter Web) на сайт

Flutter Web должен быть собран с base‑href `/webapp/` и размещён в `landing/public/webapp/`.

### Вариант A (локально на ПК разработчика, потом залить на сервер)

На ПК:

```bash
cd mobile
flutter build web --release --base-href /webapp/ --dart-define=API_BASE_URL=https://YOUR_DOMAIN/api/v1
```

Скопировать результат:

- из `mobile/build/web/*`
- в `landing/public/webapp/*`

Далее пересобрать landing контейнер:

```bash
cd ..
docker compose -f docker-compose.prod.yml up -d --build landing
```

### Вариант B (собирать Flutter Web прямо на сервере)

Требует установленный Flutter на сервере (обычно не делают, но можно).

## 4) Как добавить ссылку на APK на сайте

Положите APK в файл:

`landing/public/downloads/app-release.apk`

И пересоберите landing:

```bash
docker compose -f docker-compose.prod.yml up -d --build landing
```

## 5) Настройка реальной ЮKassa (опционально, прод‑оплата)

В `docker-compose.prod.yml` для `backend` задайте:

```env
YOOKASSA_SHOP_ID=...
YOOKASSA_SECRET_KEY=...
SECRET_KEY=...
```

Перезапуск:

```bash
docker compose -f docker-compose.prod.yml up -d --build backend
```

## 6) Полезные команды (операторские)

```bash
# Логи
docker compose -f docker-compose.prod.yml logs -f --tail=200

# Логи конкретного сервиса
docker compose -f docker-compose.prod.yml logs -f --tail=200 backend
docker compose -f docker-compose.prod.yml logs -f --tail=200 landing
docker compose -f docker-compose.prod.yml logs -f --tail=200 nginx

# Остановка/запуск
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```




