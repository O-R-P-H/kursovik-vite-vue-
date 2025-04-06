FROM node:22-alpine3.18

WORKDIR /app

# 1. Копируем только файлы зависимостей и конфигов
COPY package*.json ./
COPY tsconfig*.json ./

# 2. Устанавливаем зависимости
RUN npm ci

# 3. Копируем остальные файлы
COPY . .

# 4. Собираем проект
RUN npm run build

# 5. Запускаем собранное приложение
CMD ["node", "dist/main.js"]

EXPOSE 3000
