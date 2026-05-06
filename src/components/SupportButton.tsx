import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useScreenSize } from '@/hooks/useScreenSize';
import { ChatWidget } from './messaging/ChatWidget';

export const SupportButton: React.FC = () => {
  const { isMobile } = useScreenSize();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50`}>
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
    </>
  );
};
