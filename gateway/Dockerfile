FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS production
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .

RUN npm prune --omit=dev

USER nodejs

EXPOSE 8080
CMD ["node", "index.js"]