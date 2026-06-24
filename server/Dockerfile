# ─────────────────────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install OS deps needed by some npm packages (e.g. bcrypt, canvas)
RUN apk add --no-cache python3 make g++

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

# Install all workspace dependencies
RUN npm ci --workspaces --include-workspace-root

# Copy all source code
COPY . .

# Generate Prisma client (required by auth-service)
RUN cd services/auth-service && npx prisma generate

# ─────────────────────────────────────────────────────────
# Stage 2: Production runner
# ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Set production mode
ENV NODE_ENV=production

# Copy everything from builder (source + node_modules)
COPY --from=builder /app ./

# Expose gateway port
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:5000/health || exit 1

# Start all services via concurrently (defined in root package.json)
CMD ["npm", "start"]
