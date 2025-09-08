import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Clock, 
  Shield, 
  Smartphone, 
  Star, 
  Zap,
  Users,
  Gift,
  Search,
  Heart,
  TrendingUp,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useScreenSize } from '@/hooks/useScreenSize';

export const WhyUsersLoveCravy: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useScreenSize();
  
  return (
    <section className={`${isMobile ? 'py-12 px-4' : 'py-24 px-6'} bg-gradient-to-br from-background to-accent/5`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
          <h2 className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'} font-bold ${isMobile ? 'mb-1' : 'mb-2'} bg-gradient-hero bg-clip-text text-transparent`}>
            {t('whyUsersLove.title')}
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-muted-foreground max-w-2xl mx-auto`}>
            {t('whyUsersLove.subtitle')}
          </p>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : isTablet ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
          {/* All-in-One Convenience */}
          <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
            <div className={`flex items-center gap-3 ${isMobile ? 'mb-3' : 'mb-4'}`}>
              <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-lg bg-primary/10`}>
                <ShoppingCart className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
              </div>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>{t('whyUsersLove.features.allInOne.title')}</h3>
            </div>
            <ul className={`${isMobile ? 'space-y-2' : 'space-y-3'} ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              {t('whyUsersLove.features.allInOne.items', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className={`${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full bg-primary ${isMobile ? 'mt-1.5' : 'mt-2'} flex-shrink-0`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Speed & Convenience */}
          <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
            <div className={`flex items-center gap-3 ${isMobile ? 'mb-3' : 'mb-4'}`}>
              <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-lg bg-primary/10`}>
                <Zap className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
              </div>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>{t('whyUsersLove.features.liveTapDone.title')}</h3>
            </div>
            <ul className={`${isMobile ? 'space-y-2' : 'space-y-3'} ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              {t('whyUsersLove.features.liveTapDone.items', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className={`${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full bg-primary ${isMobile ? 'mt-1.5' : 'mt-2'} flex-shrink-0`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Value & Deals */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t('whyUsersLove.features.exclusiveValue.title')}</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {t('whyUsersLove.features.exclusiveValue.items', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t('whyUsersLove.features.trustSafety.title')}</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {t('whyUsersLove.features.trustSafety.items', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Personalization */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t('whyUsersLove.features.smartDiscovery.title')}</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {t('whyUsersLove.features.smartDiscovery.items', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Rewards */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t('whyUsersLove.features.socialRewards.title')}</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {t('whyUsersLove.features.socialRewards.items', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center ${isMobile ? 'mt-8' : 'mt-16'}`}>
          <div className={`bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl ${isMobile ? 'p-4' : 'p-8'} border border-primary/20`}>
            <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${isMobile ? 'mb-3' : 'mb-4'}`}>{t('whyUsersLove.cta.title')}</h3>
            <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground ${isMobile ? 'mb-4' : 'mb-6'} max-w-2xl mx-auto`}>
              {t('whyUsersLove.cta.description')}
            </p>
            <div className={`flex flex-col ${isMobile ? 'gap-3' : 'sm:flex-row gap-4'} justify-center`}>
              <Button size={isMobile ? "default" : "lg"} asChild className={`bg-gradient-hero text-white font-semibold ${isMobile ? 'px-6 py-2' : 'px-8 py-3'}`}>
                <Link to="/download">{t('whyUsersLove.cta.getStarted')}</Link>
              </Button>
              <Button size={isMobile ? "default" : "lg"} variant="outline" asChild className={isMobile ? 'px-6 py-2' : 'px-8 py-3'}>
                <Link to="/how-it-works">{t('whyUsersLove.cta.seeHowItWorks')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
