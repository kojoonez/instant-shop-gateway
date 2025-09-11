import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Phone,
  Mail,
  Clock,
  Check,
  CheckCheck,
  Languages,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MessagingService } from '@/services/messagingService';
import { translationService } from '@/services/translationService';
import { useScreenSize } from '@/hooks/useScreenSize';
import type { Conversation, Message } from '@/types/messaging';

interface ChatWidgetProps {
  className?: string;
  onClose?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ className, onClose }) => {
  const { user } = useAuth();
  const { isMobile } = useScreenSize();
  const [isOpen, setIsOpen] = useState(true); // Always open when rendered
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [translating, setTranslating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load or create conversation when widget opens
  useEffect(() => {
    if (isOpen && user) {
      loadConversation();
    }
  }, [isOpen, user]);

  // Set up real-time messaging
  useEffect(() => {
    if (!conversation || !user) return;

    const subscription = MessagingService.subscribeToMessages(conversation.id, async (message) => {
      // Translate incoming messages
      let translatedMessage = message;
      
      if (message.is_admin_message && message.content) {
        try {
          const translation = await translationService.translateForUser(
            message.content,
            message.id
          );
          
          translatedMessage = {
            ...message,
            original_content: translation.originalContent,
            translated_content: translation.translatedContent,
            original_language: translation.originalLanguage,
            target_language: translation.targetLanguage,
            is_translated: translation.isTranslated,
            content: translation.isTranslated ? translation.translatedContent : message.content
          };
        } catch (error) {
          console.error('Real-time translation error:', error);
        }
      }
      
      setMessages(prev => [...prev, translatedMessage]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversation, user]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && conversation && user) {
      MessagingService.markMessagesAsRead(conversation.id).catch(console.error);
    }
  }, [isOpen, conversation, user]);

  const loadConversation = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Try to find existing active conversation
      const conversations = await MessagingService.getConversations({ 
        user_id: user.id, 
        status: 'active' 
      });

      if (conversations.length > 0) {
        const existingConversation = conversations[0];
        setConversation(existingConversation);
        await loadMessages(existingConversation.id);
      } else {
        // Create new conversation
        const newConversation = await MessagingService.createConversation({
          subject: 'General Inquiry'
        });
        setConversation(newConversation);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const messagesData = await MessagingService.getMessages(conversationId);
      
      // Translate messages for the current user
      const translatedMessages = await Promise.all(
        messagesData.map(async (message) => {
          // Only translate if the message is from admin and user language is not English
          if (message.is_admin_message && message.content && !message.is_translated) {
            try {
              const translation = await translationService.translateForUser(
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
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || sending) return;

    setSending(true);
    setTranslating(true);
    
    try {
      // Send the original message
      const message = await MessagingService.sendMessage({
        conversation_id: conversation.id,
        content: newMessage.trim()
      });
      
      // Translate the message for admin (if needed)
      let translatedMessage = message;
      if (!message.is_admin_message) {
        try {
          const translation = await translationService.translateForAdmin(
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

  const getMessageStatusIcon = (message: Message) => {
    if (message.sender_id !== user?.id) return null;
    
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
    if (message.sender_id === user?.id) return 'You';
    return message.sender?.user_metadata?.display_name || 
           message.sender?.email?.split('@')[0] || 
           'Admin';
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

  if (!user) return null;

  return (
    <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50 ${className}`}>
      <Card className={`${isMobile ? 'w-80 h-96' : 'w-96 h-[500px]'} shadow-2xl border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Support Chat</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {conversation?.admin_id ? 'Connected' : 'Connecting...'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose || (() => setIsOpen(false))}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
              {/* Messages Area */}
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-sm text-muted-foreground">Loading messages...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Start a conversation!</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Our team will respond as soon as possible.
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex space-x-2 max-w-[80%] ${message.sender_id === user?.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {/* Avatar */}
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            message.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {getSenderInitials(message)}
                          </div>
                          
                          {/* Message Content */}
                          <div className={`flex flex-col space-y-1 ${message.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                            <div className={`px-3 py-2 rounded-2xl text-sm ${
                              message.sender_id === user?.id
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
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Textarea
                    ref={textareaRef}
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
            </CardContent>
          )}
        </Card>
    </div>
  );
};
