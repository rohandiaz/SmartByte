import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as { cachedPrisma?: PrismaClient };

const db = globalForPrisma.cachedPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.cachedPrisma = db;
}

export { db };
