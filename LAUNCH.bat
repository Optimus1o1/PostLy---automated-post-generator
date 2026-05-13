@echo off
color 0A
title Social Media Agent - Launcher

:menu
cls
echo ========================================
echo   SOCIAL MEDIA AGENT - LAUNCHER
echo ========================================
echo.
echo Choose which application to run:
echo.
echo 1. Postly Backend Server (Port 5000)
echo 2. Postly Frontend (Port 5173)
echo 3. Next.js App (Port 3000)
echo 4. Open Documentation
echo 5. Exit
echo.
echo ========================================
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto postly-server
if "%choice%"=="2" goto postly-frontend
if "%choice%"=="3" goto nextjs
if "%choice%"=="4" goto docs
if "%choice%"=="5" goto end
goto menu

:postly-server
cls
echo Starting Postly Backend Server...
echo.
cd postly\server
start cmd /k npm start
echo Backend server starting in new window...
timeout /t 2 >nul
goto menu

:postly-frontend
cls
echo Starting Postly Frontend...
echo.
cd postly
start cmd /k npm run dev
echo Frontend starting in new window...
echo Open: http://localhost:5173
timeout /t 2 >nul
goto menu

:nextjs
cls
echo Starting Next.js App...
echo.
echo IMPORTANT: Make sure you added your Anthropic API key!
echo File: social-media-app\.env.local
echo.
cd social-media-app
start cmd /k npm run dev
echo Next.js app starting in new window...
echo Open: http://localhost:3000
timeout /t 2 >nul
goto menu

:docs
cls
echo Opening Documentation...
start START-HERE.md
timeout /t 1 >nul
goto menu

:end
cls
echo.
echo Thank you for using Social Media Agent!
echo.
timeout /t 2 >nul
exit
