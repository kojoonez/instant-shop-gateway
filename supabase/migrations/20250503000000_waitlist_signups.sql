-- Waitlist for early access (businesses and end users)
CREATE TYPE public.waitlist_segment AS ENUM ('business', 'user');

CREATE TABLE public.waitlist_signups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    segment public.waitlist_segment NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    business_name TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT waitlist_signups_email_nonempty CHECK (length(trim(email)) > 0)
);

CREATE UNIQUE INDEX waitlist_signups_segment_email_lower
    ON public.waitlist_signups (segment, lower(trim(email)));

CREATE INDEX waitlist_signups_segment_created_idx
    ON public.waitlist_signups (segment, created_at DESC);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
    ON public.waitlist_signups
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

COMMENT ON TABLE public.waitlist_signups IS 'Early-access waitlist signups; reads use service role (e.g. admin edge function).';
