@echo off
setlocal

echo Cleaning MasterOK workspace...

REM Landing (Next.js)
if exist "landing\node_modules" (
  echo - Removing landing\node_modules
  rmdir /s /q "landing\node_modules"
)
if exist "landing\.next" (
  echo - Removing landing\.next
  rmdir /s /q "landing\.next"
)

REM Backend (Python)
if exist "backend\venv" (
  echo - Removing backend\venv
  rmdir /s /q "backend\venv"
)
if exist "backend\__pycache__" (
  echo - Removing backend\__pycache__
  rmdir /s /q "backend\__pycache__"
)

REM Mobile (Flutter)
if exist "mobile\build" (
  echo - Removing mobile\build
  rmdir /s /q "mobile\build"
)

echo Done.
echo Next steps:
echo   cd backend ^&^& python -m venv venv ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt
echo   cd landing ^&^& npm install
echo   cd mobile ^&^& flutter pub get

endlocal




