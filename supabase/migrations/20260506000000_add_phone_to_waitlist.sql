-- Add phone column to waitlist_signups
ALTER TABLE waitlist_signups
ADD COLUMN IF NOT EXISTS phone TEXT;
