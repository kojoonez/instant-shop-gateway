import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="container mx-auto py-10 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="font-semibold text-foreground">{siteConfig.name}</div>
            <p className="max-w-xl">
              {t('legal.companyInfo')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary">{t('navigation.privacy')}</Link>
            <Link to="/terms" className="hover:text-primary">{t('navigation.terms')}</Link>
            <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{t('social.twitter')}</a>
            <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{t('social.instagram')}</a>
            <a href={siteConfig.links.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{t('social.tiktok')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


