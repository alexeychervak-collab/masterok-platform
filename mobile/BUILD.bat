@echo off
echo ========================================
echo Building MasterOK APK
echo ========================================
cd /d d:\masterok\mobile
flutter build apk --release --verbose > build_log.txt 2>&1
if exist "build\app\outputs\flutter-apk\app-release.apk" (
    echo.
    echo SUCCESS! Copying to Desktop...
    copy "build\app\outputs\flutter-apk\app-release.apk" "%USERPROFILE%\Desktop\MasterOK-release.apk"
    echo APK: %USERPROFILE%\Desktop\MasterOK-release.apk
    explorer /select,"%USERPROFILE%\Desktop\MasterOK-release.apk"
) else (
    echo.
    echo BUILD FAILED! Check build_log.txt
    type build_log.txt | more
)
pause




