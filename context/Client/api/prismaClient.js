import { PrismaClient } from "@prisma/client";

export default async function prismaClient() {
  const prisma = new PrismaClient();
  await prisma.$connect();

  return {
    async findUnique(q) {
      const res = await prisma.session.findUnique(q);
      prisma.$disconnect();
      return res;
    },
    async update(q) {
      const res = await prisma.session.update(q);
      prisma.$disconnect();
      return res;
    },
    async create(q) {
      const res = await prisma.session.create(q);
      prisma.$disconnect();
      return res;
    },
    async delete(q) {
      await prisma.session.delete(q);
      prisma.$disconnect();
    }
  };
}
