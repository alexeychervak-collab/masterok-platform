@echo off
echo ========================================
echo MasterOK - Clean Build APK
echo ========================================
cd /d d:\masterok\mobile

echo [1/5] Deep cleaning...
flutter clean
rmdir /s /q build 2>nul
rmdir /s /q android\.gradle 2>nul
rmdir /s /q android\app\build 2>nul

echo.
echo [2/5] Getting dependencies...
flutter pub get

echo.
echo [3/5] Building APK...
flutter build apk --release

echo.
echo [4/5] Checking result...
if exist "build\app\outputs\flutter-apk\app-release.apk" (
    echo.
    echo ========================================
    echo   SUCCESS! APK IS READY!
    echo ========================================
    copy "build\app\outputs\flutter-apk\app-release.apk" "%USERPROFILE%\Desktop\MasterOK-release.apk"
    echo.
    echo APK: %USERPROFILE%\Desktop\MasterOK-release.apk
    echo.
    explorer /select,"%USERPROFILE%\Desktop\MasterOK-release.apk"
) else (
    echo.
    echo BUILD FAILED!
)

echo.
pause




