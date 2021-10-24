import { PrismaClient } from "@prisma/client";

declare global {
    namespace NodeJS {
      interface Global {
        prisma: any;
      }
    }
  }

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient()
  }
  prisma = (global as any).prisma
}
export default prisma