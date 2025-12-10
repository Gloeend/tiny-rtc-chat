FROM node:22.21.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Запуск dev-сервера
CMD ["npm", "run", "dev"]

EXPOSE 3001
