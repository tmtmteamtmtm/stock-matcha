import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ดึงข้อมูล grouped by date และ branchName พร้อม sum usedQty
    const usageData = await prisma.dailyUsage.groupBy({
      by: ["date", "branchName"],  // แยกตามวันที่และสาขา
      _sum: {
        usedQty: true,
      },
      orderBy: {
        date: "asc",
      },
      take: 100, // ถ้าจำกัดจำนวน
    });

    // แปลงข้อมูลให้เหมาะกับ frontend
    // [{ date, branchName, usedQty }]
    const formattedData = usageData.map((item) => ({
      date: item.date.toISOString().slice(0, 10),
      branchName: item.branchName,
      usedQty: item._sum.usedQty || 0,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching usage data:", error);
    return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 });
  }
}
