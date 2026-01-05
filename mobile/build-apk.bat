@echo off
chcp 65001 >nul
echo ========================================
echo 📱 YODO Mobile App - Сборка APK
echo ========================================
echo.

REM Проверка Flutter
echo [1/6] Проверка Flutter установки...
flutter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Flutter не установлен или не добавлен в PATH!
    echo Установите Flutter: https://docs.flutter.dev/get-started/install
    pause
    exit /b 1
)
echo ✅ Flutter найден

REM Проверка окружения
echo.
echo [2/6] Проверка окружения разработки...
flutter doctor
echo.
pause

REM Очистка
echo [3/6] Очистка предыдущей сборки...
flutter clean
echo ✅ Очистка завершена

REM Установка зависимостей
echo.
echo [4/6] Установка зависимостей...
flutter pub get
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки зависимостей!
    pause
    exit /b 1
)
echo ✅ Зависимости установлены

REM Выбор типа сборки
echo.
echo [5/6] Выберите тип сборки:
echo.
echo 1. Debug APK (для тестирования)
echo 2. Release APK (для публикации)
echo 3. Split APKs (оптимизированные)
echo 4. App Bundle (для Google Play)
echo.
set /p choice="Введите номер (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🔨 Сборка Debug APK...
    flutter build apk --debug
    set "output=build\app\outputs\flutter-apk\app-debug.apk"
)

if "%choice%"=="2" (
    echo.
    echo 🔨 Сборка Release APK...
    flutter build apk --release
    set "output=build\app\outputs\flutter-apk\app-release.apk"
)

if "%choice%"=="3" (
    echo.
    echo 🔨 Сборка Split APKs...
    flutter build apk --split-per-abi --release
    set "output=build\app\outputs\flutter-apk\"
)

if "%choice%"=="4" (
    echo.
    echo 🔨 Сборка App Bundle...
    flutter build appbundle --release
    set "output=build\app\outputs\bundle\release\app-release.aab"
)

if %errorlevel% neq 0 (
    echo.
    echo ❌ Ошибка сборки!
    echo.
    echo Попробуйте:
    echo 1. flutter clean
    echo 2. flutter pub get
    echo 3. Проверьте android/local.properties
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Сборка успешно завершена!
echo ========================================
echo.
echo 📦 APK находится в:
echo %output%
echo.
echo 📊 Информация о сборке:
dir "%output%" 2>nul

echo.
echo [6/6] Установить на подключенное устройство? (Y/N)
set /p install="Ваш выбор: "

if /i "%install%"=="Y" (
    echo.
    echo 🔌 Проверка подключенных устройств...
    adb devices
    echo.
    echo 📲 Установка APK...
    if "%choice%"=="1" (
        adb install -r "%output%"
    )
    if "%choice%"=="2" (
        adb install -r "%output%"
    )
    if "%choice%"=="3" (
        echo Выберите нужный APK и установите вручную из:
        echo %output%
        explorer "%output%"
    )
    
    if %errorlevel% equ 0 (
        echo ✅ Установка завершена!
    ) else (
        echo ❌ Ошибка установки. Убедитесь что устройство подключено.
    )
)

echo.
echo 🎉 Готово!
echo.
pause

