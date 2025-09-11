-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for messaging
CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE public.conversation_status AS ENUM ('active', 'closed', 'archived');

-- Conversations table
CREATE TABLE public.conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subject TEXT,
    status conversation_status DEFAULT 'active',
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Messages table
CREATE TABLE public.messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    status message_status DEFAULT 'sent',
    is_admin_message BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Message attachments table
CREATE TABLE public.message_attachments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Message read receipts table
CREATE TABLE public.message_read_receipts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(message_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_receipts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations" ON public.conversations 
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = admin_id);

CREATE POLICY "Users can create conversations" ON public.conversations 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update conversations" ON public.conversations 
    FOR UPDATE USING (auth.uid() = admin_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.user_id = auth.uid() OR conversations.admin_id = auth.uid())
        )
    );

CREATE POLICY "Users can create messages in their conversations" ON public.messages 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.user_id = auth.uid() OR conversations.admin_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages" ON public.messages 
    FOR UPDATE USING (auth.uid() = sender_id);

-- RLS Policies for message attachments
CREATE POLICY "Users can view attachments in their conversations" ON public.message_attachments 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.messages 
            JOIN public.conversations ON conversations.id = messages.conversation_id
            WHERE messages.id = message_attachments.message_id 
            AND (conversations.user_id = auth.uid() OR conversations.admin_id = auth.uid())
        )
    );

CREATE POLICY "Users can create attachments for their messages" ON public.message_attachments 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.messages 
            WHERE messages.id = message_attachments.message_id 
            AND messages.sender_id = auth.uid()
        )
    );

-- RLS Policies for read receipts
CREATE POLICY "Users can view read receipts for their conversations" ON public.message_read_receipts 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.messages 
            JOIN public.conversations ON conversations.id = messages.conversation_id
            WHERE messages.id = message_read_receipts.message_id 
            AND (conversations.user_id = auth.uid() OR conversations.admin_id = auth.uid())
        )
    );

CREATE POLICY "Users can create read receipts" ON public.message_read_receipts 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_admin_id ON public.conversations(admin_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_message_attachments_message_id ON public.message_attachments(message_id);
CREATE INDEX idx_message_read_receipts_message_id ON public.message_read_receipts(message_id);
CREATE INDEX idx_message_read_receipts_user_id ON public.message_read_receipts(user_id);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update last_message_at when a new message is inserted
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(conversation_uuid UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO public.message_read_receipts (message_id, user_id)
    SELECT m.id, auth.uid()
    FROM public.messages m
    JOIN public.conversations c ON c.id = m.conversation_id
    WHERE c.id = conversation_uuid
    AND m.sender_id != auth.uid()
    AND NOT EXISTS (
        SELECT 1 FROM public.message_read_receipts mr
        WHERE mr.message_id = m.id AND mr.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
