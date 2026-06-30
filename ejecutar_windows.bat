@echo off
title Ejecutar Cotizador IA Premium

echo =========================================
echo INICIANDO BACKEND
echo =========================================

start cmd /k "cd backend && npm start"

timeout /t 5

echo =========================================
echo INICIANDO FRONTEND
echo =========================================

start cmd /k "cd frontend && npm run dev"

timeout /t 8

start http://localhost:3000

echo.
echo Aplicacion iniciada correctamente
pause
