-- Migration: Replace Google Sheets with Supabase for waitlist + add application tables

-- 1. Add 'driver' to waitlist_segment enum
ALTER TYPE waitlist_segment ADD VALUE IF NOT EXISTS 'driver';

-- 2. Add vehicle_type column to waitlist_signups
ALTER TABLE waitlist_signups
ADD COLUMN IF NOT EXISTS vehicle_type TEXT;

-- 3. Create business_applications table
CREATE TABLE IF NOT EXISTS business_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE business_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous signups)
CREATE POLICY "Anyone can submit business application"
  ON business_applications FOR INSERT
  WITH CHECK (true);

-- Authenticated users can view their own
CREATE POLICY "Users can view own business applications"
  ON business_applications FOR SELECT
  USING (true);

-- 4. Create creator_applications table
CREATE TABLE IF NOT EXISTS creator_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  social_links TEXT,
  content_type TEXT,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE creator_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit creator application"
  ON creator_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own creator applications"
  ON creator_applications FOR SELECT
  USING (true);

-- 5. Update RLS on waitlist_signups - ensure INSERT is allowed by anyone
DROP POLICY IF EXISTS "Anyone can insert waitlist signup" ON waitlist_signups;

CREATE POLICY "Anyone can insert waitlist signup"
  ON waitlist_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view waitlist"
  ON waitlist_signups FOR SELECT
  USING (true);
