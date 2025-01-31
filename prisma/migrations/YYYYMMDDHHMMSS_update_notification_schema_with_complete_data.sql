-- First add nullable columns
ALTER TABLE "Notification" 
ADD COLUMN "title" TEXT,
ADD COLUMN "image" TEXT,
ADD COLUMN "eventId" TEXT,
ADD COLUMN "eventType" TEXT,
ADD COLUMN "data" JSONB;

-- Update existing records with default title
UPDATE "Notification" 
SET "title" = 'Notification'
WHERE "title" IS NULL;

-- Make title required after setting defaults
ALTER TABLE "Notification" 
ALTER COLUMN "title" SET NOT NULL;

-- Remove duplicate isRead column if it exists
ALTER TABLE "Notification" 
DROP COLUMN IF EXISTS "isRead";

-- Add isRead column back with default value
ALTER TABLE "Notification" 
ADD COLUMN "isRead" BOOLEAN NOT NULL DEFAULT false; 