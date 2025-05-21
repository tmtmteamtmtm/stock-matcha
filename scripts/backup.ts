// scripts/backup.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportDataToJSON() {
  try {
    const branches = await prisma.branch.findMany({
      include: { products: true },
    });

    const products = await prisma.product.findMany();

    const data = {
      branches,
      products,
    };

    const filePath = path.join(__dirname, 'backup.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log('✅ Backup completed: backup.json created.');
  } catch (error) {
    console.error('❌ Failed to export data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportDataToJSON();
