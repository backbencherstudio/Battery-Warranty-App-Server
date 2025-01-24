/*
  Warnings:

  - You are about to drop the column `batteryId` on the `Warranty` table. All the data in the column will be lost.
  - You are about to drop the `Battery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Battery" DROP CONSTRAINT "Battery_userId_fkey";

-- DropForeignKey
ALTER TABLE "Warranty" DROP CONSTRAINT "Warranty_batteryId_fkey";

-- AlterTable
ALTER TABLE "Warranty" DROP COLUMN "batteryId";

-- DropTable
DROP TABLE "Battery";
