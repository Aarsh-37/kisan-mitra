# Stage 1: Build dependencies and Next.js project
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Prisma requires a DATABASE_URL at generate time; use a dummy value for build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV AUTH_SECRET="build-time-placeholder-secret"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# Stage 2: Production image (standalone)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install prisma CLI for migrations at runtime
RUN npm install -g prisma

# Automatically leverage output traces to reduce image size
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy prisma schema so `prisma migrate deploy` works at runtime
COPY --from=builder /app/prisma ./prisma

# Copy and prepare startup script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Next.js standalone server listens on port 3000
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["sh", "entrypoint.sh"]
