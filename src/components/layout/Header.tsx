import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useScreenSize } from '@/hooks/useScreenSize';

export function Header() {
  const { t } = useTranslation();
  const { isMobile } = useScreenSize();

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between py-2 px-4 sm:py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight text-white">
          <img src="/cravy_logo.jpg" alt="Cravy logo" className="h-5 w-5 sm:h-6 sm:w-6 rounded" />
          <span className={isMobile ? "hidden sm:inline" : ""}>{siteConfig.name}</span>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className={isMobile ? "px-2 sm:px-4" : ""}
              >
                <span className={isMobile ? "hidden sm:inline" : ""}>{t('common.menu')}</span>
                <span className={isMobile ? "sm:hidden" : "hidden"}>☰</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className={`${isMobile ? "w-full max-w-sm" : "w-80 sm:w-96"} bg-gradient-card backdrop-blur supports-[backdrop-filter]:bg-white/10 border-l border-white/10 shadow-2xl`}
            >
              <SheetHeader>
                <SheetTitle>{t('common.menu')}</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 grid gap-2 text-sm">
                <Link to="/features" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('navigation.features')}</Link>
                <Link to="/business" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('navigation.business')}</Link>
                <Link to="/creators" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('navigation.creators')}</Link>
                <Link to="/how-it-works" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('navigation.howItWorks')}</Link>
                <Link to="/faq" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('navigation.faq')}</Link>
                <Link to="/contact" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('navigation.contact')}</Link>
                <Link to="/download" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('navigation.download')}</Link>
                <Link to="/waitlist" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('navigation.waitlist')}</Link>
                <Link to="/blog" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">{t('navigation.blog')}</Link>
                <Link to="/auth" className="rounded-xl px-3 py-2 bg-crave-orange text-white hover:opacity-90 shadow-glow">{t('navigation.watchLive')}</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


