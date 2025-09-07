import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const storageKey = 'cravy_consent_analytics';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const v = window.localStorage.getItem(storageKey);
    if (v === null) setVisible(true);
  }, []);

  const accept = () => {
    window.localStorage.setItem(storageKey, 'true');
    setVisible(false);
    // reload to allow GTM injection
    window.location.reload();
  };
  const decline = () => {
    window.localStorage.setItem(storageKey, 'false');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[720px] rounded-xl border border-white/10 bg-gradient-card backdrop-blur p-4 shadow-glow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          We use functional cookies and optional analytics to improve Cravy. Choose your preference.
        </p>
        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" onClick={decline}>Decline</Button>
          <Button onClick={accept}>Allow analytics</Button>
        </div>
      </div>
    </div>
  );
}


