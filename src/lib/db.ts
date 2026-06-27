// Single source of truth for the Prisma client lives in ./prisma.
// This module re-exports it so existing `@/lib/db` importers keep working
// without spinning up a second PrismaClient (and a second connection pool).
export { prisma, default } from "./prisma";
