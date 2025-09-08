import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DemoApp } from './DemoApp';
import { CraveTray } from './CraveTray';
import { Smartphone, Monitor, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { useScreenSize } from '@/hooks/useScreenSize';

export const DemoSection: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useScreenSize();
  const [selectedApp, setSelectedApp] = useState<'food' | 'fashion' | 'tech'>('food');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  const apps = [
    {
      id: 'food' as const,
      name: t('demo.apps.food.name'),
      description: t('demo.apps.food.description'),
      icon: '🍔',
      color: 'crave-orange'
    },
    {
      id: 'fashion' as const,
      name: t('demo.apps.fashion.name'),
      description: t('demo.apps.fashion.description'),
      icon: '👗',
      color: 'crave-purple'
    },
    {
      id: 'tech' as const,
      name: t('demo.apps.tech.name'),
      description: t('demo.apps.tech.description'),
      icon: '🎧',
      color: 'crave-blue'
    }
  ];

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsTrayOpen(true);
  };

  const closeTray = () => {
    setIsTrayOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <section id="demo-section" className={`${isMobile ? 'py-12 px-4' : 'py-20 px-6'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12'}`}>
          <Badge className={`${isMobile ? 'mb-3 text-xs px-2 py-1' : 'mb-4'} bg-primary/10 text-primary border-primary/20`}>
            {t('demo.badge')}
          </Badge>
          <h2 className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold ${isMobile ? 'mb-3' : 'mb-4'}`}>
            {t('demo.title')}
          </h2>
          <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-muted-foreground max-w-2xl mx-auto`}>
            {t('demo.description')}
          </p>
        </div>

        {/* App Selector */}
        <div className={`flex justify-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-2'} ${isMobile ? 'p-1' : 'p-2'} bg-card rounded-xl border`}>
            {apps.map((app) => (
              <Button
                key={app.id}
                variant={selectedApp === app.id ? "default" : "ghost"}
                className={cn(
                  `flex items-center ${isMobile ? 'gap-1 px-2 py-1' : 'gap-2 px-4 py-2'} rounded-lg transition-all duration-200`,
                  selectedApp === app.id && "bg-primary text-primary-foreground shadow-sm"
                )}
                onClick={() => setSelectedApp(app.id)}
              >
                <span className={`${isMobile ? 'text-sm' : 'text-lg'}`}>{app.icon}</span>
                <div className="text-left">
                  <div className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>{app.name}</div>
                  {!isMobile && <div className="text-xs opacity-70">{app.description}</div>}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Demo Container */}
        <div className="relative max-w-md mx-auto">
          {/* Phone Frame */}
          <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
            <div className="bg-black rounded-[2.5rem] p-1">
              {/* Screen */}
              <div className="bg-background rounded-[2rem] h-[600px] overflow-hidden relative">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-2 text-xs font-medium">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-foreground rounded-full"></div>
                      <div className="w-1 h-1 bg-foreground rounded-full"></div>
                      <div className="w-1 h-1 bg-foreground/50 rounded-full"></div>
                    </div>
                    <span className="ml-2">100%</span>
                  </div>
                </div>

                {/* App Content */}
                <div className="h-full pb-2">
                  <DemoApp type={selectedApp} onProductClick={handleProductClick} />
                </div>
              </div>
            </div>
            
            {/* Phone Details */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
          </div>

          {/* Demo Instructions */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Tap on any product in the {apps.find(a => a.id === selectedApp)?.name} to see Cravy Tray appear
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-crave-success rounded-full"></div>
                <span>Seamless integration</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-crave-orange rounded-full"></div>
                <span>No app switching</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-crave-purple rounded-full"></div>
                <span>Instant checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-4 text-crave-blue" />
              <h3 className="font-semibold mb-2">Mobile First</h3>
              <p className="text-sm text-muted-foreground">
                Optimized for mobile experiences with smooth animations and intuitive gestures.
              </p>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="text-center">
              <Monitor className="h-8 w-8 mx-auto mb-4 text-crave-orange" />
              <h3 className="font-semibold mb-2">Universal SDK</h3>
              <p className="text-sm text-muted-foreground">
                Works across iOS, Android, Flutter, React Native, and Web with a single integration.
              </p>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="text-center">
              <Tablet className="h-8 w-8 mx-auto mb-4 text-crave-purple" />
              <h3 className="font-semibold mb-2">Contextual Design</h3>
              <p className="text-sm text-muted-foreground">
                Adapts to your app's design language while maintaining consistent checkout experience.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* CraveTray Component */}
      <CraveTray
        isOpen={isTrayOpen}
        onClose={closeTray}
        product={selectedProduct}
        appContext={selectedApp}
      />
    </section>
  );
};