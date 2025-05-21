// pages/api/exportBranches.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ดึงข้อมูลสินค้าทุกสาขา
    const products = await prisma.product.findMany({
      include: {
        branch: true, // ดึงข้อมูลสาขาที่เกี่ยวข้องกับสินค้า
      },
    });

    // เตรียมข้อมูลที่ต้องการ export
    const data = products.map(product => ({
      productId: product.id,
      productName: product.name,
      quantity: product.quantity,
      branchId: product.branchId,
      branchName: product.branch.name,
      isMain: product.branch.isMain,
    }));

    // จัดเรียงข้อมูลให้สาขาหลัก (isMain = true) ปรากฏก่อน
    data.sort((a, b) => {
      if (b.isMain !== a.isMain) {
        return b.isMain ? 1 : -1;
      }
      return a.branchId - b.branchId; // จัดเรียง branchId จากน้อยไปมาก
    });

    // แปลงข้อมูลเป็น sheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // เขียนข้อมูลในรูปแบบ Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    const now = new Date();

    // ใช้เวลาประเทศไทย (Asia/Bangkok)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok',
    };

    // แปลงเป็นรูปแบบวันที่ไทย
    const formatted = new Intl.DateTimeFormat('th-TH', options).format(now);

    // เปลี่ยน / , : และ space ให้เป็น _ หรือ -
    const safeDate = formatted
      .replaceAll('/', '')     // 16/05/2025 → 16-05-2025
      .replaceAll(',', '')      // เอา comma ออก
      .replaceAll(':', '')     // 14:30:00 → 14-30-00
      .replaceAll(' ', '_');    // เว้นวรรค → _

    let filename = `data_${safeDate}.xlsx`;

    // ตั้งค่า header เพื่อส่งไฟล์ Excel กลับไปยัง client
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error exporting products:", error);
    res.status(500).json({ error: "Failed to export products" });
  }
}
