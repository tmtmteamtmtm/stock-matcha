import prisma from "@/lib/prisma";

export async function getBranchesWithProducts() {
  return prisma.branch.findMany({
    include: {
      products: true,
    },
  });
}