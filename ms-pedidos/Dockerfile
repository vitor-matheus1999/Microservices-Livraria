FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS production

LABEL maintainer="ms-pedidos"
LABEL description="Microserviço de Pedidos - E-commerce"

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]