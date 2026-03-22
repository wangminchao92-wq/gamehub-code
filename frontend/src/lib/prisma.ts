import { PrismaClient } from '@prisma/client';

// PrismaClient在开发环境中会被热重载，避免在开发时创建太多连接
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7.4.0配置
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}