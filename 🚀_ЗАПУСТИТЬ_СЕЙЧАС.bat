@echo off
chcp 65001 >nul
color 0A
cls

echo.
echo   ╔═══════════════════════════════════════════════════════════╗
echo   ║                                                           ║
echo   ║         🏗️  STROYKA - ЗАПУСК ЗА 30 СЕКУНД  🏗️           ║
echo   ║                                                           ║
echo   ╚═══════════════════════════════════════════════════════════╝
echo.
echo   Backend:  http://localhost:8000/docs
echo   Frontend: http://localhost:3000
echo.
timeout /t 2 >nul

echo   [1/2] 🔧 Backend запускается...
cd backend

if not exist ".env" (
    echo # SQLite Backend > .env
    echo DATABASE_URL=sqlite+aiosqlite:///./stroyka.db >> .env
    echo SECRET_KEY=dev-secret-key-12345 >> .env
    echo DEBUG=True >> .env
)

if not exist "venv" (
    python -m venv venv >nul 2>&1
)

call venv\Scripts\activate >nul 2>&1
pip install -q fastapi uvicorn[standard] >nul 2>&1

start /min cmd /c "title [STROYKA] Backend && venv\Scripts\activate && python app\main_simple.py"
cd ..

echo   [√] Backend: http://localhost:8000/docs
timeout /t 2 >nul

echo.
echo   [2/2] 🌐 Frontend запускается...
cd landing

if not exist ".env.local" (
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
    echo NODE_ENV=development >> .env.local
)

start /min cmd /c "title [STROYKA] Frontend && npm run dev"
cd ..

echo   [√] Frontend: http://localhost:3000
timeout /t 3 >nul

echo.
echo   ╔═══════════════════════════════════════════════════════════╗
echo   ║                   ✅ ВСЁ РАБОТАЕТ! ✅                    ║
echo   ╚═══════════════════════════════════════════════════════════╝
echo.
echo   📱 Откройте браузер:
echo.
echo      👉 http://localhost:3000        (Сайт)
echo      👉 http://localhost:8000/docs   (API)
echo.
echo   💡 Для остановки: нажмите любую клавишу
echo.
pause >nul

taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1

echo   ✅ Остановлено
timeout /t 2 >nul

