@echo off
chcp 65001 >nul
cls

echo ═══════════════════════════════════════════════════════════════════
echo           🏗️  STROYKA - БЫСТРЫЙ ЗАПУСК (ИСПРАВЛЕН)  🏗️
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Этот скрипт запустит Backend и Frontend
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause

echo.
echo [1/2] Запуск Backend (упрощённая версия с SQLite)...
echo ────────────────────────────────────────────────────────────────
cd backend

if not exist "venv" (
    echo [!] Создание виртуального окружения...
    python -m venv venv
)

echo [√] Активация venv...
call venv\Scripts\activate

echo [√] Установка базовых зависимостей...
pip install fastapi uvicorn[standard] -q

echo [√] Проверка .env файла...
if not exist ".env" (
    echo [√] .env файл создан
)

echo [√] Запуск Backend на http://localhost:8000...
echo [√] Swagger: http://localhost:8000/docs
start cmd /k "title STROYKA Backend && cd /d %CD% && venv\Scripts\activate && python app\main_simple.py"

cd ..
timeout /t 3

echo.
echo [2/2] Запуск Frontend...
echo ────────────────────────────────────────────────────────────────
cd landing

echo [√] Проверка node_modules...
if not exist "node_modules" (
    echo [!] Установка npm зависимостей (первый раз, займёт время)...
    call npm install
)

echo [√] Проверка .env.local файла...
if not exist ".env.local" (
    echo [√] .env.local файл создан
)

echo [√] Запуск Frontend на http://localhost:3000...
start cmd /k "title STROYKA Frontend && cd /d %CD% && npm run dev"

cd ..
timeout /t 3

echo.
echo ═══════════════════════════════════════════════════════════════════
echo                    ✅ ВСЁ ЗАПУЩЕНО! ✅
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 📱 Откройте в браузере:
echo.
echo    Backend API:  http://localhost:8000
echo    Swagger Docs: http://localhost:8000/docs
echo    Frontend:     http://localhost:3000
echo.
echo 💡 Для остановки закройте окна терминалов
echo.
echo ═══════════════════════════════════════════════════════════════════

pause

