import { useEffect, useMemo, useRef, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { assetPaths } from '@/config/assets';
import { CraveTray } from '@/components/CraveTray';
import { UniversalInfoTray, type FeedType, type UniversalFeedItem } from '@/components/UniversalInfoTray';
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, ShoppingCart, Calendar, Search, SlidersHorizontal, Eye } from 'lucide-react';
import { useScreenSize } from '@/hooks/useScreenSize';

type SlideType = 'product' | 'service' | 'event' | 'subscription' | 'live_stream';

type Slide = {
  url: string;
  type: SlideType;
  poster?: string;
};

function inferTypeFromName(url: string): SlideType {
  const name = url.toLowerCase();
  if (name.includes('live_stream') || name.includes('live-stream') || (name.includes('live') && name.includes('stream'))) {
    return 'live_stream';
  }
  if (name.includes('subscription') || name.includes('subscribe') || name.includes('membership')) {
    return 'subscription';
  }
  if (name.includes('event') || name.includes('ticket')) {
    return 'event';
  }
  if (name.includes('service') || name.includes('barber') || name.includes('salon') || name.includes('book')) {
    return 'service';
  }
  return 'product';
}

export function PhoneReelDemo() {
  const { isMobile } = useScreenSize();
  const slides: Slide[] = useMemo(() => {
    const urls = Object.values(assetPaths.videos || {});
    return (urls.length ? urls : ['/assets/videos/sample1.mp4', '/assets/videos/sample2.mp4']).map((url) => ({
      url,
      type: inferTypeFromName(url),
    }));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [trayOpen, setTrayOpen] = useState(false);
  const [selected, setSelected] = useState<UniversalFeedItem | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [cartCount, setCartCount] = useState(0);
  const [hasApptPending, setHasApptPending] = useState(false);

  useEffect(() => {
    setCtaVisible(false);
    const t = setTimeout(() => setCtaVisible(true), 1500);
    return () => clearTimeout(t);
  }, [currentIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.clientHeight;
      const idx = Math.round(el.scrollTop / h);
      if (idx !== currentIndex) {
        setCurrentIndex(Math.max(0, Math.min(idx, slides.length - 1)));
        setTrayOpen(false);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll as any);
  }, [currentIndex, slides.length]);

  // Ensure autoplay by explicitly controlling playback on the active slide
  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === currentIndex) {
        // iOS requires muted + playsInline; also call play() inside a try
        v.muted = muted;
        v.playsInline = true as any;
        try { v.play().catch(() => {}); } catch {}
      } else {
        v.muted = muted;
        try { v.pause(); } catch {}
      }
    });
  }, [currentIndex, muted]);

  const openTray = (type: SlideType) => {
    const demo = (() => {
      switch (type) {
        case 'service':
          return {
            name: 'Barber — Fade',
            price: 15.0,
            image: 'https://images.unsplash.com/photo-1593702275802-81f69a7d3f8e?w=400&h=300&fit=crop',
            description: 'Book a clean fade with a pro barber. 30–45 minutes.',
            deliveryFee: 0,
            deliveryTime: '30–45 min',
            rating: 4.8,
            reviews: 112,
            category: 'Services',
            restaurant: 'Downtown Barber',
            spiceLevel: 'Pro',
            preparationTime: '30–45 min',
            uploaderAddress: '123 Main St, Helsinki',
            serviceCategory: 'Barber',
            priceNotes: 'No-show fee may apply',
            availableSlots: ['09:30','11:00','13:30','16:00'],
          };
        case 'event':
          return {
            name: 'Summer Night Live — GA Ticket',
            price: 19.0,
            image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
            description: 'One general admission ticket. Doors 7pm.',
            deliveryFee: 0,
            deliveryTime: 'Instant QR',
            rating: 4.7,
            reviews: 341,
            category: 'Events',
            eventDate: 'Fri, Aug 23 · 7:00 PM',
            eventLocation: 'Cravy Arena',
            capacity: 1200,
            capacityStatus: 'Limited',
            statusBadge: 'Upcoming',
            eventDetails: 'Doors 7pm · No re-entry · All ages welcome',
            availableTickets: 327,
          };
        case 'subscription':
          return {
            name: 'Creator Gold Membership',
            price: 4.99,
            image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&fit=crop',
            description: 'Monthly perks, exclusive drops, and rewards.',
            deliveryFee: 0,
            deliveryTime: 'Immediate access',
            rating: 4.6,
            reviews: 980,
            category: 'Subscriptions',
            subscriptionPlan: 'Gym Plus',
            subscriptionDuration: 'Monthly',
            subscriptionFeatures: ['Unlimited classes','Coach Q&A','Rewards'],
            formattedPrice: '€4.99 / month',
            tier: 'Gold',
            trainerAccess: true,
            accessAreas: 'Access to all locations',
          };
        case 'live_stream':
          return {
            name: 'Live Stream — Fashion Drop',
            price: 0,
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
            description: 'Join live now. Chat and shop in real time.',
            deliveryFee: 0,
            deliveryTime: 'Live',
            rating: 0,
            reviews: 0,
            category: 'Live',
            roomName: 'Fashion Drop Room',
            streamDuration: 'Live',
          };
        default:
          return {
            name: 'Chef Special — Lobster Pasta',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
            description: 'Fresh lobster with creamy sauce over pasta.',
            deliveryFee: 2.99,
            deliveryTime: '25–35 min',
            rating: 4.9,
            reviews: 256,
            category: 'Food',
            spiceLevel: 'Mild',
            cuisineType: 'Seafood',
            restaurant: 'Cravy Kitchen',
            dietaryInfo: 'Contains shellfish, dairy',
            preparationTime: '10–15 min',
            specialOffers: 'Free drink with order',
            addOns: ['Extra cheese','Garlic bread'],
          };
      }
    })();
    setSelected(demo);
    setTrayOpen(true);
  };

  return (
    <section className={`${isMobile ? 'py-6' : 'py-10'}`}>
      <div className="container mx-auto">
        <div className={`mx-auto w-full ${isMobile ? 'max-w-[320px]' : 'max-w-[380px]'}`}>
          <div className={`rounded-[36px] ${isMobile ? 'p-1' : 'p-2'} bg-gradient-to-b from-zinc-300/20 to-black/20 shadow-2xl`}>
            <AspectRatio ratio={9/19.5}>
              <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-black">
                {/* Vertical feed inside phone */}
                <div ref={containerRef} className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory scrollbar-hide scroll-y-pan">
                  {slides.map((s, i) => (
                    <div key={i} className="relative snap-start h-full w-full">
                      <video
                        ref={(el) => (videoRefs.current[i] = el)}
                        src={s.url}
                        className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                        muted={muted}
                        autoPlay={i === currentIndex}
                        playsInline
                        preload="auto"
                        loop
                      />

                      {/* Overlays */}
                      <div className={`absolute ${isMobile ? 'top-1 left-2 right-2' : 'top-2 left-3 right-3'} flex items-center justify-between z-10`}>
                        <div className={`text-white/90 ${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold`}>8:39</div>
                        <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'}`}>
                          <div className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full bg-black/40 backdrop-blur grid place-items-center text-white text-[11px]`}><Eye className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} /></div>
                          <div className={`relative ${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full bg-black/40 backdrop-blur grid place-items-center text-white`}>
                            <ShoppingCart className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
                            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full" />}
                          </div>
                          <div className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full bg-black/40 backdrop-blur grid place-items-center text-white`}><Calendar className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} /></div>
                          <div className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full bg-black/40 backdrop-blur grid place-items-center text-white`}><Search className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} /></div>
                          <div className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full bg-black/40 backdrop-blur grid place-items-center text-white`}><SlidersHorizontal className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} /></div>
                        </div>
                      </div>

                      {/* Right action rail */}
                      <div className={`absolute ${isMobile ? 'right-2 bottom-24' : 'right-3 bottom-28'} flex flex-col ${isMobile ? 'gap-3' : 'gap-4'} z-10`}>
                        <Button onClick={() => setMuted(m => !m)} variant="ghost" size="icon" className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} rounded-full bg-black/30 backdrop-blur`}>
                          {muted ? <VolumeX className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} /> : <Volume2 className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />}
                        </Button>
                        <Button variant="ghost" size="icon" className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} rounded-full bg-black/30 backdrop-blur`}><Heart className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} /></Button>
                        <Button variant="ghost" size="icon" className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} rounded-full bg-black/30 backdrop-blur`}><MessageCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} /></Button>
                        <Button variant="ghost" size="icon" className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} rounded-full bg-black/30 backdrop-blur`}><Share2 className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} /></Button>
                        <Button variant="ghost" size="icon" className={`relative ${isMobile ? 'h-8 w-8' : 'h-10 w-10'} rounded-full bg-black/30 backdrop-blur`}>
                          <Bookmark className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
                          {false && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full" />}
                        </Button>
                      </div>

                      {/* CTA */}
                      {ctaVisible && i === currentIndex && (
                        <div className={`absolute left-1/2 -translate-x-1/2 ${isMobile ? 'bottom-20' : 'bottom-24'} z-10`}>
                          <Button
                            onClick={() => openTray(s.type)}
                            className={
                              s.type === 'service'
                                ? `${isMobile ? 'h-10 px-6 text-sm' : 'h-12 px-8'} rounded-full bg-[#0D1B2A] text-white hover:opacity-90`
                                : s.type === 'subscription'
                                  ? `${isMobile ? 'h-10 px-6 text-sm' : 'h-12 px-8'} rounded-full bg-green-600 text-white hover:opacity-90`
                                  : s.type === 'event'
                                    ? `${isMobile ? 'h-10 px-6 text-sm' : 'h-12 px-8'} rounded-full bg-indigo-600 text-white hover:opacity-90`
                                    : s.type === 'live_stream'
                                      ? `${isMobile ? 'h-10 px-6 text-sm' : 'h-12 px-8'} rounded-full bg-red-600 text-white hover:opacity-90`
                                      : `${isMobile ? 'h-10 px-6 text-sm' : 'h-12 px-8'} rounded-full bg-crave-orange text-white hover:opacity-90`
                            }
                          >
                            {s.type === 'service' ? 'Book Appointment' : s.type === 'subscription' ? 'Subscribe' : s.type === 'event' ? 'Get Ticket' : s.type === 'live_stream' ? 'Join Live' : 'Buy Now'}
                          </Button>
                        </div>
                      )}

                      {/* Bottom nav */}
                      <div className={`absolute ${isMobile ? 'left-1 right-1 bottom-2' : 'left-2 right-2 bottom-3'} z-10`}>
                        <div className={`rounded-2xl bg-white/10 backdrop-blur border border-white/15 ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} text-white flex items-center justify-between ${isMobile ? 'text-[10px]' : 'text-[11px]'}`}>
                          <div className="font-semibold">Cravy</div>
                          <div className="flex gap-4 opacity-90 items-center">
                            <span>Trendy</span>
                            <span>Upload</span>
                            <span className="relative">Appts{hasApptPending && <span className="absolute -top-1 -right-3 h-2 w-2 bg-red-500 rounded-full" />}</span>
                            <span>Saved</span>
                            <span>Profile</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Tray within phone */}
                {selected && trayOpen && (
                  <div className="absolute inset-x-3 bottom-16 z-20">
                    <UniversalInfoTray
                      isOpen={true}
                      onClose={() => setTrayOpen(false)}
                      item={selected}
                      feedType={slides[currentIndex]?.type as FeedType}
                      ctaText={
                        (slides[currentIndex]?.type === 'service') ? 'Book Appointment' :
                        (slides[currentIndex]?.type === 'subscription') ? 'Subscribe' :
                        (slides[currentIndex]?.type === 'event') ? 'Get Ticket' :
                        (slides[currentIndex]?.type === 'live_stream') ? 'Join Live' : 'Buy Now'
                      }
                      onAction={() => {
                        if (slides[currentIndex]?.type === 'product') setCartCount(c => c + 1);
                        if (slides[currentIndex]?.type === 'service') setHasApptPending(true);
                        // Close tray and re-enable scrolling
                        setTrayOpen(false);
                        setSelected(null);
                        // Ensure scroll container regains focus
                        setTimeout(() => containerRef.current?.focus?.(), 0);
                      }}
                    />
                  </div>
                )}
              </div>
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
}


