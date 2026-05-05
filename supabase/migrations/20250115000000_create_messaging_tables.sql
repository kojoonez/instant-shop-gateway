-- Create messaging system tables
-- This migration creates all necessary tables for the instant messaging system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  user_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL DEFAULT 'General Inquiry',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  is_admin_message BOOLEAN NOT NULL DEFAULT FALSE,
  -- Translation fields
  original_content TEXT,
  translated_content TEXT,
  original_language TEXT,
  target_language TEXT,
  is_translated BOOLEAN DEFAULT FALSE,
  translation_confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message read receipts table
CREATE TABLE IF NOT EXISTS message_read_receipts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_admin_id ON conversations(admin_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_admin_message ON messages(is_admin_message);

CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_message_id ON message_read_receipts(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_user_id ON message_read_receipts(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON messages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update conversation's last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update last_message_at when new message is inserted
DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON messages;
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Create function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(conversation_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Insert read receipts for all unread messages in the conversation
  INSERT INTO message_read_receipts (message_id, user_id)
  SELECT m.id, auth.uid()
  FROM messages m
  WHERE m.conversation_id = conversation_uuid
    AND m.sender_id != auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM message_read_receipts mr 
      WHERE mr.message_id = m.id AND mr.user_id = auth.uid()
    );
  
  -- Update message status to read
  UPDATE messages 
  SET status = 'read', updated_at = NOW()
  WHERE conversation_id = conversation_uuid
    AND sender_id != auth.uid()
    AND status != 'read';
END;
$$ language 'plpgsql';

-- Create function to get conversation stats
CREATE OR REPLACE FUNCTION get_conversation_stats()
RETURNS TABLE (
  total_conversations BIGINT,
  active_conversations BIGINT,
  unread_messages BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM conversations) as total_conversations,
    (SELECT COUNT(*) FROM conversations WHERE status = 'active') as active_conversations,
    (SELECT COUNT(*) FROM messages m 
     WHERE m.is_admin_message = false 
     AND NOT EXISTS (
       SELECT 1 FROM message_read_receipts mr 
       WHERE mr.message_id = m.id
     )
    ) as unread_messages;
END;
$$ language 'plpgsql';

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_receipts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = admin_id);

DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update conversations" ON conversations;
CREATE POLICY "Admins can update conversations" ON conversations
  FOR UPDATE USING (auth.uid() = admin_id OR auth.uid() = user_id);

-- Create RLS policies for messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = conversation_id 
      AND (c.user_id = auth.uid() OR c.admin_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
CREATE POLICY "Users can send messages in their conversations" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = conversation_id 
      AND (c.user_id = auth.uid() OR c.admin_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (sender_id = auth.uid());

-- Create RLS policies for message attachments
DROP POLICY IF EXISTS "Users can view attachments in their conversations" ON message_attachments;
CREATE POLICY "Users can view attachments in their conversations" ON message_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE m.id = message_id 
      AND (c.user_id = auth.uid() OR c.admin_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create attachments for their messages" ON message_attachments;
CREATE POLICY "Users can create attachments for their messages" ON message_attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m
      WHERE m.id = message_id 
      AND m.sender_id = auth.uid()
    )
  );

-- Create RLS policies for message read receipts
DROP POLICY IF EXISTS "Users can view read receipts in their conversations" ON message_read_receipts;
CREATE POLICY "Users can view read receipts in their conversations" ON message_read_receipts
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE m.id = message_id 
      AND (c.user_id = auth.uid() OR c.admin_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create read receipts" ON message_read_receipts;
CREATE POLICY "Users can create read receipts" ON message_read_receipts
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, user_metadata)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb)
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;
