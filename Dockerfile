# ==========================
# Base
# ==========================
FROM node:24-alpine AS base

WORKDIR /app

COPY package*.json ./

# Instala todas as dependências
RUN npm ci

COPY . .

# ==========================
# Development
# ==========================
FROM base AS development

ENV NODE_ENV=development

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001

CMD ["npm", "run", "start:dev"]

# ==========================
# Builder
# ==========================
FROM base AS builder

RUN npm run build

# ==========================
# Production
# ==========================
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --omit=dev

# Copia apenas a aplicação compilada
COPY --from=builder /app/dist ./dist

#COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

#RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001

CMD ["node", "dist/main.js"]