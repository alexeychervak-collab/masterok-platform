@echo off
echo ========================================
echo MasterOK - Quick APK Build
echo ========================================

set ANDROID_HOME=C:\Users\User\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%PATH%

cd /d d:\masterok\mobile

echo [1/2] Getting dependencies...
call flutter pub get

echo.
echo [2/2] Building APK (5-7 minutes)...
call flutter build apk --release

echo.
if exist "build\app\outputs\flutter-apk\app-release.apk" (
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    copy "build\app\outputs\flutter-apk\app-release.apk" "%USERPROFILE%\Desktop\MasterOK-release.apk"
    echo.
    echo APK: %USERPROFILE%\Desktop\MasterOK-release.apk
    explorer /select,"%USERPROFILE%\Desktop\MasterOK-release.apk"
) else (
    echo BUILD FAILED!
)
pause




