# STROYKA - Auto Build and Download APK
Write-Host "🚀 STROYKA APK Auto Builder" -ForegroundColor Cyan

# 1. Запушить изменения
Write-Host "`n📤 Pushing changes to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "Trigger APK build" --allow-empty
git push origin main

Write-Host "`n⏳ Waiting for GitHub Actions to start (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# 2. Открыть GitHub Actions в браузере
Write-Host "`n🌐 Opening GitHub Actions..." -ForegroundColor Yellow
Start-Process "https://github.com/gahshsfshsh/stroyka-platform/actions"

Write-Host "`n✅ Скрипт завершён!" -ForegroundColor Green
Write-Host "`nСледующие шаги:" -ForegroundColor Cyan
Write-Host "1. Дождись окончания сборки на GitHub (обычно 5-10 минут)"
Write-Host "2. Скачай APK из Artifacts на странице workflow"
Write-Host "3. Или используй команду: gh run download --name app-release"
Write-Host "`nСсылка: https://github.com/gahshsfshsh/stroyka-platform/actions`n"

