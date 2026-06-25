# ─────────────────────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install OS deps needed by some npm packages (e.g. bcrypt, canvas) and openssl for Prisma
RUN apk add --no-cache python3 make g++ openssl

# Copy root workspace manifest
COPY package.json package-lock.json ./

# Copy all service package manifests (needed for workspace install)
COPY gateway/package.json ./gateway/
COPY services/auth-service/package.json    ./services/auth-service/
COPY services/chat-service/package.json    ./services/chat-service/
COPY services/diet-service/package.json    ./services/diet-service/
COPY services/feed-service/package.json    ./services/feed-service/
COPY services/store-service/package.json   ./services/store-service/
COPY services/user-service/package.json    ./services/user-service/
COPY services/workout-service/package.json ./services/workout-service/

# Copy Prisma schemas so postinstall can generate them during npm ci
COPY services/auth-service/prisma/ ./services/auth-service/prisma/
COPY services/store-service/prisma/ ./services/store-service/prisma/
COPY services/user-service/prisma/ ./services/user-service/prisma/

# Install all workspace dependencies
RUN npm ci --workspaces --include-workspace-root

# Copy all source code
COPY . .

# ─────────────────────────────────────────────────────────
# Stage 2: Production runner
# ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Install openssl required by Prisma query engine in production
RUN apk add --no-cache openssl

# Set production mode
ENV NODE_ENV=production

# Copy everything from builder (source + node_modules)
COPY --from=builder /app ./

# Do not set global PORT here, it causes EADDRINUSE across services
# Expose gateway port
EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:7860/health || exit 1

# Start all services via concurrently (defined in root package.json)
CMD ["npm", "start"]
