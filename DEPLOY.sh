#!/bin/bash
# ============================================
# МастерОК — Деплой на сервер
# ============================================
set -e

echo "=========================================="
echo "  МастерОК — Деплой production"
echo "=========================================="

# 1. Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose не установлен."
    exit 1
fi

# 2. Создать папку для APK если нет
mkdir -p downloads

# 3. Остановить старые контейнеры
echo ""
echo "⏹️  Останавливаем старые контейнеры..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# 4. Собрать и запустить
echo ""
echo "🔨 Собираем и запускаем..."
docker compose -f docker-compose.prod.yml up --build -d

# 5. Подождать запуска
echo ""
echo "⏳ Ждём запуска сервисов..."
sleep 10

# 6. Проверить статус
echo ""
echo "📊 Статус контейнеров:"
docker compose -f docker-compose.prod.yml ps

# 7. Проверить здоровье
echo ""
echo "🏥 Проверяем здоровье..."
if curl -s http://localhost/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend API работает"
else
    echo "⚠️  Backend ещё запускается... Подождите 10 секунд"
fi

if curl -s http://localhost > /dev/null 2>&1; then
    echo "✅ Landing работает"
else
    echo "⚠️  Landing ещё запускается..."
fi

echo ""
echo "=========================================="
echo "  ✅ МастерОК запущен!"
echo ""
echo "  🌐 Сайт:     http://localhost"
echo "  📡 API:       http://localhost/api/v1"
echo "  📖 Swagger:   http://localhost/docs"
echo "  📥 APK:       http://localhost/downloads/app-release.apk"
echo ""
echo "  Логи:  docker compose -f docker-compose.prod.yml logs -f"
echo "  Стоп:  docker compose -f docker-compose.prod.yml down"
echo "=========================================="
