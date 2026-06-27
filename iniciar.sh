#!/bin/bash
cd "$(dirname "$0")"
xdg-open http://localhost:3000 &
node backend/server.js
