# Stage 1: Build Angular app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source code
COPY src/ ./src/

# Build Angular app
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx files first, then copy Angular build
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular files from the 'browser' subdirectory
COPY --from=build /app/dist/voiceai-suite/browser /usr/share/nginx/html

# Create nginx config for SPA on port 8001
RUN echo 'server { \
    listen 8001; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8001

CMD ["nginx", "-g", "daemon off;"]
