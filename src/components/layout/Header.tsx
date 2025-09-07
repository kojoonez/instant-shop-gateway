import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <img src="/cravy_logo.jpg" alt="Cravy logo" className="h-6 w-6 rounded" />
          {siteConfig.name}
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Menu</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96 bg-gradient-card backdrop-blur supports-[backdrop-filter]:bg-white/10 border-l border-white/10 shadow-2xl">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 grid gap-2 text-sm">
              <Link to="/features" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Features</Link>
              <Link to="/business" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">For Businesses</Link>
              <Link to="/creators" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">For Creators</Link>
              <Link to="/how-it-works" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">How It Works</Link>
              <Link to="/faq" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">FAQ</Link>
              <Link to="/contact" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Contact</Link>
              <Link to="/download" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Download</Link>
              <Link to="/blog" className="rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">Blog</Link>
              <Link to="/auth" className="rounded-xl px-3 py-2 bg-crave-orange text-white hover:opacity-90 shadow-glow">Watch Live</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}


