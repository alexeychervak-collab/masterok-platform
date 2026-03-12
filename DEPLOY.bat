@echo off
chcp 65001 >nul 2>&1
echo ==========================================
echo   МастерОК — Деплой production
echo ==========================================

REM Создать папку для APK
if not exist downloads mkdir downloads

REM Остановить старые контейнеры
echo.
echo Останавливаем старые контейнеры...
docker compose -f docker-compose.prod.yml down 2>nul

REM Собрать и запустить
echo.
echo Собираем и запускаем...
docker compose -f docker-compose.prod.yml up --build -d

REM Подождать
echo.
echo Ждём запуска сервисов...
timeout /t 15 /nobreak >nul

REM Статус
echo.
echo Статус контейнеров:
docker compose -f docker-compose.prod.yml ps

echo.
echo ==========================================
echo   МастерОК запущен!
echo.
echo   Сайт:     http://localhost
echo   API:       http://localhost/api/v1
echo   Swagger:   http://localhost/docs
echo   APK:       http://localhost/downloads/app-release.apk
echo.
echo   Логи:  docker compose -f docker-compose.prod.yml logs -f
echo   Стоп:  docker compose -f docker-compose.prod.yml down
echo ==========================================
pause
