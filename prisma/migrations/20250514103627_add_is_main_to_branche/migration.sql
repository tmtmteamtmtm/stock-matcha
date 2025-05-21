-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProductTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProductTemplate_pkey" PRIMARY KEY ("id")
);
