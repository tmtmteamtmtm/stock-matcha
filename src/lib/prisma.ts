// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// สร้าง Prisma Client ใหม่ทุกครั้ง
const prisma = new PrismaClient();

export default prisma;

// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;

