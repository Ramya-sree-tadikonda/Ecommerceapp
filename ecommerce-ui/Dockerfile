# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Serve with nginx ----
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Clean default
RUN rm -rf ./*

COPY --from=build /app/dist ./

# nginx default serves on port 80
EXPOSE 80
