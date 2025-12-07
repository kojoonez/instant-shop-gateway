import { useEffect, useMemo, useRef, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import styles from './CravyPhoneDemo.module.css';

type StepKey =
  | 'intro'
  | 'login'
  | 'feed'
  | 'live'
  | 'catalog'
  | 'food'
  | 'services'
  | 'events'
  | 'subs'
  | 'wallet'
  | 'apply'
  | 'end';

type Step = { key: StepKey; duration: number; caption: string };

const STEPS: Step[] = [
  { key: 'intro', duration: 2000, caption: 'Watch, shop, and book live.' },
  { key: 'login', duration: 2000, caption: 'Feeds require login.' },
  { key: 'feed', duration: 5000, caption: 'Discover feeds from creators and businesses.' },
  { key: 'live', duration: 5000, caption: 'Shop live: see it, tap it, get it.' },
  { key: 'catalog', duration: 4000, caption: 'Everything you love in one catalog.' },
  { key: 'food', duration: 4000, caption: 'Order meals fast.' },
  { key: 'services', duration: 3000, caption: 'Book services in seconds.' },
  { key: 'events', duration: 3000, caption: 'Find events, grab tickets.' },
  { key: 'subs', duration: 3000, caption: 'Subscriptions and instant downloads.' },
  { key: 'wallet', duration: 3000, caption: 'Invite friends, earn rewards.' },
  { key: 'apply', duration: 2000, caption: 'Apply as a creator or business.' },
  { key: 'end', duration: 4000, caption: 'Get the app and start today.' },
];

export function CravyPhoneDemo() {
  const totalDuration = useMemo(() => STEPS.reduce((s, x) => s + x.duration, 0), []);
  const [stepIndex, setStepIndex] = useState(0);
  const [progressMs, setProgressMs] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < STEPS.length && !cancelled; i++) {
        setStepIndex(i);
        const start = performance.now();
        const tick = () => {
          const now = performance.now();
          setProgressMs(p => {
            const base = STEPS.slice(0, i).reduce((s, x) => s + x.duration, 0);
            return base + Math.min(STEPS[i].duration, now - start);
          });
          if (!cancelled && now - start < STEPS[i].duration) {
            timerRef.current = requestAnimationFrame(tick);
          }
        };
        timerRef.current = requestAnimationFrame(tick);
        await new Promise(r => setTimeout(r, STEPS[i].duration));
      }
      if (!cancelled) {
        // seamless loop
        setStepIndex(0);
        setProgressMs(0);
        run();
      }
    };
    run();
    return () => {
      cancelled = true;
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    const dx = (rx - 0.5) * 6; // degrees
    const dy = (0.5 - ry) * 6;
    setParallax({ x: dx, y: dy });
  };

  const caption = STEPS[stepIndex].caption;

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div
          ref={containerRef}
          onMouseMove={onMouseMove}
          className="mx-auto w-full max-w-[380px] perspective-[1200px]"
          aria-label="Cravy app autoplay demo"
        >
          <div
            className={styles.phoneTilt}
            data-tilt={`${parallax.y},${parallax.x}`}
            style={{ transform: `rotateX(${parallax.y}deg) rotateY(${parallax.x}deg)` }}
          >
            <div className="rounded-[36px] p-2 bg-gradient-to-b from-zinc-300/20 to-black/20 shadow-2xl">
              <AspectRatio ratio={9/19.5}>
                <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-gradient-hero">
                  {/* Bezel shine */}
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_60%_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)]" />

                  {/* Scenes */}
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'intro' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <IntroScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'login' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <LoginScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'feed' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <FeedScene progressMs={progressMs} />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'live' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <LiveScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'catalog' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <CatalogScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'food' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <FoodScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'services' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <ServicesScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'events' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <EventsScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'subs' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <SubsScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'wallet' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <WalletScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'apply' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <ApplyScene />
                  </div>
                  <div className={`absolute inset-0 ${STEPS[stepIndex].key === 'end' ? styles.sceneVisible : styles.sceneHidden}`}>
                    <EndScene />
                  </div>

                  {/* Caption chip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-crave-orange text-white text-xs shadow-glow">
                      {caption}
                    </span>
                  </div>

                  {/* Page dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-80">
                    {STEPS.map((_, i) => (
                      <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === stepIndex ? 'bg-white' : 'bg-white/30'}`} />
                    ))}
                  </div>
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>

        {/* Timeline progress bar */}
        <div className="mx-auto mt-6 w-full max-w-[360px] h-1 bg-white/10 rounded-full overflow-hidden">
          <div className={styles.progressBar} data-progress={`${(progressMs / totalDuration) * 100}`} style={{ width: `${(progressMs / totalDuration) * 100}%` }} />
        </div>
      </div>
    </section>
  );
}

// Scene components (lightweight synthetic UIs). Keep visuals brand-aligned.

function IntroScene() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center animate-scale-in">
        <div className="text-3xl font-extrabold tracking-tight text-white">Cravy</div>
        <div className="mt-2 text-sm text-white/80">Live shopping · Food · Services · Events</div>
      </div>
    </div>
  );
}

function LoginScene() {
  return (
    <div className="h-full w-full flex items-center justify-center p-6">
      <div className="w-full rounded-2xl bg-gradient-card p-5 border border-white/10">
        <div className="text-lg font-semibold mb-2">Sign in to continue</div>
        <div className="text-xs text-muted-foreground mb-4">Watching feeds requires login.</div>
        <div className="grid gap-2">
          <div className="h-9 rounded-md bg-white/5 border border-white/10" />
          <div className="h-9 rounded-md bg-white/5 border border-white/10" />
          <Button className="mt-2">Sign in</Button>
        </div>
      </div>
    </div>
  );
}

function FeedScene({ progressMs }: { progressMs: number }) {
  // auto-scroll mimic using translateY
  const offset = Math.min(1, Math.max(0, (progressMs % 5000) / 5000));
  const translate = -offset * 120; // px
  return (
    <div className="h-full w-full p-3">
      <div className="relative h-[82%] overflow-hidden rounded-xl border border-white/10 bg-black/20">
        <div className="absolute inset-0 transition-transform" style={{ transform: `translateY(${translate}px)` }}>
          {[1,2,3].map(i => (
            <div key={i} className="h-56 m-3 rounded-xl bg-[url('/placeholder.svg')] bg-cover bg-center shadow-tray relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="h-8 w-8 rounded-full bg-black/40 grid place-items-center text-xs">♥</div>
                <div className="h-8 w-8 rounded-full bg-black/40 grid place-items-center text-xs">⤴</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Avatar strip */}
      <div className="mt-2 flex gap-2 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-10 w-10 rounded-full bg-white/15 border border-white/20" />
        ))}
      </div>
    </div>
  );
}

function LiveScene() {
  return (
    <div className="h-full w-full p-3">
      <div className="relative h-full rounded-xl overflow-hidden bg-black/40 border border-white/10">
        <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-red-600 text-white">LIVE</div>
        {/* product tray */}
        <div className="absolute bottom-3 left-3 right-3 grid gap-2">
          <div className="flex items-center justify-between rounded-xl bg-gradient-tray p-3 border border-white/10 shadow-tray">
            <div>
              <div className="text-sm font-medium">Glow Serum</div>
              <div className="text-xs text-white/70">€24.90</div>
            </div>
            <Button size="sm">Add to Cart</Button>
          </div>
          <div className="self-end text-[11px] text-white/80">Added to cart ✓</div>
        </div>
      </div>
    </div>
  );
}

function CatalogScene() {
  return (
    <div className="h-full w-full p-3">
      <div className="grid grid-cols-2 gap-2">
        {['Smartphone','Leather Bag','Perfume','Headphones'].map((n,i) => (
          <div key={n} className="rounded-xl p-2 bg-gradient-card border border-white/10">
            <div className="h-24 rounded-lg bg-white/10 mb-2" />
            <div className="text-xs font-medium line-clamp-1">{n}</div>
            <div className="text-[11px] text-white/70">€{(79 + i*20).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FoodScene() {
  return (
    <div className="h-full w-full p-3">
      <div className="rounded-xl p-3 bg-gradient-card border border-white/10">
        <div className="h-28 rounded-lg bg-white/10 mb-3" />
        <div className="text-sm font-semibold">Jollof Rice</div>
        <div className="text-xs text-white/70 mb-3">€9.90</div>
        <div className="flex gap-2">
          <Button size="sm">Add to order</Button>
          <Button size="sm" variant="outline">Cravy Partner Delivery ▾</Button>
        </div>
      </div>
    </div>
  );
}

function ServicesScene() {
  return (
    <div className="h-full w-full p-3">
      <div className="rounded-xl p-3 bg-gradient-card border border-white/10">
        <div className="text-sm font-semibold mb-2">Barber: Fade</div>
        <div className="h-10 rounded-md bg-white/10 mb-2" />
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/80">Today, 15:30</div>
          <Button size="sm">Book</Button>
        </div>
      </div>
    </div>
  );
}

function EventsScene() {
  return (
    <div className="h-full w-full p-3">
      <div className="rounded-xl p-3 bg-gradient-card border border-white/10">
        <div className="h-24 rounded-lg bg-white/10 mb-2" />
        <div className="text-sm font-semibold">Summer Night Live</div>
        <div className="text-xs text-white/70 mb-2">€19.00</div>
        <Button size="sm">Get Ticket</Button>
      </div>
    </div>
  );
}

function SubsScene() {
  return (
    <div className="h-full w-full p-3">
      <div className="rounded-xl p-3 bg-gradient-card border border-white/10 mb-2">
        <div className="text-sm font-semibold">Gold Membership</div>
        <div className="text-xs text-white/70 mb-2">€4.99 / month</div>
        <Button size="sm">Subscribe</Button>
      </div>
      <div className="rounded-xl p-3 bg-gradient-card border border-white/10">
        <div className="text-sm font-semibold">Digital Preset Pack</div>
        <div className="text-xs text-white/70 mb-2">Instant download</div>
        <Button size="sm">Buy now</Button>
      </div>
    </div>
  );
}

function WalletScene() {
  return (
    <div className="h-full w-full p-3 grid gap-2">
      <div className="rounded-xl p-3 bg-gradient-card border border-white/10">
        <div className="text-sm font-semibold">Share & Earn</div>
        <div className="text-xs text-white/70">Code: CRVY-9K2</div>
      </div>
      <div className="rounded-xl p-3 bg-gradient-card border border-white/10">
        <div className="text-sm font-semibold">Wallet</div>
        <div className="text-xs text-white/70">Balance: €12.40 · Rewards: 240</div>
      </div>
    </div>
  );
}

function ApplyScene() {
  return (
    <div className="h-full w-full p-3">
      <div className="rounded-xl p-4 bg-gradient-card border border-white/10 grid gap-3">
        <div className="text-sm font-semibold">Apply</div>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" className="w-full">Creator</Button>
          <Button size="sm" variant="outline" className="w-full">Business</Button>
        </div>
        <div className="text-[11px] text-white/70">Submit profile → Verify → Go live</div>
      </div>
    </div>
  );
}

function EndScene() {
  return (
    <div className="h-full w-full p-5 flex flex-col items-center justify-center text-center gap-3">
      <div className="text-2xl font-bold text-white">Cravy</div>
      <div className="text-sm text-white/80 max-w-[220px]">Watch, shop, and book live.</div>
      <div className="flex gap-2 mt-1">
        <Button size="sm">Get Started</Button>
        <Button size="sm" variant="outline">Download App</Button>
      </div>
      <div className="mt-2 text-[10px] text-white/60">Rescue Delivery Services: Registered Company in Finland.</div>
      <div className="text-[10px] text-white/60">Watching feeds requires login.</div>
    </div>
  );
}


