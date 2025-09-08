import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useScreenSize } from '@/hooks/useScreenSize';

const colorClasses = [
  "from-orange-500 to-red-500",
  "from-blue-500 to-purple-500",
  "from-yellow-500 to-pink-500",
  "from-green-500 to-teal-500",
  "from-purple-500 to-indigo-500",
  "from-cyan-500 to-blue-500",
  "from-red-500 to-orange-500",
  "from-violet-500 to-purple-500"
];

export const SloganBanner: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useScreenSize();
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Get slogans from translations
  const slogans = t('marketing.slogans', { returnObjects: true }) as Array<{text: string, emojis: string}>;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % slogans.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [slogans.length]);

  const current = slogans[currentSlogan];
  const currentColor = colorClasses[currentSlogan % colorClasses.length];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r from-background via-accent/10 to-background ${isMobile ? 'py-2' : 'py-4'}`}>
      {/* Moving background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" />
      
      {/* Slogan content */}
      <div className="relative z-10 flex items-center justify-center">
        <div 
          className={cn(
            `flex items-center ${isMobile ? 'gap-2' : 'gap-3'} transition-all duration-500 transform`,
            isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          )}
        >
          {/* Emojis */}
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} animate-bounce`}>
            {current.emojis}
          </div>
          
          {/* Slogan text */}
          <div className="text-center">
            <h3 
              className={cn(
                `${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'} font-bold bg-gradient-to-r bg-clip-text text-transparent animate-pulse`,
                `bg-gradient-to-r ${currentColor}`
              )}
            >
              {current.text}
            </h3>
          </div>
          
          {/* More emojis */}
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} animate-bounce delay-150`}>
            {current.emojis}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-2 left-4 text-primary/20 text-lg animate-pulse">🛍️</div>
        <div className="absolute top-3 right-8 text-primary/20 text-lg animate-pulse delay-75">📲</div>
        <div className="absolute bottom-2 left-8 text-primary/20 text-lg animate-pulse delay-150">⚡</div>
        <div className="absolute bottom-3 right-4 text-primary/20 text-lg animate-pulse delay-300">💎</div>
      </div>
    </div>
  );
};
