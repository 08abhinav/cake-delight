FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS production
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

WORKDIR /app
COPY --form=build /app/node_modules ./node_modules

RUN npm prune --omit=dev
EXPOSE 3001

CMD ["node", "index.js"]