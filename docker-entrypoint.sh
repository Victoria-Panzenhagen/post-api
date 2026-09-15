#!/bin/sh

set -e

echo "Banco disponível!"

echo "Executando migrations..."
npm run migration:run

echo "Executando seeds..."
npm run seed

echo "Iniciando aplicação..."
exec npm run start:dev