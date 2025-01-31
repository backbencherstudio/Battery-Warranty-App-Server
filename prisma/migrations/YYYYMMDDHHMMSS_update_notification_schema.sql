-- Revert changes and update Notification table
ALTER TABLE "Notification" 
DROP COLUMN IF EXISTS "title",
DROP COLUMN IF EXISTS "body",
DROP COLUMN IF EXISTS "type",
DROP COLUMN IF EXISTS "data",
DROP COLUMN IF EXISTS "read";

-- Add/Rename columns to match the original schema
ALTER TABLE "Notification" 
ADD COLUMN IF NOT EXISTS "message" TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN NOT NULL DEFAULT false; 