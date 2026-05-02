FROM node:20-alpine AS builder

WORKDIR /app

# Accept API URL as build argument
ARG API_URL=http://localhost:3000/api

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Replace API URL placeholder in environment file
RUN sed -i "s|http://localhost:3000/api|${API_URL}|g" src/environments/environment.ts

# Build Angular app
RUN npm run build -- --configuration production

# Production stage with nginx
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built Angular app (Angular 17+ output structure)
COPY --from=builder /app/dist/Okizeme/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
