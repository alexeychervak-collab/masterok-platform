@echo off
cd /d d:\masterok\backend
call venv\Scripts\activate
uvicorn app.main_simple:app --reload --host 0.0.0.0 --port 8000
pause




