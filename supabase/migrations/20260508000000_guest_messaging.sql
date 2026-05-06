-- Add guest_email to conversations and messages for support chat
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Make user_id nullable in conversations (guest chats don't have auth user)
ALTER TABLE conversations ALTER COLUMN user_id DROP NOT NULL;

-- Make sender_id nullable in messages (guest messages don't have auth user)
ALTER TABLE messages ALTER COLUMN sender_id DROP NOT NULL;

-- Drop old restrictive RLS policies
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Anyone can insert waitlist signup" ON waitlist_signups;
DROP POLICY IF EXISTS "Authenticated users can view waitlist" ON waitlist_signups;

-- New RLS: Allow anyone to create conversations (with email)
CREATE POLICY "Anyone can create guest conversations"
  ON conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view conversations"
  ON conversations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update conversations"
  ON conversations FOR UPDATE
  USING (true);

-- New RLS: Allow anyone to send messages
CREATE POLICY "Anyone can send messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update messages"
  ON messages FOR UPDATE
  USING (true);

-- Waitlist RLS
CREATE POLICY "Anyone can insert waitlist signup"
  ON waitlist_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view waitlist"
  ON waitlist_signups FOR SELECT
  USING (true);

-- Grant anon access
GRANT INSERT, SELECT ON conversations TO anon;
GRANT INSERT, SELECT ON messages TO anon;
