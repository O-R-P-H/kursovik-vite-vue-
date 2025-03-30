FROM node:22-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force \
    && npm install -g npm@latest

RUN npm install

COPY . .

EXPOSE 3001

#COPY ./dist ./dist

CMD ["npm", "run", "start"]
