@echo off
chcp 65001 > nul
cls
echo ═══════════════════════════════════════════════════════════════
echo     🔧 ЗАПУСК BACKEND API
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📦 Установка зависимостей Python...
echo.

cd backend
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo.
    echo ❌ Ошибка при установке зависимостей!
    pause
    exit /b 1
)

echo.
echo ✅ Зависимости установлены!
echo.
echo 🚀 Запуск FastAPI сервера...
echo.
echo 📍 API будет доступен на: http://localhost:8000
echo 📍 Docs: http://localhost:8000/docs
echo.
echo ⚠️  Для остановки нажмите Ctrl+C
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

uvicorn app.main:app --reload

pause



