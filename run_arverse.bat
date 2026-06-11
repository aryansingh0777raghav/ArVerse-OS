@echo off
title ArVerse OS Launcher
echo ===================================================
echo               ArVerse OS Launcher                  
echo                 Created by Aryan                  
echo ===================================================
echo.

:: 1. Check if Vite dev server is already running on port 3000
netstat -ano | findstr :3000 | findstr LISTENING > nul
if %errorlevel% equ 0 (
    echo [OK] ArVerse OS server is already active on port 3000.
) else (
    echo [CMD] Starting Vite Development Server on port 3000...
    start /min cmd /c "npm run dev"
    echo [WAIT] Waiting for Vite server to listen on port 3000...
    :wait_loop
    ping -n 2 127.0.0.1 > nul
    netstat -ano | findstr :3000 | findstr LISTENING > nul
    if %errorlevel% neq 0 goto wait_loop
    echo [OK] Vite server is online!
)


:: 2. Detect Google Chrome or fallback to Edge for App Mode (standalone frame)
echo [APP] Locating browser for standalone App Mode...
set "CHROME_PATH="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not defined CHROME_PATH if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if not defined CHROME_PATH if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if defined CHROME_PATH (
    echo [APP] Launching ArVerse OS in Chrome App Mode...
    start "" "%CHROME_PATH%" --app=http://localhost:3000
) else (
    echo [APP] Chrome not found. Launching in Microsoft Edge App Mode...
    set "EDGE_PATH="
    if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" set "EDGE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    if not defined EDGE_PATH if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" set "EDGE_PATH=C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    
    if defined EDGE_PATH (
        start "" "%EDGE_PATH%" --app=http://localhost:3000
      ) else (
        start "" msedge.exe --app=http://localhost:3000
    )
)

echo [OK] ArVerse OS has launched successfully!
exit
