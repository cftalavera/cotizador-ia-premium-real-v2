#!/bin/bash

echo "Iniciando backend..."

gnome-terminal -- bash -c "cd cotizador-ia-premium-real/backend && npm start; exec bash"

sleep 5

echo "Iniciando frontend..."

gnome-terminal -- bash -c "cd cotizador-ia-premium-real/frontend && npm run dev; exec bash"

sleep 8

xdg-open http://localhost:3000
