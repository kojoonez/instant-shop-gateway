import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Search, 
  Send, 
  Clock,
  Check,
  CheckCheck,
  User,
  Mail,
  Phone,
  Archive,
  ArchiveRestore,
  Filter,
  MoreVertical,
  Languages,
  Loader2
} from 'lucide-react';
import { MessagingService } from '@/services/messagingService';
import { translationService } from '@/services/translationService';
import { useScreenSize } from '@/hooks/useScreenSize';
import type { Conversation, Message, ConversationStats } from '@/types/messaging';

interface AdminMessagingPanelProps {
  className?: string;
}

export const AdminMessagingPanel: React.FC<AdminMessagingPanelProps> = ({ className }) => {
  const { isMobile } = useScreenSize();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations and stats
  useEffect(() => {
    loadConversations();
    loadStats();
  }, [activeTab]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await MessagingService.getAdminConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await MessagingService.getMessages(conversationId);
      
      // Translate user messages for admin (to English)
      const translatedMessages = await Promise.all(
        data.map(async (message) => {
          // Only translate if the message is from user and not already translated
          if (!message.is_admin_message && message.content && !message.is_translated) {
            try {
              const translation = await translationService.translateForAdmin(
                message.content,
                message.id
              );
              
              return {
                ...message,
                original_content: translation.originalContent,
                translated_content: translation.translatedContent,
                original_language: translation.originalLanguage,
                target_language: translation.targetLanguage,
                is_translated: translation.isTranslated,
                content: translation.isTranslated ? translation.translatedContent : message.content
              };
            } catch (error) {
              console.error('Translation error:', error);
              return message;
            }
          }
          return message;
        })
      );
      
      setMessages(translatedMessages);
      // Mark messages as read
      await MessagingService.markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await MessagingService.getConversationStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    setTranslating(true);
    
    try {
      // Send the admin message
      const message = await MessagingService.sendAdminMessage(
        selectedConversation.id,
        newMessage.trim()
      );
      
      // Translate the message for the user (if needed)
      let translatedMessage = message;
      try {
        const translation = await translationService.translateForUser(
          newMessage.trim(),
          message.id
        );
        
        translatedMessage = {
          ...message,
          original_content: translation.originalContent,
          translated_content: translation.translatedContent,
          original_language: translation.originalLanguage,
          target_language: translation.targetLanguage,
          is_translated: translation.isTranslated
        };
      } catch (error) {
        console.error('Translation error:', error);
      }
      
      setMessages(prev => [...prev, translatedMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
      setTranslating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesTab = activeTab === 'all' || conv.status === activeTab;
    const matchesSearch = !searchQuery || 
      conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getMessageStatusIcon = (message: Message) => {
    switch (message.status) {
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSenderName = (message: Message) => {
    return message.sender?.user_metadata?.display_name || 
           message.sender?.email?.split('@')[0] || 
           'User';
  };

  const getSenderInitials = (message: Message) => {
    const name = getSenderName(message);
    return MessagingService.getInitials(name);
  };

  const getTranslationInfo = (message: Message) => {
    if (!message.is_translated) return null;
    
    return {
      originalLanguage: translationService.getLanguageName(message.original_language || 'en'),
      targetLanguage: translationService.getLanguageName(message.target_language || 'en'),
      hasOriginal: !!message.original_content,
      hasTranslated: !!message.translated_content
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`h-full ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({stats?.active_conversations || 0})</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
          <TabsTrigger value="all">All ({stats?.total_conversations || 0})</TabsTrigger>
        </TabsList>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className={`${isMobile ? 'w-full' : 'w-1/3'} border-r flex flex-col`}>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-muted-foreground">Loading conversations...</div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <Card
                      key={conversation.id}
                      className={`cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-primary/5 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                {MessagingService.getInitials(
                                  conversation.user?.user_metadata?.display_name || 
                                  conversation.user?.email?.split('@')[0] || 
                                  'User'
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {conversation.user?.user_metadata?.display_name || 
                                   conversation.user?.email?.split('@')[0] || 
                                   'User'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {conversation.user?.email}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-2">
                              {conversation.subject || 'No subject'}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getStatusColor(conversation.status)}`}
                              >
                                {conversation.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {conversation.last_message_at 
                                  ? MessagingService.formatMessageTime(conversation.last_message_at)
                                  : MessagingService.formatMessageTime(conversation.created_at)
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Messages Area */}
          {selectedConversation && (
            <div className={`${isMobile ? 'hidden' : 'flex-1'} flex flex-col`}>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {MessagingService.getInitials(
                        selectedConversation.user?.user_metadata?.display_name || 
                        selectedConversation.user?.email?.split('@')[0] || 
                        'User'
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {selectedConversation.user?.user_metadata?.display_name || 
                         selectedConversation.user?.email?.split('@')[0] || 
                         'User'}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(selectedConversation.status)}
                    >
                      {selectedConversation.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_admin_message ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex space-x-2 max-w-[80%] ${message.is_admin_message ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          message.is_admin_message 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {getSenderInitials(message)}
                        </div>
                        
                        {/* Message Content */}
                        <div className={`flex flex-col space-y-1 ${message.is_admin_message ? 'items-end' : 'items-start'}`}>
                          <div className={`px-3 py-2 rounded-2xl text-sm ${
                            message.is_admin_message
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}>
                            {message.content}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <span>{MessagingService.formatMessageTime(message.created_at)}</span>
                            {getMessageStatusIcon(message)}
                            {(() => {
                              const translationInfo = getTranslationInfo(message);
                              if (translationInfo) {
                                return (
                                  <div className="flex items-center space-x-1" title={`Translated from ${translationInfo.originalLanguage} to ${translationInfo.targetLanguage}`}>
                                    <Languages className="h-3 w-3" />
                                    <span className="text-xs">{translationInfo.originalLanguage}→{translationInfo.targetLanguage}</span>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="min-h-[40px] max-h-24 resize-none"
                    disabled={sending}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending || translating}
                    size="sm"
                    className="px-3"
                  >
                    {translating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          )}

          {!selectedConversation && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};
