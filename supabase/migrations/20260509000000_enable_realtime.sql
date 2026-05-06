-- Enable Realtime replication for messaging tables
-- This is REQUIRED for postgres_changes subscriptions to work

-- Enable realtime on the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime on the conversations table
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Enable realtime on waitlist_signups (optional, for admin updates)
ALTER PUBLICATION supabase_realtime ADD TABLE waitlist_signups;

-- Verify realtime is enabled (this query can be run to check)
-- SELECT schemaname, tablename, unnest(string_to_array(trim(trailing ',' from string_agg(case when enable_insert then 'I' end, '') || ',' || string_agg(case when enable_update then 'U' end, '') || ',' || string_agg(case when enable_delete then 'D' end, '') || ',' || string_agg(case when enable_truncate then 'T' end, ''), ','), ',')) as actions
-- FROM pg_publication_tables
-- WHERE pubname = 'supabase_realtime';
