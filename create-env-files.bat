@echo off
echo Creating .env files...

:: Backend .env
(
echo DATABASE_URL=sqlite+aiosqlite:///./masterok.db
echo SECRET_KEY=dev-secret-key-change-in-production
echo DEBUG=True
echo API_V1_PREFIX=/api/v1
echo PROJECT_NAME=MasterOK
) > backend\.env

echo [√] backend\.env created

:: Landing .env.local
(
echo NEXT_PUBLIC_API_URL=http://localhost:8000
echo NODE_ENV=development
) > landing\.env.local

echo [√] landing\.env.local created

echo.
echo Done! .env files created successfully.
pause




