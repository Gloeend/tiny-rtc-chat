FROM node:22.21.1-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

FROM node:22.21.1-alpine

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --only=production && npm cache clean --force

USER node

EXPOSE 3001

CMD ["node", "dist/server.js"]
