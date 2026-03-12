@echo off
chcp 65001 >nul
cls

echo ════════════════════════════════════════════════════════════
echo          🏗️  МастерОК - СБОРКА APK/AAB  🏗️
echo ════════════════════════════════════════════════════════════
echo.

echo [Шаг 1/5] Очистка...
flutter clean
echo ✅ Очищено
echo.

echo [Шаг 2/5] Получение зависимостей...
flutter pub get
echo ✅ Зависимости загружены
echo.

echo [Шаг 3/5] Создание keystore (если нужно)...
cd android\app
if not exist "masterok-keystore.jks" (
    keytool -genkey -v -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -storepass masterok123456 -keypass masterok123456 -alias masterok-key -keystore masterok-keystore.jks -dname "CN=MasterOK, OU=Dev, O=MasterOK, L=Moscow, ST=Moscow, C=RU"
    echo ✅ Keystore создан
) else (
    echo ✅ Keystore существует
)
cd ..\..
echo.

echo [Шаг 4/5] Сборка Release APK (универсальный)...
REM ВАЖНО: универсальный APK ставится стандартным установщиком Android (без SAI)
flutter build apk --release
echo ✅ APK собран
echo.

echo [Шаг 5/5] Сборка App Bundle (AAB)...
flutter build appbundle --release
echo ✅ AAB собран
echo.

echo ════════════════════════════════════════════════════════════
echo                    ✅ ГОТОВО! ✅
echo ════════════════════════════════════════════════════════════
echo.
echo 📦 APK файлы:
dir /b build\app\outputs\flutter-apk\*.apk
echo.
echo 📦 AAB файл:
dir /b build\app\outputs\bundle\release\*.aab
echo.
echo Установка APK на устройство:
echo   adb install build\app\outputs\flutter-apk\app-release.apk
echo.
pause




