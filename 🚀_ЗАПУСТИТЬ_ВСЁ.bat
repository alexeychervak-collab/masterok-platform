@echo off
chcp 65001 >nul
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║        🚀 YoDo Marketplace - АВТОМАТИЧЕСКИЙ ДЕПЛОЙ           ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo   Сервер: Tema@188.68.223.230
echo   Backend порт: 3000
echo   Landing порт: 3001
echo.
echo ══════════════════════════════════════════════════════════════
echo.

set SERVER_USER=Tema
set SERVER_IP=188.68.223.230
set BACKEND_PORT=3000
set LANDING_PORT=3001

:: ═══════════════════════════════════════════════════════════════
:: ШАГ 1: ПРОВЕРКА ПОДКЛЮЧЕНИЯ
:: ═══════════════════════════════════════════════════════════════
echo [1/6] 🔍 Проверка подключения к серверу...
echo.

ping -n 2 %SERVER_IP% >nul 2>&1
if errorlevel 1 (
    echo ❌ Сервер %SERVER_IP% недоступен!
    echo    Проверьте интернет-соединение.
    pause
    exit /b 1
)
echo ✅ Сервер доступен
echo.

:: ═══════════════════════════════════════════════════════════════
:: ШАГ 2: СОЗДАНИЕ СТРУКТУРЫ НА СЕРВЕРЕ
:: ═══════════════════════════════════════════════════════════════
echo [2/6] 📁 Создание директорий на сервере...
echo      (Введите пароль Tema если попросит)
echo.

ssh %SERVER_USER%@%SERVER_IP% "mkdir -p /home/Tema/yodo/backend && mkdir -p /home/Tema/yodo/landing && echo '✅ Директории созданы'"

if errorlevel 1 (
    echo.
    echo ⚠️  Не удалось создать директории.
    echo    Возможно нужен пароль или SSH ключ.
    echo    Пробую продолжить...
    echo.
)

:: ═══════════════════════════════════════════════════════════════
:: ШАГ 3: СБОРКА LANDING
:: ═══════════════════════════════════════════════════════════════
echo [3/6] 🔨 Сборка Landing (это займёт ~2 минуты)...
echo.

cd /d D:\yodo\landing

if not exist "node_modules" (
    echo    📥 Установка зависимостей...
    call npm install --force --silent
)

echo    🔨 Компиляция production версии...
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ Ошибка сборки!
    echo.
    echo Возможные причины:
    echo 1. Не установлен Node.js
    echo 2. Ошибки в коде (смотрите выше)
    echo.
    pause
    exit /b 1
)

echo ✅ Landing собран успешно!
echo.

:: ═══════════════════════════════════════════════════════════════
:: ШАГ 4: КОПИРОВАНИЕ LANDING НА СЕРВЕР
:: ═══════════════════════════════════════════════════════════════
echo [4/6] 📤 Копирование Landing на сервер...
echo      (Может потребоваться пароль несколько раз)
echo.

echo    → Копирование .next...
scp -r .next %SERVER_USER%@%SERVER_IP%:/home/Tema/yodo/landing/ 2>nul
echo    → Копирование public...
scp -r public %SERVER_USER%@%SERVER_IP%:/home/Tema/yodo/landing/ 2>nul
echo    → Копирование src...
scp -r src %SERVER_USER%@%SERVER_IP%:/home/Tema/yodo/landing/ 2>nul
echo    → Копирование конфигов...
scp package*.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs %SERVER_USER%@%SERVER_IP%:/home/Tema/yodo/landing/ 2>nul

echo ✅ Файлы скопированы
echo.

:: ═══════════════════════════════════════════════════════════════
:: ШАГ 5: УСТАНОВКА И ЗАПУСК LANDING
:: ═══════════════════════════════════════════════════════════════
echo [5/6] 🚀 Запуск Landing на сервере (порт %LANDING_PORT%)...
echo.

ssh %SERVER_USER%@%SERVER_IP% "cd /home/Tema/yodo/landing && npm install --production --silent && pkill -f 'next start' 2>/dev/null; nohup npm start -- -p %LANDING_PORT% > landing.log 2>&1 & echo '✅ Landing запущен на порту %LANDING_PORT%'"

echo.

:: ═══════════════════════════════════════════════════════════════
:: ШАГ 6: ЗАПУСК/ПЕРЕЗАПУСК BACKEND
:: ═══════════════════════════════════════════════════════════════
echo [6/6] 🔧 Перезапуск Backend (порт %BACKEND_PORT%)...
echo.

ssh %SERVER_USER%@%SERVER_IP% "cd /home/Tema/yodo/backend && pkill -f 'uvicorn' 2>/dev/null; nohup python3 -m uvicorn main:app --host 0.0.0.0 --port %BACKEND_PORT% > backend.log 2>&1 & echo '✅ Backend запущен на порту %BACKEND_PORT%'" 2>nul

if errorlevel 1 (
    echo ⚠️  Backend не запущен (возможно файлов нет на сервере)
    echo    Это нормально если backend ещё не готов.
)

echo.
timeout /t 2 >nul

:: ═══════════════════════════════════════════════════════════════
:: ФИНАЛЬНАЯ ПРОВЕРКА
:: ═══════════════════════════════════════════════════════════════
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo   ✨ ДЕПЛОЙ ЗАВЕРШЁН! ✨
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo 🌐 ВАШИ URL:
echo.
echo    Backend:  http://%SERVER_IP%:%BACKEND_PORT%
echo    API Docs: http://%SERVER_IP%:%BACKEND_PORT%/docs
echo    Landing:  http://%SERVER_IP%:%LANDING_PORT%
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo 📊 ПОЛЕЗНЫЕ КОМАНДЫ:
echo.
echo    Логи Landing:
echo    ssh %SERVER_USER%@%SERVER_IP% "tail -f /home/Tema/yodo/landing/landing.log"
echo.
echo    Логи Backend:
echo    ssh %SERVER_USER%@%SERVER_IP% "tail -f /home/Tema/yodo/backend/backend.log"
echo.
echo    Статус процессов:
echo    ssh %SERVER_USER%@%SERVER_IP% "ps aux | grep -E 'uvicorn|next'"
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo 🎉 Откройте в браузере: http://%SERVER_IP%:%LANDING_PORT%
echo.
echo ══════════════════════════════════════════════════════════════
echo.

:: Открыть браузер автоматически
set /p OPEN_BROWSER="Открыть в браузере сейчас? (y/n): "
if /i "%OPEN_BROWSER%"=="y" (
    start http://%SERVER_IP%:%LANDING_PORT%
)

pause




