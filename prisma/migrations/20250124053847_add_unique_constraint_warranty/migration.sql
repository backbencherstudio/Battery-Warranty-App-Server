/*
  Warnings:

  - A unique constraint covering the columns `[batteryId,userId]` on the table `Warranty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Warranty_batteryId_userId_key" ON "Warranty"("batteryId", "userId");
