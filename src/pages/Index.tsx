import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { DemoSection } from '@/components/DemoSection';
import { TikTokFeed } from '@/components/TikTokFeed';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [showTikTok, setShowTikTok] = useState(false);

  if (showTikTok) {
    return (
      <div className="relative h-screen">
        <TikTokFeed />
        <Button 
          variant="ghost"
          className="absolute top-4 left-4 z-40 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
          onClick={() => setShowTikTok(false)}
        >
          ← Back to Demo
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <DemoSection />
      
      {/* TikTok Demo Button */}
      <section className="py-12 px-6 text-center">
        <Button 
          onClick={() => setShowTikTok(true)}
          className="bg-gradient-hero text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform"
        >
          🎵 Try TikTok-Style Auto CraveTray
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Experience automatic product tray triggers on promotional videos
        </p>
      </section>
    </div>
  );
};

export default Index;
