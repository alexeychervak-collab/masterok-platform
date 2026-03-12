@echo off
echo ========================================
echo MasterOK - Final APK Build
echo ========================================

REM Set Android SDK path
set ANDROID_HOME=C:\Users\User\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin;%PATH%

echo Android SDK: %ANDROID_HOME%
echo.

cd /d d:\masterok\mobile

echo [1/4] Cleaning...
call flutter clean

echo.
echo [2/4] Getting dependencies...
call flutter pub get

echo.
echo [3/4] Building APK (this takes 5-10 minutes)...
call flutter build apk --release

echo.
echo [4/4] Checking result...
if exist "build\app\outputs\flutter-apk\app-release.apk" (
    echo.
    echo ========================================
    echo   SUCCESS! APK IS READY!
    echo ========================================
    copy "build\app\outputs\flutter-apk\app-release.apk" "%USERPROFILE%\Desktop\MasterOK-release.apk"
    echo.
    echo APK location:
    echo   1. build\app\outputs\flutter-apk\app-release.apk
    echo   2. %USERPROFILE%\Desktop\MasterOK-release.apk
    echo.
    echo Opening folder...
    explorer /select,"%USERPROFILE%\Desktop\MasterOK-release.apk"
) else (
    echo.
    echo ========================================
    echo   BUILD FAILED!
    echo ========================================
    echo Check the errors above.
)

echo.
pause




