/*
  Warnings:

  - You are about to drop the `ucode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ucode";

-- CreateTable
CREATE TABLE "Ucode" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "otp" TEXT NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ucode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ucode_email_key" ON "Ucode"("email");
