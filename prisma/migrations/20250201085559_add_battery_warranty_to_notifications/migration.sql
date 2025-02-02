/*
  Warnings:

  - You are about to drop the column `eventId` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "eventId",
ADD COLUMN     "battery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "burryy" TEXT,
ADD COLUMN     "warranty" BOOLEAN NOT NULL DEFAULT false;
