FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev deps for TypeScript compilation)
RUN npm ci

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Copy required files for runtime
COPY --from=builder /app/.env ./.env 2>/dev/null || true

EXPOSE 3000

CMD ["node", "dist/app.js"]
