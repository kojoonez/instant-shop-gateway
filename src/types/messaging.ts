export interface Conversation {
  id: string;
  user_id: string;
  admin_id?: string;
  subject?: string;
  status: 'active' | 'closed' | 'archived';
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      display_name?: string;
    };
  };
  admin?: {
    id: string;
    email: string;
    user_metadata?: {
      display_name?: string;
    };
  };
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read';
  is_admin_message: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    email: string;
    user_metadata?: {
      display_name?: string;
    };
  };
  attachments?: MessageAttachment[];
  read_receipts?: MessageReadReceipt[];
  // Translation fields
  original_content?: string;
  translated_content?: string;
  original_language?: string;
  target_language?: string;
  is_translated?: boolean;
  translation_confidence?: number;
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
}

export interface MessageReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      display_name?: string;
    };
  };
}

export interface CreateConversationData {
  subject?: string;
}

export interface CreateMessageData {
  conversation_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'file' | 'system';
}

export interface MessageFilters {
  conversation_id?: string;
  user_id?: string;
  admin_id?: string;
  status?: 'active' | 'closed' | 'archived';
  unread_only?: boolean;
}

export interface ConversationStats {
  total_conversations: number;
  active_conversations: number;
  unread_messages: number;
  avg_response_time?: number;
}
