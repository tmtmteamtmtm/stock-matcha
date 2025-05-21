import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ดึงข้อมูล dailyUsage พร้อม join product และ branch
    const usage = await prisma.dailyUsage.findMany({
      where: {
        date: today,
      },
      select: {
        usedQty: true,
        product: {
          select: {
            name: true,
            branch: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // จัดกลุ่มข้อมูลตาม branchName และ productName
    const grouped = usage.reduce((acc, cur) => {
      const branchName = cur.product.branch.name;
      const productName = cur.product.name;
      const usedQty = cur.usedQty;

      if (!acc[branchName]) acc[branchName] = {};
      if (!acc[branchName][productName]) acc[branchName][productName] = 0;

      acc[branchName][productName] += usedQty;

      return acc;
    }, {} as Record<string, Record<string, number>>);

    // แปลง grouped ให้เป็น array ที่เหมาะกับ frontend
    const result = Object.entries(grouped).map(([branchName, products]) => ({
      branchName,
      products: Object.entries(products).map(([productName, usedQty]) => ({
        productName,
        usedQty,
      })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching branch-product usage:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
