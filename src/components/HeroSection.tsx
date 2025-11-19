import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, Smartphone, Zap, Globe, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useScreenSize } from '@/hooks/useScreenSize';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useScreenSize();
  
  const scrollToDemo = () => {
    const demoSection = document.getElementById('phone-demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      <div className={`absolute top-20 left-10 ${isMobile ? 'w-20 h-20' : 'w-32 h-32'} bg-crave-orange/10 rounded-full blur-3xl animate-pulse`} />
      <div className={`absolute bottom-20 right-10 ${isMobile ? 'w-24 h-24' : 'w-40 h-40'} bg-crave-purple/10 rounded-full blur-3xl animate-pulse delay-1000`} />
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'w-40 h-40' : 'w-60 h-60'} bg-crave-blue/5 rounded-full blur-3xl animate-pulse delay-2000`} />
      
      <div className={`relative z-10 text-center max-w-4xl mx-auto ${isMobile ? 'px-4' : 'px-6'}`}>
        {/* Badge */}
        <Badge className={`${isMobile ? 'mb-2 text-xs px-2 py-1' : 'mb-3'} bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors`}>
          <Zap className={`${isMobile ? 'h-2 w-2 mr-1' : 'h-3 w-3 mr-1'}`} />
          <span className={isMobile ? 'text-xs' : ''}>{t('marketing.hero.badge')}</span>
        </Badge>

        {/* Main Heading */}
        <h1 className={`${isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-5xl md:text-7xl'} font-bold ${isMobile ? 'mb-2' : 'mb-3'} bg-gradient-hero bg-clip-text text-transparent`}>
          {t('marketing.hero.title')}
        </h1>
        
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-semibold ${isMobile ? 'mb-2' : 'mb-3'} text-foreground/90`}>
          {t('marketing.hero.subtitle')}
        </h2>

        {/* Description */}
        <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-muted-foreground ${isMobile ? 'mb-4' : 'mb-6'} max-w-2xl mx-auto leading-relaxed`}>
          {t('marketing.hero.description')}
        </p>

        {/* Features Grid */}
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-4 gap-4'} ${isMobile ? 'mb-4' : 'mb-6'} max-w-2xl mx-auto`}>
          <div className={`text-center ${isMobile ? 'p-2' : 'p-3'}`}>
            <Smartphone className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} mx-auto ${isMobile ? 'mb-1' : 'mb-2'} text-crave-blue`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{t('marketing.hero.features.universalSdk')}</span>
          </div>
          <div className={`text-center ${isMobile ? 'p-2' : 'p-3'}`}>
            <Zap className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} mx-auto ${isMobile ? 'mb-1' : 'mb-2'} text-crave-orange`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{t('marketing.hero.features.instantCheckout')}</span>
          </div>
          <div className={`text-center ${isMobile ? 'p-2' : 'p-3'}`}>
            <Globe className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} mx-auto ${isMobile ? 'mb-1' : 'mb-2'} text-crave-purple`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{t('marketing.hero.features.anyPlatform')}</span>
          </div>
          <div className={`text-center ${isMobile ? 'p-2' : 'p-3'}`}>
            <Shield className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} mx-auto ${isMobile ? 'mb-1' : 'mb-2'} text-crave-success`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{t('marketing.hero.features.securePayments')}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            size="lg" 
            className="bg-gradient-hero hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105"
            onClick={scrollToDemo}
          >
            See Live Demo
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="font-semibold px-8 py-3 rounded-xl border-primary/30 hover:bg-primary/5 transition-all duration-200"
            asChild
          >
            <Link to="/download">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <ArrowDown className="h-6 w-6 mx-auto text-muted-foreground" />
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 animate-float">
        <div className="w-3 h-3 bg-crave-orange rounded-full opacity-60" />
      </div>
      <div className="absolute top-1/3 right-1/3 animate-float delay-1000">
        <div className="w-2 h-2 bg-crave-purple rounded-full opacity-60" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float delay-2000">
        <div className="w-4 h-4 bg-crave-blue rounded-full opacity-60" />
      </div>
    </section>
  );
};