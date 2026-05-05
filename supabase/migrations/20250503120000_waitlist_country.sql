-- Region-aware waitlist: store detected or chosen country per signup
ALTER TABLE public.waitlist_signups
    ADD COLUMN IF NOT EXISTS country_code TEXT,
    ADD COLUMN IF NOT EXISTS country_name TEXT;

DROP INDEX IF EXISTS waitlist_signups_segment_email_lower;

CREATE UNIQUE INDEX waitlist_signups_segment_email_country_lower
    ON public.waitlist_signups (segment, lower(trim(email)), COALESCE(country_code, ''));

COMMENT ON COLUMN public.waitlist_signups.country_code IS 'ISO 3166-1 alpha-2 (or OT for other / not listed)';
COMMENT ON COLUMN public.waitlist_signups.country_name IS 'Display name at signup time';
