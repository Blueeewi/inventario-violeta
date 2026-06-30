#!/bin/bash
cd "$(dirname "$0")"

# Si ya hay un servidor viejo corriendo en el puerto 3000, lo cierra primero
PID_VIEJO=$(lsof -ti :3000)
if [ -n "$PID_VIEJO" ]; then
  echo "Cerrando servidor anterior (PID $PID_VIEJO)..."
  kill -9 $PID_VIEJO
  sleep 0.5
fi

# Inicia el servidor en segundo plano
node backend/server.js &
SERVER_PID=$!

# Espera hasta que el servidor responda antes de abrir el navegador
echo "Esperando a que el servidor inicie..."
until curl -s http://localhost:3000/ping > /dev/null; do
  sleep 0.3
done

xdg-open http://localhost:3000

# Mantiene el script corriendo mientras el servidor esté vivo
wait $SERVER_PID
