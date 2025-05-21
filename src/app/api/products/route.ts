import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/products?branchId=1

export async function GET(req: NextRequest) {
  try {
    const branchId = req.nextUrl.searchParams.get("branchId");
    if (!branchId) {
      return NextResponse.json({ error: "Missing branchId" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // ตั้งให้เป็นเวลา 00:00 ของวันนี้

    const products = await prisma.product.findMany({
      where: { branchId: Number(branchId) },
      include: {
        dailyUsages: {
          where: { date: today },
          select: { usedQty: true },
        },
      },
      orderBy: { id: "asc" },
    });

    const result = products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      usedQty: product.dailyUsages[0]?.usedQty ?? 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// POST /api/products
export async function POST(req: NextRequest) {
  try {
    const { name, quantity, branchId } = await req.json();

    if (!name || quantity === undefined || !branchId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // สร้างสินค้าลงในฐานข้อมูล
    const product = await prisma.product.create({
      data: {
        name,
        quantity,
        branchId,  // เพิ่ม branchId เพื่อเชื่อมโยงกับสาขา
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// PUT /api/products
export async function PUT(req: NextRequest) {
  try {
    const { id, name, quantity } = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: { name, quantity },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/products?id=123
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
