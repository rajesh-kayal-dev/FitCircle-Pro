@echo off
title FitcirclePro - Launcher
color 0A
echo ==========================================================
echo               Starting FitcirclePro Project               
echo ==========================================================
echo.

:: Clean up any existing ports first to avoid conflict errors
echo [1/3] Freeing up backend ports if they are already in use...
cd server
call npm run kill
cd ..
echo Ports cleared!
echo.

:: Start the Backend Microservices (Gateway + 7 services)
echo [2/3] Starting Backend Services in a new window...
start "FitcirclePro - Backend Microservices" cmd /c "cd server && npm run dev"

:: Start the Frontend Client
echo [3/3] Starting Frontend Client in a new window...
start "FitcirclePro - Frontend" cmd /c "cd client && npm run dev"

echo.
echo ==========================================================
echo   Services are starting! Keep the newly opened windows
echo   open to run the project.
echo   - Backend runs on Gateway (Proxy/Router)
echo   - Frontend Client will open in browser
echo ==========================================================
echo.
timeout /t 2 >nul
exit
