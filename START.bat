@echo off
chcp 65001 > nul
cls
echo ═══════════════════════════════════════════════════════════════
echo     🚀 ЗАПУСК YODO MARKETPLACE
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📦 Установка зависимостей...
echo.

cd landing
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Ошибка при установке зависимостей!
    pause
    exit /b 1
)

echo.
echo ✅ Зависимости установлены!
echo.
echo 🚀 Запуск dev сервера...
echo.
echo 📍 Сайт будет доступен на: http://localhost:3000
echo.
echo ⚠️  Для остановки нажмите Ctrl+C
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

call npm run dev

pause



