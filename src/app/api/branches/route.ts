// src/app/api/branches/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ใช้ PrismaClient จากไฟล์แยก
import { getBranchesWithProducts } from "@/lib/branchService";


// GET /api/branches
export async function GET() {
  try {
    const branches = await getBranchesWithProducts();
    return new Response(JSON.stringify(branches), { status: 200 });
  } catch (error) {
    return new Response("Error fetching branches", { status: 500 });
  }
}

// POST /api/branches
export async function POST(req: Request) {
  const body = await req.json();
  const { name, products, isMain } = body;

  try {
    // ตรวจสอบว่าในฐานข้อมูลมีสาขาที่เป็น isMain = true อยู่แล้วหรือไม่
    if (isMain) {
      const existingMainBranch = await prisma.branch.findFirst({
        where: { isMain: true },
      });

      if (existingMainBranch) {
        return new Response(
          JSON.stringify({ error: "ไม่สามารถตั้งค่าสาขาหลักได้ เพราะมีสาขาหลักอยู่แล้ว" }),
          { status: 400 }
        );
      }
    }

    // สร้างสาขาใหม่
    const newBranch = await prisma.branch.create({
      data: {
        name,
        isMain: !!isMain,
        products: {
          create: products.map((p: string) => ({
            name: p,
            quantity: 0,
          })),
        },
      },
      include: {
        products: true,
      },
    });

    return Response.json(newBranch);
  } catch (err) {
    console.error("Failed to create branch:", err);
    return new Response(JSON.stringify({ error: "Failed to create branch" }), {
      status: 500,
    });
  }
}

// PUT /api/branches
export async function PUT(req: NextRequest) {
  const { id, isMain } = await req.json();

  try {
    if (isMain) {
      // ตรวจสอบว่าในฐานข้อมูลมีสาขาที่เป็น isMain = true อยู่แล้วหรือไม่
      const existingMainBranch = await prisma.branch.findFirst({
        where: { isMain: true },
      });

      if (existingMainBranch && existingMainBranch.id !== id) {
        return NextResponse.json(
          { error: "ไม่สามารถตั้งค่าสาขาหลักได้ เพราะมีสาขาหลักอยู่แล้ว" },
          { status: 400 }
        );
      }
    }

    // อัปเดตสาขา
    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: { isMain },
    });

    return NextResponse.json(updatedBranch);
  } catch (error) {
    console.error("Error updating branch:", error);
    return NextResponse.json({ error: "Failed to update branch" }, { status: 500 });
  }
}

// DELETE /api/branches?id=123
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const branch = await prisma.branch.findUnique({ where: { id: Number(id) } });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    if (branch.isMain) {
      return NextResponse.json({ error: "ไม่สามารถลบสาขาหลักได้" }, { status: 400 });
    }

    // ลบสินค้าของสาขานั้นๆ
    await prisma.product.deleteMany({ where: { branchId: Number(id) } });

    // ลบสาขา
    await prisma.branch.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete branch failed", err);
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 });
  }
}


