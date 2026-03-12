@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo    МастерОК v1.0.4 - Установка на Samsung через ADB
echo ═══════════════════════════════════════════════════════════
echo.

REM Проверка ADB
where adb >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ADB не найден!
    echo.
    echo Установите Android SDK Platform Tools:
    echo https://developer.android.com/studio/releases/platform-tools
    echo.
    pause
    exit /b 1
)

echo ✅ ADB найден
echo.

REM Проверка подключения устройства
echo 🔍 Поиск подключенных устройств...
adb devices
echo.

REM Определение архитектуры устройства
echo 🔍 Определение архитектуры устройства...
for /f "tokens=*" %%i in ('adb shell getprop ro.product.cpu.abi') do set ARCH=%%i
echo Архитектура: %ARCH%
echo.

REM Выбор APK
set APK_FILE=MasterOK-v1.0.4-arm64.apk
if "%ARCH%"=="armeabi-v7a" set APK_FILE=MasterOK-v1.0.4-armv7.apk
if "%ARCH%"=="arm64-v8a" set APK_FILE=MasterOK-v1.0.4-arm64.apk

echo 📦 Выбран APK: %APK_FILE%
echo.

REM Проверка наличия APK
if not exist "%APK_FILE%" (
    echo ❌ Файл %APK_FILE% не найден!
    echo.
    pause
    exit /b 1
)

REM Удаление старой версии
echo 🗑️  Удаление старой версии (если есть)...
adb uninstall com.masterok.app >nul 2>&1
echo.

REM Установка APK
echo 📲 Установка %APK_FILE%...
adb install -r "%APK_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo    ✅ МастерОК успешно установлен на Samsung!
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo 🚀 Запустить приложение? (Y/N)
    choice /c YN /n /m "Ваш выбор: "
    if errorlevel 2 goto :end
    if errorlevel 1 goto :launch
) else (
    echo.
    echo ❌ Ошибка установки!
    echo.
    pause
    exit /b 1
)

:launch
echo.
echo 🚀 Запуск МастерОК...
adb shell am start -n com.masterok.app/.MainActivity
echo.
echo ✅ Приложение запущено!

:end
echo.
pause

