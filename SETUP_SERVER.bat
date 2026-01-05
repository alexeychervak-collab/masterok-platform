@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔧 Настройка сервера YoDo
echo ========================================
echo.
echo Сервер: Tema@188.68.223.230
echo.

set SERVER_USER=Tema
set SERVER_IP=188.68.223.230

echo Шаг 1: Подключаемся к серверу и создаем структуру...
echo.

ssh %SERVER_USER%@%SERVER_IP% "bash -s" << 'ENDSSH'
    echo "Создание директорий..."
    mkdir -p /home/Tema/yodo/backend
    mkdir -p /home/Tema/yodo/landing
    
    echo "Проверка установленных пакетов..."
    
    # Проверка Node.js
    if ! command -v node &> /dev/null; then
        echo "Node.js не установлен. Устанавливаем..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "✅ Node.js уже установлен: $(node -v)"
    fi
    
    # Проверка Python
    if ! command -v python3 &> /dev/null; then
        echo "Python не установлен. Устанавливаем..."
        sudo apt-get update
        sudo apt-get install -y python3 python3-pip
    else
        echo "✅ Python уже установлен: $(python3 --version)"
    fi
    
    # Проверка PM2
    if ! command -v pm2 &> /dev/null; then
        echo "PM2 не установлен. Устанавливаем..."
        sudo npm install -g pm2
    else
        echo "✅ PM2 уже установлен"
    fi
    
    echo ""
    echo "✅ Сервер настроен!"
    echo "Структура директорий:"
    ls -la /home/Tema/yodo/
ENDSSH

if errorlevel 1 (
    echo.
    echo ❌ Ошибка подключения к серверу!
    echo.
    echo Проверьте:
    echo 1. Доступность сервера: ping 188.68.223.230
    echo 2. SSH доступ: ssh Tema@188.68.223.230
    echo 3. Правильность пароля
    echo.
    echo Если SSH спрашивает пароль, введите его.
    echo Если получаете "Connection refused", проверьте SSH на сервере.
    echo.
) else (
    echo.
    echo ========================================
    echo   ✅ Сервер готов!
    echo ========================================
    echo.
    echo Теперь можете запустить: DEPLOY_FIXED.bat
    echo.
)

pause




