@echo off
title FitcirclePro - Stopper
color 0C
echo ==========================================================
echo               Stopping FitcirclePro Project               
echo ==========================================================
echo.

echo [1/4] Terminating Backend window and all its child processes...
taskkill /F /T /FI "WINDOWTITLE eq FitcirclePro - Backend Microservices" >nul 2>&1

echo [2/4] Terminating Frontend window and all its child processes...
taskkill /F /T /FI "WINDOWTITLE eq FitcirclePro - Frontend" >nul 2>&1

echo [3/4] Terminating Launcher window if still open...
taskkill /F /T /FI "WINDOWTITLE eq FitcirclePro - Launcher" >nul 2>&1

echo [4/4] Terminating any remaining Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ==========================================================
echo   All FitcirclePro services and client have been stopped!
echo   Closing terminal...
echo ==========================================================
timeout /t 2 >nul
exit
