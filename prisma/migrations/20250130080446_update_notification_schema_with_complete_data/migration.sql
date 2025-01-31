/*
  Warnings:

  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "data" JSONB,
ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "eventType" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
