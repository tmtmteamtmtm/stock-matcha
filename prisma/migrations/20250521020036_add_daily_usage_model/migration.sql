/*
  Warnings:

  - You are about to drop the column `usedQty` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "usedQty";

-- CreateTable
CREATE TABLE "DailyUsage" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "usedQty" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyUsage_productId_date_key" ON "DailyUsage"("productId", "date");

-- AddForeignKey
ALTER TABLE "DailyUsage" ADD CONSTRAINT "DailyUsage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
