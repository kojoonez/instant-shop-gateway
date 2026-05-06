import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Check,
  CheckCheck,
  Loader2,
  ArrowRight,
  User,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MessagingService } from '@/services/messagingService';
import { joinWaitlist, checkEmailExists, validateEmail } from '@/services/waitlistService';
import { useScreenSize } from '@/hooks/useScreenSize';
import type { Conversation, Message } from '@/types/messaging';

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const MAX_MESSAGES_PER_MINUTE = 10;

interface ChatWidgetProps {
  className?: string;
  onClose?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ className, onClose }) => {
  const { user } = useAuth();
  const { isMobile } = useScreenSize();
  const [isMinimized, setIsMinimized] = useState(false);
  const [step, setStep] = useState<'waitlist' | 'chat'>(() => {
    const stored = sessionStorage.getItem('cravy_chat_email');
    return (user || stored) ? 'chat' : 'waitlist';
  });

  // Waitlist form state
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({ code: '', name: '' });
  const [waitlistErrors, setWaitlistErrors] = useState<Record<string, string>>({});
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [detectingCountry, setDetectingCountry] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [existingUserSegment, setExistingUserSegment] = useState('');

  // Rate limiting state
  const submissions = useRef<number[]>([]);
  const messageTimestamps = useRef<number[]>([]);

  const checkRateLimit = (timestamps: number[], maxCount: number, windowMs: number): boolean => {
    const now = Date.now();
    timestamps.current = timestamps.current.filter(t => now - t < windowMs);
    return timestamps.current.length >= maxCount;
  };

  const recordSubmission = (timestamps: number[]) => {
    timestamps.current.push(Date.now());
  };

  // Check if email already exists in waitlist
  const checkEmailStatus = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailExists(false);
      setExistingUserSegment('');
      return;
    }
    setCheckingEmail(true);
    try {
      const result = await checkEmailExists(email);
      setEmailExists(result.exists);
      setExistingUserSegment(result.segment || '');
    } catch {
      setEmailExists(false);
      setExistingUserSegment('');
    } finally {
      setCheckingEmail(false);
    }
  };

  // Debounced email check
  const emailCheckTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleEmailChange = (value: string) => {
    setWaitlistEmail(value);
    setEmailExists(false);
    setExistingUserSegment('');
    
    // Validate format first
    const validation = validateEmail(value);
    if (!validation.valid) {
      setWaitlistErrors(prev => ({ ...prev, email: validation.error || '' }));
      return;
    }
    setWaitlistErrors(prev => ({ ...prev, email: '' }));
    
    if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);
    emailCheckTimeout.current = setTimeout(() => {
      checkEmailStatus(value);
    }, 800);
  };

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'OTHER', name: 'Other', flag: '🌍' },
  ];

  // Detect country on mount
  useEffect(() => {
    setDetectingCountry(true);
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        if (data.country_code) {
          const found = countries.find(c => c.code === data.country_code);
          if (found) {
            setSelectedCountry({ code: found.code, name: found.name });
          } else {
            setSelectedCountry({ code: data.country_code || 'OTHER', name: data.country_name || 'Other' });
          }
        }
      })
      .catch(() => {
        setSelectedCountry({ code: 'OTHER', name: 'Other' });
      })
      .finally(() => setDetectingCountry(false));
  }, []);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user) {
      setStep('chat');
      loadConversation(user.id);
      return;
    }
    const stored = sessionStorage.getItem('cravy_chat_email');
    if (stored) {
      loadConversationByEmail(stored);
    }
  }, [user]);

  useEffect(() => {
    if (!conversation) return;
    const subscription = MessagingService.subscribeToMessages(conversation.id, (payload) => {
      const newMsg = payload.new as unknown as Message;
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });
    return () => subscription.unsubscribe();
  }, [conversation]);

  useEffect(() => {
    if (conversation) {
      MessagingService.markMessagesAsRead(conversation.id).catch(console.error);
    }
  }, [conversation]);

  const validateWaitlist = () => {
    const errors: Record<string, string> = {};
    if (!waitlistName.trim()) errors.name = 'Name is required';
    
    const emailValidation = validateEmail(waitlistEmail);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error || 'Valid email required';
    }
    
    if (!waitlistPhone.trim()) errors.phone = 'Phone is required';
    if (!selectedCountry.code || selectedCountry.code === '') errors.country = 'Country is required';
    setWaitlistErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleWaitlistSubmit = async () => {
    if (!validateWaitlist()) return;

    // Rate limit check
    if (checkRateLimit(submissions, MAX_SUBMISSIONS_PER_WINDOW, RATE_LIMIT_WINDOW)) {
      setWaitlistErrors({ form: 'Too many attempts. Please wait a minute and try again.' });
      return;
    }

    setWaitlistLoading(true);
    setWaitlistErrors({});

    const email = waitlistEmail.trim().toLowerCase();
    recordSubmission(submissions);

    try {
      // If email already exists, just resume their chat
      if (emailExists) {
        const existingConvo = await MessagingService.getOrCreateGuestConversation(email);
        setConversation(existingConvo);
        sessionStorage.setItem('cravy_chat_email', email);
        await loadMessages(existingConvo.id);
        setStep('chat');
        return;
      }

      // Save to waitlist
      const result = await joinWaitlist({
        segment: 'user',
        email,
        fullName: waitlistName.trim(),
        phone: waitlistPhone.trim(),
        countryCode: selectedCountry.code,
        countryName: selectedCountry.name,
      });

      if (result.error) {
        setWaitlistErrors({ email: result.error.message || 'Invalid email address' });
        setWaitlistLoading(false);
        return;
      }

      // Start conversation
      const newConvo = await MessagingService.getOrCreateGuestConversation(email);
      setConversation(newConvo);
      sessionStorage.setItem('cravy_chat_email', email);
      await loadMessages(newConvo.id);
      setStep('chat');
    } catch (err) {
      console.error('Failed to start chat:', err);
      setWaitlistErrors({ form: 'Failed to start chat. Please try again.' });
    } finally {
      setWaitlistLoading(false);
    }
  };

  const loadConversation = async (userId: string) => {
    setLoading(true);
    try {
      const conversations = await MessagingService.getConversations({ user_id: userId, status: 'active' });
      if (conversations.length > 0) {
        setConversation(conversations[0]);
        await loadMessages(conversations[0].id);
      } else {
        const newConvo = await MessagingService.createConversation({ subject: 'General Inquiry' });
        setConversation(newConvo);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationByEmail = async (email: string) => {
    setLoading(true);
    try {
      const newConvo = await MessagingService.getOrCreateGuestConversation(email);
      setConversation(newConvo);
      await loadMessages(newConvo.id);
      setStep('chat');
    } catch (err) {
      console.error('Error loading conversation by email:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await MessagingService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || sending) return;

    // Rate limit check
    if (checkRateLimit(messageTimestamps, MAX_MESSAGES_PER_MINUTE, RATE_LIMIT_WINDOW)) {
      setSendError('Too many messages. Please wait a moment before sending another.');
      return;
    }

    setSending(true);
    setSendError(null);
    recordSubmission(messageTimestamps);

    try {
      let msg;
      try {
        msg = await MessagingService.sendMessage({
          conversation_id: conversation.id,
          content: newMessage.trim(),
          guest_email: user ? undefined : waitlistEmail.trim().toLowerCase(),
        });
      } catch (err) {
        await new Promise(res => setTimeout(res, 500));
        msg = await MessagingService.sendMessage({
          conversation_id: conversation.id,
          content: newMessage.trim(),
          guest_email: user ? undefined : waitlistEmail.trim().toLowerCase(),
        });
      }
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setSendError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };

  // Waitlist form step
  if (step === 'waitlist') {
    return (
      <div className={`fixed ${isMobile ? 'bottom-4 right-4 left-4' : 'bottom-6 right-6'} z-50 ${className}`}>
        <Card className={`${isMobile ? 'w-full max-w-sm mx-auto' : 'w-80'} shadow-2xl border-0 bg-background/95 backdrop-blur`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-sm">Welcome to Cravy</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Join the waitlist to start chatting.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={waitlistName}
                  onChange={(e) => { setWaitlistName(e.target.value); setWaitlistErrors(prev => ({ ...prev, name: '' })); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleWaitlistSubmit()}
                  className={`pl-10 ${waitlistErrors.name ? 'border-red-500' : ''}`}
                />
              </div>
              {waitlistErrors.name && <p className="text-xs text-red-500">{waitlistErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={waitlistEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleWaitlistSubmit()}
                  className={`pl-10 ${waitlistErrors.email ? 'border-red-500' : ''}`}
                />
                {checkingEmail && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>}
              </div>
              {emailExists && (
                <p className="text-xs text-green-600">
                  ✓ Already registered. Click "Continue Chat" to resume.
                </p>
              )}
              {waitlistErrors.email && <p className="text-xs text-red-500">{waitlistErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={waitlistPhone}
                  onChange={(e) => { setWaitlistPhone(e.target.value); setWaitlistErrors(prev => ({ ...prev, phone: '' })); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleWaitlistSubmit()}
                  className={`pl-10 ${waitlistErrors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {waitlistErrors.phone && <p className="text-xs text-red-500">{waitlistErrors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const found = countries.find(c => c.code === e.target.value);
                    setSelectedCountry({ code: e.target.value, name: found?.name || '' });
                    setWaitlistErrors(prev => ({ ...prev, country: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary ${waitlistErrors.country ? 'border-red-500' : 'border-input'}`}
                  disabled={detectingCountry}
                >
                  <option value="">Select country...</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                {detectingCountry && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>}
              </div>
              {waitlistErrors.country && <p className="text-xs text-red-500">{waitlistErrors.country}</p>}
            </div>

            {waitlistErrors.form && <p className="text-xs text-red-500">{waitlistErrors.form}</p>}

            <Button onClick={handleWaitlistSubmit} disabled={waitlistLoading || !waitlistName || !waitlistEmail || !waitlistPhone} className="w-full">
              {waitlistLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
              {emailExists ? 'Continue Chat' : 'Start Chat'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chat step
  return (
    <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50 ${className}`}>
      <Card className={`${isMobile ? 'w-80 h-96' : 'w-96 h-[500px]'} shadow-2xl border-0 bg-black backdrop-blur`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-black">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-white">Support Chat</CardTitle>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 p-0">
              {isMinimized ? <Maximize2 className="h-4 w-4 text-white" /> : <Minimize2 className="h-4 w-4 text-white" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col bg-black" style={{ height: isMobile ? 'calc(384px - 4rem)' : 'calc(500px - 4rem)' }}>
            <div className="flex-1 overflow-y-auto px-4 bg-black">
              <div className="space-y-4 py-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-white">Start a conversation!</p>
                    <p className="text-xs text-muted-foreground mt-1">Our team will respond as soon as possible.</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMine = !message.is_admin_message;
                    return (
                      <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-2 max-w-[80%] ${isMine ? 'flex-row-reverse' : ''}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                            isMine ? 'bg-primary text-primary-foreground' : 'bg-zinc-700 text-white'
                          }`}>
                            {isMine ? 'Y' : 'S'}
                          </div>
                          <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                            <div className={`px-3 py-2 rounded-2xl text-sm ${
                              isMine ? 'bg-primary text-primary-foreground' : 'bg-zinc-700 text-white'
                            }`}>
                              {message.content}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <span>{MessagingService.formatMessageTime(message.created_at)}</span>
                              {isMine && message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-black">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-[40px] max-h-24 resize-none bg-zinc-900 text-white border-zinc-700 placeholder:text-muted-foreground"
                  disabled={sending}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim() || sending} size="sm" className="px-3 self-end">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              {sendError && <p className="text-xs text-red-500 mt-2">{sendError}</p>}
              <p className="text-xs text-muted-foreground mt-2">Press Enter to send</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
