import { supabase } from '@/integrations/supabase/client';
import type { 
  Conversation, 
  Message, 
  CreateConversationData, 
  CreateMessageData, 
  MessageFilters,
  ConversationStats 
} from '@/types/messaging';

export class MessagingService {
  // Conversations
  static async getConversations(filters?: MessageFilters): Promise<Conversation[]> {
    let query = supabase
      .from('conversations')
      .select(`
        *,
        user:user_id(id, email, user_metadata),
        admin:admin_id(id, email, user_metadata)
      `)
      .order('last_message_at', { ascending: false });

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters?.admin_id) {
      query = query.eq('admin_id', filters.admin_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getConversation(id: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user:user_id(id, email, user_metadata),
        admin:admin_id(id, email, user_metadata)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createConversation(data: CreateConversationData): Promise<Conversation> {
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        subject: data.subject,
        status: 'active'
      })
      .select(`
        *,
        user:user_id(id, email, user_metadata),
        admin:admin_id(id, email, user_metadata)
      `)
      .single();

    if (error) throw error;
    return conversation;
  }

  static async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:user_id(id, email, user_metadata),
        admin:admin_id(id, email, user_metadata)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Messages
  static async getMessages(conversationId: string, limit = 50, offset = 0): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(id, email, user_metadata),
        attachments(*),
        read_receipts(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data || []).reverse(); // Reverse to show oldest first
  }

  static async sendMessage(data: CreateMessageData): Promise<Message> {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: data.conversation_id,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
        content: data.content,
        message_type: data.message_type || 'text',
        is_admin_message: false
      })
      .select(`
        *,
        sender:sender_id(id, email, user_metadata),
        attachments(*),
        read_receipts(*)
      `)
      .single();

    if (error) throw error;
    return message;
  }

  static async markMessagesAsRead(conversationId: string): Promise<void> {
    const { error } = await supabase.rpc('mark_messages_as_read', {
      conversation_uuid: conversationId
    });
    if (error) throw error;
  }

  // Real-time subscriptions
  static subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  }

  static subscribeToConversations(userId: string, callback: (conversation: Conversation) => void) {
    return supabase
      .channel(`conversations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Conversation);
        }
      )
      .subscribe();
  }

  // Admin functions
  static async getAdminConversations(): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user:user_id(id, email, user_metadata),
        admin:admin_id(id, email, user_metadata)
      `)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async assignConversationToAdmin(conversationId: string, adminId: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .update({ admin_id: adminId })
      .eq('id', conversationId)
      .select(`
        *,
        user:user_id(id, email, user_metadata),
        admin:admin_id(id, email, user_metadata)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async sendAdminMessage(conversationId: string, content: string): Promise<Message> {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
        content,
        message_type: 'text',
        is_admin_message: true
      })
      .select(`
        *,
        sender:sender_id(id, email, user_metadata),
        attachments(*),
        read_receipts(*)
      `)
      .single();

    if (error) throw error;
    return message;
  }

  static async getConversationStats(): Promise<ConversationStats> {
    const { data, error } = await supabase
      .from('conversations')
      .select('status, created_at');

    if (error) throw error;

    const total = data?.length || 0;
    const active = data?.filter(c => c.status === 'active').length || 0;
    
    // Get unread messages count
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin_message', false)
      .is('read_receipts', null);

    return {
      total_conversations: total,
      active_conversations: active,
      unread_messages: unreadCount || 0
    };
  }

  // Utility functions
  static formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  }

  static getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
