// Prisma client singleton - prevents multiple instances in development
// Gracefully handles case where DATABASE_URL is not set (e.g., CI builds)
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : [],
});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
