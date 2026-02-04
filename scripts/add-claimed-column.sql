-- Add claimed column to track if items have been claimed
ALTER TABLE posts ADD COLUMN IF NOT EXISTS claimed BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS claimed_by TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE;
