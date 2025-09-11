import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useScreenSize } from '@/hooks/useScreenSize';
import { AuthPrompt } from './AuthPrompt';
import { ChatWidget } from './messaging/ChatWidget';

export const SupportButton: React.FC = () => {
  const { user } = useAuth();
  const { isMobile } = useScreenSize();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSupportClick = () => {
    if (user) {
      // If user is authenticated, toggle chat
      setIsChatOpen(!isChatOpen);
    } else {
      // If user is not authenticated, show the auth prompt
      setShowAuthPrompt(true);
    }
  };

  const handleLogin = () => {
    setShowAuthPrompt(false);
    // After login, open the chat
    setIsChatOpen(true);
  };

  return (
    <>
      {/* Support Button - always visible */}
      <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50`}>
        <Button
          onClick={handleSupportClick}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Auth Prompt - only shown when clicked and user not authenticated */}
      {showAuthPrompt && !user && (
        <AuthPrompt onLogin={handleLogin} onClose={() => setShowAuthPrompt(false)} />
      )}

      {/* Chat Widget - only shown when user is authenticated and chat is open */}
      {user && isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
    </>
  );
};
