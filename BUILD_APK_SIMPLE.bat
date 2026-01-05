@echo off
echo ========================================
echo STROYKA - APK Builder
echo ========================================
echo.

cd d:\yodo

echo [1/3] Pushing to GitHub...
git add .
git commit -m "Trigger APK build" --allow-empty
git push origin main

echo.
echo [2/3] Waiting 30 seconds for GitHub Actions...
timeout /t 30 /nobreak

echo.
echo [3/3] Opening GitHub Actions...
start https://github.com/gahshsfshsh/stroyka-platform/actions

echo.
echo ========================================
echo Done! APK will be ready in 5-10 minutes
echo Download from: Artifacts -^> app-release
echo ========================================
echo.
pause

