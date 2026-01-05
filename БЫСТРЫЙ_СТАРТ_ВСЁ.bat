@echo off
chcp 65001 >nul
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                           ║
echo ║           🚀 STROYKA - АВТОМАТИЧЕСКИЙ ЗАПУСК ВСЕГО 🚀                   ║
echo ║                                                                           ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo.

:MENU
echo ════════════════════════════════════════════════════════════════════════════
echo                          ВЫБЕРИТЕ ДЕЙСТВИЕ:
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo   1. 📤 Залить на GitHub (автоматически)
echo.
echo   2. 🌐 Команды для деплоя на сервер
echo.
echo   3. 📱 Скачать APK из GitHub Actions
echo.
echo   4. 📋 Открыть документацию
echo.
echo   5. ✅ Показать статус проекта
echo.
echo   0. ❌ Выход
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo.
set /p choice="Введите номер (0-5): "

if "%choice%"=="1" goto GITHUB
if "%choice%"=="2" goto SERVER
if "%choice%"=="3" goto APK
if "%choice%"=="4" goto DOCS
if "%choice%"=="5" goto STATUS
if "%choice%"=="0" goto END
goto MENU


:GITHUB
cls
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo                       📤 ЗАГРУЗКА НА GITHUB
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo Загружаю код на GitHub...
echo.

call DEPLOY_GITHUB.bat

echo.
echo ✅ Код загружен! GitHub Actions начал сборку APK!
echo.
echo 🔗 Репозиторий: https://github.com/gahshsfshsh/stroyka-platform
echo 🔗 Actions: https://github.com/gahshsfshsh/stroyka-platform/actions
echo.
echo ⏱️ Через 15 минут APK будет готов в Artifacts
echo.
pause
goto MENU


:SERVER
cls
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo                    🌐 КОМАНДЫ ДЛЯ СЕРВЕРА
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo На сервере Tema@leha-tema выполните ОДНУ команду:
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │                                                                          │
echo │  bash ^<(curl -s https://raw.githubusercontent.com/gahshsfshsh/stroyka- │
echo │       platform/main/DEPLOY_SERVER.sh)                                   │
echo │                                                                          │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.
echo ✅ Это автоматически установит и запустит:
echo    • Backend API (порт 8000)
echo    • Frontend сайт (порт 3000)
echo    • PostgreSQL базу данных
echo    • Nginx reverse proxy
echo.
echo 📄 Подробные инструкции: 📡_КОМАНДЫ_ДЛЯ_СЕРВЕРА.txt
echo.
pause
goto MENU


:APK
cls
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo                      📱 СКАЧАТЬ APK
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo 1. Открыть GitHub Actions:
echo    https://github.com/gahshsfshsh/stroyka-platform/actions
echo.
echo 2. Кликнуть на последний workflow run (зелёная галочка ✅)
echo.
echo 3. Внизу страницы → Artifacts → Скачать APK
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo Доступные файлы:
echo   • app-arm64-v8a-release.apk (новые устройства)
echo   • app-armeabi-v7a-release.apk (старые устройства)
echo   • app-release.aab (для Google Play)
echo.
echo ⏱️ Первая сборка займёт ~15 минут
echo.
echo Открыть GitHub Actions в браузере? (Y/N)
set /p open="Выбор: "
if /i "%open%"=="Y" start https://github.com/gahshsfshsh/stroyka-platform/actions
echo.
pause
goto MENU


:DOCS
cls
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo                         📋 ДОКУМЕНТАЦИЯ
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo Выберите документ:
echo.
echo   1. 🎉_ГОТОВО_АВТОЗАПУСК.txt - краткое описание
echo   2. 🚀_АВТОМАТИЧЕСКИЙ_ДЕПЛОЙ.md - подробный гайд по деплою
echo   3. 📡_КОМАНДЫ_ДЛЯ_СЕРВЕРА.txt - команды для сервера
echo   4. README.md - главная документация
echo   5. START_HERE.md - начало работы
echo.
echo   0. Назад
echo.
set /p doc="Выбор: "

if "%doc%"=="1" start 🎉_ГОТОВО_АВТОЗАПУСК.txt
if "%doc%"=="2" start 🚀_АВТОМАТИЧЕСКИЙ_ДЕПЛОЙ.md
if "%doc%"=="3" start 📡_КОМАНДЫ_ДЛЯ_СЕРВЕРА.txt
if "%doc%"=="4" start README.md
if "%doc%"=="5" start START_HERE.md
if "%doc%"=="0" goto MENU

pause
goto MENU


:STATUS
cls
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo                        ✅ СТАТУС ПРОЕКТА
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo 🏗️ Проект: STROYKA - Платформа строительных услуг
echo 🔗 GitHub: https://github.com/gahshsfshsh/stroyka-platform
echo 👨‍💻 Server: Tema@leha-tema (Ubuntu 22.04.5 LTS)
echo 📅 Версия: 1.0.1 Production Ready
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo                         ЧТО ГОТОВО:
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo ✅ Backend API (FastAPI + PostgreSQL + YooKassa)
echo ✅ Frontend (Next.js 14 + 30 страниц)
echo ✅ Mobile App (Flutter, Android + iOS)
echo ✅ GitHub Repository
echo ✅ Автоматическая сборка APK (GitHub Actions)
echo ✅ Скрипты автодеплоя (1 команда)
echo ✅ Firebase интеграция
echo ✅ YooKassa платежи + эскроу
echo ✅ Документация на русском (20+ файлов)
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo                      СЛЕДУЮЩИЕ ШАГИ:
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo 1️⃣ Залить на GitHub (если ещё не сделано)
echo    → Выбрать пункт 1 в меню
echo.
echo 2️⃣ Деплой на сервер (1 команда на сервере)
echo    → Выбрать пункт 2 для команд
echo.
echo 3️⃣ Скачать APK из GitHub Actions
echo    → Выбрать пункт 3
echo.
echo 4️⃣ Настроить DNS и SSL (после деплоя)
echo    → sudo certbot --nginx -d stroyka.ru
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo 🎯 СТАТУС: ГОТОВО К ДЕПЛОЮ И ИСПОЛЬЗОВАНИЮ! ✅
echo.
pause
goto MENU


:END
cls
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo.
echo               Спасибо за использование STROYKA! 🏗️
echo.
echo               GitHub: github.com/gahshsfshsh/stroyka-platform
echo.
echo ════════════════════════════════════════════════════════════════════════════
echo.
timeout /t 2 >nul
exit

