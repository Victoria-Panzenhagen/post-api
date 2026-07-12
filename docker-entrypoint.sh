#!/bin/sh

set -x

echo "Aguardando banco..."

until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "Executando migrations..."
npm run migration:run

echo "Executando seeds..."
npm run seed

echo "Iniciando aplicação..."
exec npm run start:dev

chmod +x docker-entrypoint.sh