/*
  Warnings:

  - You are about to drop the column `name` on the `Warranty` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `Warranty` table. All the data in the column will be lost.
  - Added the required column `batteryId` to the `Warranty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Warranty" DROP COLUMN "name",
DROP COLUMN "purchaseDate",
ADD COLUMN     "batteryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Battery" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Battery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Battery_serialNumber_key" ON "Battery"("serialNumber");

-- AddForeignKey
ALTER TABLE "Battery" ADD CONSTRAINT "Battery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
