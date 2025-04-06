# Шаг 1: Установка зависимостей
FROM node:22-alpine3.18 AS dependencies

WORKDIR /app
COPY package*.json ./
RUN npm install

# Шаг 2: Сборка приложения
FROM node:22-alpine3.18 AS builder

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Шаг 3: Запуск приложения
FROM node:22-alpine3.18

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

ENV NODE_ENV production
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
