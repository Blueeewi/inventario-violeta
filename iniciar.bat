@echo off
cd /d "%~dp0"

echo Verificando si ya hay un servidor corriendo en el puerto 3000...
for /f "tokens=5" %%P in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Cerrando servidor anterior (PID %%P)...
    taskkill /F /PID %%P >nul 2>&1
)

echo Iniciando Inventario Violeta...
start "Inventario Violeta - Servidor" cmd /k node backend/server.js

echo Esperando a que el servidor inicie...
:esperar
timeout /t 1 /nobreak >nul
curl -s http://localhost:3000/ping >nul 2>&1
if errorlevel 1 goto esperar

start http://localhost:3000

echo.
echo Listo. Puedes cerrar esta ventana (el servidor sigue corriendo en la otra).
pause
