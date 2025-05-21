import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productId = Number(url.searchParams.get("productId"));

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const usages = await prisma.dailyUsage.findMany({
      where: { productId },
      orderBy: { date: "asc" },
      select: {
        date: true,
        usedQty: true,
      },
    });

    // format date เป็น string ง่ายๆ เช่น "2023-05-21"
    const data = usages.map((u) => ({
      date: u.date.toISOString().slice(0, 10),
      usedQty: u.usedQty,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching daily usage:", error);
    return NextResponse.json({ error: "Failed to fetch daily usage" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productId, usedQty } = await req.json();
    if (!productId || usedQty === undefined) {
      return NextResponse.json({ error: "Missing productId or usedQty" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { branch: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productName = product.name;
    const branchName = product.branch.name;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.dailyUsage.upsert({
      where: {
        productId_date: {
          productId,
          date: today,
        },
      },
      update: {
        usedQty,
        productName,
        branchName,
      },
      create: {
        productId,
        date: today,
        usedQty,
        productName,
        branchName,
      },
    });

    return NextResponse.json(usage);
  } catch (error) {
    console.error("Error updating usedQty:", error);
    return NextResponse.json({ error: "Failed to update usedQty" }, { status: 500 });
  }
}
