import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="container mx-auto py-10 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="font-semibold text-foreground">{siteConfig.name}</div>
            <p className="max-w-xl">
              {siteConfig.legalLine}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            <Link to="/terms" className="hover:text-primary">Terms</Link>
            <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Twitter</a>
            <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Instagram</a>
            <a href={siteConfig.links.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-primary">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


