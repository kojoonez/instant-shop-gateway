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
  static async getConversations(filters?: MessageFilters): Promise<Conversation[]> {
    let query = supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (filters?.user_id) query = query.eq('user_id', filters.user_id);
    if (filters?.admin_id) query = query.eq('admin_id', filters.admin_id);
    if (filters?.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getGuestConversations(email: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('guest_email', email)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getOrCreateGuestConversation(email: string): Promise<Conversation> {
    const convos = await this.getGuestConversations(email);
    const activeConvo = convos.find(c => c.status === 'active');
    if (activeConvo) return activeConvo;
    return this.createGuestConversation(email);
  }

  static async getConversation(id: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
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
      .select('*')
      .single();

    if (error) throw error;
    return conversation;
  }

  static async createGuestConversation(email: string): Promise<Conversation> {
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        guest_email: email,
        subject: 'General Inquiry',
        status: 'active'
      })
      .select('*')
      .single();

    if (error) throw error;
    return conversation;
  }

  static async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async closeConversation(conversationId: string): Promise<void> {
    // Send the closing message first
    const user = (await supabase.auth.getUser()).data.user;
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user?.id,
        content: 'This conversation has been closed by an admin. If you need further assistance, please start a new chat. Thank you for contacting Cravy Support!',
        message_type: 'system',
        is_admin_message: true,
        status: 'delivered'
      });

    // Then close the conversation
    await supabase
      .from('conversations')
      .update({ status: 'closed' })
      .eq('id', conversationId);
  }

  static async reopenConversation(conversationId: string): Promise<Conversation> {
    return this.updateConversation(conversationId, { status: 'active' });
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async sendMessage(data: CreateMessageData): Promise<Message> {
    const user = (await supabase.auth.getUser()).data.user;
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: data.conversation_id,
        sender_id: user?.id || null,
        guest_email: data.guest_email || null,
        content: data.content,
        message_type: data.message_type || 'text',
        is_admin_message: false
      })
      .select('*')
      .single();

    if (error) throw error;
    return message;
  }

  static async markMessagesAsRead(conversationId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('mark_messages_as_read', {
        conversation_uuid: conversationId
      });
      if (error) console.warn('mark_messages_as_read failed:', error.message);
    } catch {
      // RPC may not exist for guest chats - silently ignore
    }
  }

  static subscribeToMessages(conversationId: string, callback: (payload: Record<string, unknown>) => void) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          console.log('[Realtime] New message received:', payload);
          callback(payload);
        }
      )
      .on('system', { event: '*' }, (payload) => {
        console.log('[Realtime] System event:', payload);
      })
      .subscribe((status) => {
        console.log(`[Realtime] Subscription status for ${conversationId}:`, status);
      });
    return channel;
  }

  static subscribeToConversations(userId: string, callback: (payload: Record<string, unknown>) => void) {
    return supabase
      .channel('conversations:all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        callback
      )
      .subscribe();
  }

  static async getAdminConversations(): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async assignConversationToAdmin(conversationId: string, adminId: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .update({ admin_id: adminId })
      .eq('id', conversationId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async sendAdminMessage(conversationId: string, content: string): Promise<Message> {
    const user = (await supabase.auth.getUser()).data.user;
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user?.id,
        content,
        message_type: 'text',
        is_admin_message: true
      })
      .select('*')
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
    
    return {
      total_conversations: total,
      active_conversations: active,
      unread_messages: 0
    };
  }

  static formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInDays = Math.floor(diffInMinutes / 1440);

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (diffInMinutes < 1) return `Just now (${timeStr})`;
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${timeStr}`;
    if (diffInDays === 1) return `Yesterday, ${timeStr}`;
    if (diffInDays < 7) return `${Math.floor(diffInMinutes / 1440)}d ago at ${timeStr}`;
    return `${date.toLocaleDateString()} at ${timeStr}`;
  }

  static getInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  }
}
