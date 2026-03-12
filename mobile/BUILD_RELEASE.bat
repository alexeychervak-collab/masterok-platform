@echo off
chcp 65001 >nul
cls

echo ═══════════════════════════════════════════════════════════════════
echo           🏗️  МастерОК - ПОЛНАЯ СБОРКА RELEASE  🏗️
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Этот скрипт соберёт полностью готовое приложение для публикации:
echo   • APK для Google Play
echo   • AAB (Android App Bundle)
echo   • iOS для TestFlight
echo.
echo ═══════════════════════════════════════════════════════════════════
pause

echo.
echo [Шаг 1/6] Проверка Flutter...
echo ────────────────────────────────────────────────────────────────
flutter doctor
echo.

echo [Шаг 2/6] Очистка предыдущих сборок...
echo ────────────────────────────────────────────────────────────────
flutter clean
echo ✅ Очистка завершена
echo.

echo [Шаг 3/6] Получение зависимостей...
echo ────────────────────────────────────────────────────────────────
flutter pub get
echo ✅ Зависимости загружены
echo.

echo [Шаг 4/6] Создание Keystore (если не существует)...
echo ────────────────────────────────────────────────────────────────
if not exist "android\app\masterok-keystore.jks" (
    cd android
    call create-keystore.bat
    cd ..
    echo ✅ Keystore создан
) else (
    echo ✅ Keystore уже существует
)
echo.

echo [Шаг 5/6] Сборка Release APK...
echo ────────────────────────────────────────────────────────────────
REM ВАЖНО: для продакшена/прямой установки делаем один универсальный APK (без SAI/.apks)
flutter build apk --release
echo.
echo ✅ APK собран!
echo    📦 APK: build\app\outputs\flutter-apk\app-release.apk
echo.

echo [Шаг 6/6] Сборка App Bundle (AAB)...
echo ────────────────────────────────────────────────────────────────
flutter build appbundle --release
echo.
echo ✅ App Bundle собран!
echo    📦 AAB: build\app\outputs\bundle\release\app-release.aab
echo.

echo ═══════════════════════════════════════════════════════════════════
echo                    ✅ СБОРКА ЗАВЕРШЕНА! ✅
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 📱 ANDROID:
echo    APK (для прямой установки):
echo      • build\app\outputs\flutter-apk\app-release.apk
echo.
echo    AAB (для Google Play):
echo      • build\app\outputs\bundle\release\app-release.aab
echo.
echo 🍎 iOS:
echo    Для TestFlight выполните:
echo      1. cd ios
echo      2. pod install
echo      3. open Runner.xcworkspace
echo      4. В Xcode: Product → Archive → Distribute App
echo.
echo 📚 Документация:
echo    • DEPLOY_TO_STORES.md - Инструкции по публикации
echo    • README.md - Общая документация
echo.
echo ═══════════════════════════════════════════════════════════════════

pause




