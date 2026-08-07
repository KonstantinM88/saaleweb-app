import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function databasePoolMax() {
  const configured = Number.parseInt(process.env.DATABASE_POOL_MAX ?? "", 10);
  return Number.isFinite(configured) && configured >= 1 && configured <= 20 ? configured : 1;
}

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    // Keep Next.js build workers and the persistent Hostinger process from
    // opening the pg library default of ten connections each.
    max: databasePoolMax(),
    idleTimeoutMillis: 30_000,
    allowExitOnIdle: true,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

// Hostinger can evaluate multiple route bundles in one persistent Node process.
// Reuse the same client there as well as in development so each bundle does not
// create another PostgreSQL pool. Separate Node processes still have one pool
// each, which is why the conservative default above remains important.
globalForPrisma.prisma = prisma;
