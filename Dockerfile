FROM node:22-alpine3.18

WORKDIR /app

# 1. Копируем только файлы зависимостей
COPY package*.json ./
COPY tsconfig*.json ./

# 2. Устанавливаем зависимости
RUN npm ci --only=production  # Используем ci для production

# 3. Копируем остальные файлы
COPY . .

# 4. Собираем проект
RUN npm run build

# 5. Указываем правильную команду запуска
CMD ["npm", "run", "start:prod"]  # Или "node dist/main.js"

EXPOSE 3000
