@echo off
title Instalador Cotizador IA Premium

echo =========================================
echo INSTALANDO COTIZADOR IA PREMIUM
echo =========================================

echo.
echo Verificando Node.js...

node -v >nul 2>&1

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Node.js no esta instalado.
    echo Descargalo desde:
    echo https://nodejs.org/
    pause
    exit
)

echo.
echo ========================
echo INSTALANDO BACKEND
echo ========================

cd backend

call npm install

IF %ERRORLEVEL% NEQ 0 (
    echo Error instalando backend
    pause
    exit
)

echo.
echo ========================
echo INSTALANDO FRONTEND
echo ========================

cd ..\frontend

call npm install

IF %ERRORLEVEL% NEQ 0 (
    echo Error instalando frontend
    pause
    exit
)

echo.
echo =========================================
echo INSTALACION COMPLETADA
echo =========================================

echo.
echo IMPORTANTE:
echo Crear archivo:
echo backend\.env
echo.
echo Agregar:
echo OPENAI_API_KEY=sk-tu-api-key
echo.

pause
