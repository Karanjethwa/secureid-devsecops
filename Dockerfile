# ==============================================================================
# SecureID - Multi-Stage Production Dockerfile
# DevSecOps Lab CIAP Microproject
# Non-root user execution, Alpine lightweight base, healthcheck enabled
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend Assets
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund

COPY frontend/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Build Backend TypeScript
# ------------------------------------------------------------------------------
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --no-audit --no-fund

COPY backend/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3: Minimal Production Runtime
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

# Update Alpine packages to receive available security fixes
RUN apk upgrade --no-cache

RUN npm install --global npm@11.21.1

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install curl in alpine for docker healthcheck
RUN apk add --no-cache curl

# Copy backend dependencies (production only)
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production --no-audit --no-fund

# Copy compiled backend files
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copy compiled frontend dist so backend can serve it statically
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create persistent data directory and grant ownership to non-root node user
RUN mkdir -p /app/backend/data && chown -R node:node /app

# Switch to non-root user for principle of least privilege
USER node

# Expose server port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:5000/api/health || exit 1

# Start production server
WORKDIR /app/backend
CMD ["node", "dist/server.js"]
