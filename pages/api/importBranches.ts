// pages/api/importBranches.ts
import { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

// ปิดการใช้ default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ uploadDir: "/tmp", keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      console.error("Formidable error:", err);
      return res.status(400).json({ error: "File upload failed" });
    }

    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const workbook = XLSX.readFile(file.filepath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      for (const row of data) {
        const {
          productId,
          productName,
          quantity,
          branchId,
          branchName,
          isMain,
        } = row as any;

        let branch = await prisma.branch.findUnique({
          where: { id: Number(branchId) },
        });

        if (!branch) {
          branch = await prisma.branch.create({
            data: {
              id: Number(branchId),
              name: branchName,
              isMain: Boolean(isMain),
            },
          });
        }

        const productIdNum = Number(productId);

        if (!productIdNum || isNaN(productIdNum)) {
          console.warn(`Invalid productId: ${productId}`);
          continue; // ข้ามไปยังแถวถัดไป
        }

        const existingProduct = await prisma.product.findUnique({
          where: { id: productIdNum },
        });

        if (!existingProduct) {
          await prisma.product.create({
            data: {
              id: Number(productId),
              name: productName,
              quantity: Number(quantity),
              branchId: branch.id,
            },
          });
        } else {
          await prisma.product.update({
            where: { id: Number(productId) },
            data: { quantity: Number(quantity) },
          });
        }
      }

      return res.status(200).json({ message: "Import successful" });
    } catch (error) {
      console.error("Import error:", error);
      return res.status(500).json({ error: "Import failed" });
    }
  });
}
