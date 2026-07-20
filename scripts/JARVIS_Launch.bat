@echo off
title J.A.R.V.I.S. - Initializing...
color 04
echo.
echo  ========================================
echo   J.A.R.V.I.S. is starting up...
echo  ========================================
echo.
:: Kill any leftover instances on these ports
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
:: Start JARVIS backend
echo [1/3] Starting backend...
start "JARVIS-Backend" /min cmd /c "cd /d "C:\Users\Subhabrata Dey\OneDrive\Desktop\JARVIS\backend" && npm run dev"
:: Wait for backend to boot
timeout /t 4 /nobreak >nul
:: Start JARVIS frontend
echo [2/3] Starting frontend...
start "JARVIS-Frontend" /min cmd /c "cd /d "C:\Users\Subhabrata Dey\OneDrive\Desktop\JARVIS\frontend" && npm start"
:: Wait for frontend to compile
echo [3/3] Waiting for frontend to compile...
timeout /t 12 /nobreak >nul
:: Open the screensaver in the browser
echo [OK] Opening J.A.R.V.I.S. HUD...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000/screensaver --start-maximized
echo.
echo  JARVIS is online.
