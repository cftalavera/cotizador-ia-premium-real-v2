#!/bin/bash

echo "========================================="
echo "INSTALANDO COTIZADOR IA PREMIUM"
echo "========================================="

if ! command -v node &> /dev/null
then
    echo "Node.js no esta instalado."
    echo "Instalalo desde https://nodejs.org/"
    exit
fi

echo ""
echo "Instalando backend..."

cd cotizador-ia-premium-real/backend
npm install

echo ""
echo "Instalando frontend..."

cd ../frontend
npm install

echo ""
echo "========================================="
echo "INSTALACION COMPLETADA"
echo "========================================="

echo ""
echo "Crear archivo backend/.env"
echo "Agregar:"
echo "OPENAI_API_KEY=sk-tu-api-key"
