// src/app/api/branches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/branches
export async function GET() {
  try {
    const branches = await prisma.branch.findMany(); // ดึงข้อมูลสาขาจากฐานข้อมูล
    return new Response(JSON.stringify(branches), { status: 200 });
  } catch (error) {
    return new Response("Error fetching branches", { status: 500 });
  }
}

// POST /api/branches
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Missing or invalid name" }, { status: 400 });
  }

  try {
    const branch = await prisma.branch.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(branch);
  } catch (error) {
    console.error("Error creating branch:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/branches
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const branchId = parseInt(params.id);

  if (isNaN(branchId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.branch.delete({
      where: { id: branchId },
    });

    return NextResponse.json({ message: "Branch deleted" });
  } catch (err) {
    console.error("Error deleting branch:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
