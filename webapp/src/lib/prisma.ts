// prisma.ts

import { PrismaClient } from "@prisma/client";

// Initialize PrismaClient if it doesn't already exist on the global object
const prisma = globalThis.prisma || new PrismaClient();

// In development mode, attach the PrismaClient instance to the global object
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export { prisma };
