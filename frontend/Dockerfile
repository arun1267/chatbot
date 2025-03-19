# Stage 1: Build React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Serve React with a lightweight Node.js server
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist .
RUN npm install -g serve
CMD ["serve", "-s", ".", "-l", "80"]

EXPOSE 80