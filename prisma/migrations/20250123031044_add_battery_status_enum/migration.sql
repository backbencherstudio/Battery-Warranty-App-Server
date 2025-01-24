-- CreateEnum
CREATE TYPE "BatteryStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Battery" ADD COLUMN     "status" "BatteryStatus" NOT NULL DEFAULT 'PENDING';
