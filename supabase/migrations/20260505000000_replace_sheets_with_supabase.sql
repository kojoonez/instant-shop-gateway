-- Migration: Replace Google Sheets with Supabase for waitlist + add application tables

-- 1. Create waitlist_segment enum if it doesn't exist, then add 'driver'
DO $$ BEGIN
  CREATE TYPE waitlist_segment AS ENUM ('business', 'user');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TYPE waitlist_segment ADD VALUE IF NOT EXISTS 'driver';

-- 2. Create waitlist_signups table if it doesn't exist
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment waitlist_segment NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  business_name TEXT,
  vehicle_type TEXT,
  notes TEXT,
  country_code TEXT,
  country_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert waitlist signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Authenticated users can view waitlist" ON waitlist_signups;

CREATE POLICY "Anyone can insert waitlist signup"
  ON waitlist_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view waitlist"
  ON waitlist_signups FOR SELECT
  USING (true);

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

DROP POLICY IF EXISTS "Anyone can submit business application" ON business_applications;
DROP POLICY IF EXISTS "Users can view own business applications" ON business_applications;
DROP POLICY IF EXISTS "Authenticated users can update business applications" ON business_applications;

CREATE POLICY "Anyone can submit business application"
  ON business_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own business applications"
  ON business_applications FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update business applications"
  ON business_applications FOR UPDATE
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

DROP POLICY IF EXISTS "Anyone can submit creator application" ON creator_applications;
DROP POLICY IF EXISTS "Users can view own creator applications" ON creator_applications;
DROP POLICY IF EXISTS "Authenticated users can update creator applications" ON creator_applications;

CREATE POLICY "Anyone can submit creator application"
  ON creator_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own creator applications"
  ON creator_applications FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update creator applications"
  ON creator_applications FOR UPDATE
  USING (true);
