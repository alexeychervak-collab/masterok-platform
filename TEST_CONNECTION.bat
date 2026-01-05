@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔍 Тест подключения к серверу
echo ========================================
echo.

set SERVER_USER=Tema
set SERVER_IP=188.68.223.230

echo Сервер: %SERVER_USER%@%SERVER_IP%
echo.

echo [1/4] Проверка доступности сервера (ping)...
ping -n 3 %SERVER_IP%

if errorlevel 1 (
    echo ❌ Сервер недоступен!
    echo Проверьте интернет-соединение.
    pause
    exit /b 1
) else (
    echo ✅ Сервер доступен
)

echo.
echo [2/4] Проверка SSH порта (22)...
powershell -Command "Test-NetConnection -ComputerName %SERVER_IP% -Port 22"

echo.
echo [3/4] Попытка подключения SSH...
echo (Введите пароль если попросит)
echo.

ssh -o ConnectTimeout=10 %SERVER_USER%@%SERVER_IP% "echo '✅ SSH подключение работает!' && hostname && pwd && ls -la"

if errorlevel 1 (
    echo.
    echo ❌ SSH подключение не удалось!
    echo.
    echo Возможные причины:
    echo 1. Неправильный пароль
    echo 2. SSH сервер не запущен
    echo 3. Firewall блокирует порт 22
    echo.
    echo Попробуйте:
    echo - Проверить пароль
    echo - Связаться с администратором сервера
    echo.
) else (
    echo.
    echo ✅ Все работает!
    echo.
)

echo.
echo [4/4] Проверка директорий на сервере...
ssh %SERVER_USER%@%SERVER_IP% "ls -la /home/Tema/yodo/ 2>&1 || echo 'Директория не существует'"

echo.
echo ========================================
echo   Результаты теста
echo ========================================
echo.
echo Если все тесты прошли успешно, можете:
echo 1. Запустить: SETUP_SERVER.bat
echo 2. Затем: DEPLOY_FIXED.bat
echo.

pause




