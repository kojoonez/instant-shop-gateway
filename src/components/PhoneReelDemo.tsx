import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { assetPaths } from '@/config/assets';
// CraveTray component removed - product functionality not needed
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
  
  // Declare videoKey first before using it in useMemo
  const [videoKey, setVideoKey] = useState(0); // Key to force video refresh
  
  const slides: Slide[] = useMemo(() => {
    const urls = Object.values(assetPaths.videos || {});
    const allSlides = (urls.length ? urls : ['/assets/videos/sample1.mp4', '/assets/videos/sample2.mp4']).map((url) => ({
      url,
      type: inferTypeFromName(url),
    }));
    
    // Shuffle array to refresh video order when videoKey changes
    const shuffled = [...allSlides];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [videoKey]); // Re-compute when videoKey changes to refresh videos

  const [currentIndex, setCurrentIndex] = useState(0);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [trayOpen, setTrayOpen] = useState(false);
  const [selected, setSelected] = useState<UniversalFeedItem | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [cartCount, setCartCount] = useState(0);
  const [hasApptPending, setHasApptPending] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);
  const [actionHintVisible, setActionHintVisible] = useState(true);
  const [clickedActions, setClickedActions] = useState<Set<number>>(new Set());
  const [currentView, setCurrentView] = useState<'feed' | 'trendy' | 'profile'>('feed');
  const [trendyFilter, setTrendyFilter] = useState<SlideType | 'all'>('all');

  useEffect(() => {
    setCtaVisible(false);
    const t = setTimeout(() => setCtaVisible(true), 1500);
    return () => clearTimeout(t);
  }, [currentIndex]);

  // Show action hint for new video if user hasn't clicked action button on it yet
  useEffect(() => {
    if (!clickedActions.has(currentIndex)) {
      setActionHintVisible(true);
    } else {
      setActionHintVisible(false);
    }
  }, [currentIndex, clickedActions]);

  // Handle Cravy click - refresh demo feed only
  const handleCravyClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    // Don't scroll the page - just refresh the demo feed
    // Reset the demo view
    setCurrentView('feed');
    // Force video refresh by changing key and resetting to first video
    setVideoKey(prev => prev + 1);
    setCurrentIndex(0);
    // Reset scroll to top of phone container
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    // Reset hints
    setScrollHintVisible(true);
    setHasScrolled(false);
    setActionHintVisible(true);
    setClickedActions(new Set());
  }, []);

  // Handle Trendy click - show product page
  const handleTrendyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentView('trendy');
  };

  // Handle Profile click - show profile page
  const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentView('profile');
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      // Hide scroll hint on first scroll
      if (!hasScrolled) {
        setHasScrolled(true);
        setScrollHintVisible(false);
      }
      
      const h = el.clientHeight;
      const idx = Math.round(el.scrollTop / h);
      if (idx !== currentIndex) {
        setCurrentIndex(Math.max(0, Math.min(idx, slides.length - 1)));
        setTrayOpen(false);
        // Show action hint for new video if user hasn't clicked action button on it yet
        if (!clickedActions.has(idx)) {
          setActionHintVisible(true);
        }
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll as any);
  }, [currentIndex, slides.length, hasScrolled, clickedActions]);

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

  const openTray = (type: SlideType, videoIndex?: number) => {
    // Mark action button as clicked for current video
    const idx = videoIndex !== undefined ? videoIndex : currentIndex;
    if (!clickedActions.has(idx)) {
      setClickedActions(prev => new Set(prev).add(idx));
      setActionHintVisible(false);
    }
    
    const demo = (() => {
      switch (type) {
        case 'service':
          return {
            name: 'Barber: Fade',
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
            name: 'Summer Night Live: GA Ticket',
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
            name: 'Live Stream: Fashion Drop',
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
            name: 'Chef Special: Lobster Pasta',
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
    <section id="phone-demo-section" className={`${isMobile ? 'py-6' : 'py-10'}`}>
      <div className="container mx-auto">
        <div className={`mx-auto w-full ${isMobile ? 'max-w-[320px]' : 'max-w-[380px]'}`}>
          <div className={`rounded-[36px] ${isMobile ? 'p-1' : 'p-2'} bg-gradient-to-b from-zinc-300/20 to-black/20 shadow-2xl`}>
            <AspectRatio ratio={9/19.5}>
              <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-black">
                {/* Profile Page View */}
                {currentView === 'profile' && (
                  <div className="absolute inset-0 overflow-y-auto bg-black scrollbar-hide">
                    <div className="relative h-full w-full">
                      {/* Header */}
                      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-white/10 p-4">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => setCurrentView('feed')}
                          >
                            ←
                          </Button>
                          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white`}>Profile</h2>
                          <div className="w-10" /> {/* Spacer for centering */}
                        </div>
                      </div>

                      {/* Profile Content */}
                      <div className="p-6 pb-20 space-y-6">
                        {/* Profile Picture and Name */}
                        <div className="flex flex-col items-center space-y-4">
                          <div className="relative">
                            <img
                              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces"
                              alt="Profile"
                              className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} rounded-full border-4 border-white/20 object-cover`}
                            />
                            <div className={`absolute bottom-0 right-0 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-green-500 rounded-full border-2 border-black`} />
                          </div>
                          <div className="text-center">
                            <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white mb-1`}>Alex Johnson</h2>
                            <p className={`${isMobile ? 'text-sm' : 'text-base'} text-white/70`}>@alexjohnson</p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>24</div>
                            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>Orders</div>
                          </div>
                          <div className="text-center">
                            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>12</div>
                            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>Saved</div>
                          </div>
                          <div className="text-center">
                            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>8</div>
                            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>Reviews</div>
                          </div>
                        </div>

                        {/* Details Section */}
                        <div className="space-y-4">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-white mb-3`}>Details</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-white/10 flex items-center justify-center`}>
                                  <span className="text-white">📧</span>
                                </div>
                                <div>
                                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>Email</div>
                                  <div className={`${isMobile ? 'text-sm' : 'text-base'} text-white`}>alex.johnson@email.com</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-white/10 flex items-center justify-center`}>
                                  <span className="text-white">📱</span>
                                </div>
                                <div>
                                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>Phone</div>
                                  <div className={`${isMobile ? 'text-sm' : 'text-base'} text-white`}>+358 50 123 4567</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-white/10 flex items-center justify-center`}>
                                  <span className="text-white">📍</span>
                                </div>
                                <div>
                                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>Location</div>
                                  <div className={`${isMobile ? 'text-sm' : 'text-base'} text-white`}>Helsinki, Finland</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Member Since */}
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>Member Since</div>
                                <div className={`${isMobile ? 'text-sm' : 'text-base'} text-white font-semibold`}>January 2024</div>
                              </div>
                              <div className="px-3 py-1 bg-crave-orange/20 rounded-full">
                                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-crave-orange font-semibold`}>⭐ Premium</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trendy Page View */}
                {currentView === 'trendy' && (
                  <div className="absolute inset-0 overflow-y-auto bg-black scrollbar-hide">
                    <div className="relative h-full w-full">
                      {/* Header */}
                      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-white/10">
                        <div className="flex items-center justify-between p-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => setCurrentView('feed')}
                          >
                            ←
                          </Button>
                          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white`}>Trendy</h2>
                          <div className="w-10" /> {/* Spacer for centering */}
                        </div>
                        {/* Filter Chips */}
                        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
                          {[
                            { type: 'all' as const, label: 'All', icon: '✨' },
                            { type: 'product' as const, label: 'Food', icon: '🍔' },
                            { type: 'service' as const, label: 'Services', icon: '💇' },
                            { type: 'event' as const, label: 'Events', icon: '🎫' },
                            { type: 'subscription' as const, label: 'Subs', icon: '⭐' },
                            { type: 'live_stream' as const, label: 'Live', icon: '🔴' },
                          ].map((filter) => (
                            <button
                              key={filter.type}
                              onClick={() => setTrendyFilter(filter.type)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                trendyFilter === filter.type
                                  ? 'bg-crave-orange text-white'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20'
                              }`}
                            >
                              <span className="mr-1">{filter.icon}</span>
                              {filter.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Products Grid */}
                      <div className="p-4 pb-20">
                        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
                          {([
                            { type: 'product', name: 'Lobster Pasta', price: 24.99, delivery: 2.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop', rating: 4.9 },
                            { type: 'service', name: 'Barber: Fade', price: 15.00, delivery: 0, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop&q=80', rating: 4.8 },
                            { type: 'event', name: 'Summer Night Live', price: 19.00, delivery: 0, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop', rating: 4.7 },
                            { type: 'product', name: 'Truffle Risotto', price: 32.50, delivery: 3.50, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop', rating: 4.8 },
                            { type: 'subscription', name: 'Gold Membership', price: 4.99, delivery: 0, image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=400&fit=crop', rating: 4.6 },
                            { type: 'live_stream', name: 'Fashion Drop Live', price: 0, delivery: 0, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop', rating: 0 },
                            { type: 'service', name: 'Massage Therapy', price: 45.00, delivery: 0, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop&q=80', rating: 4.9 },
                            { type: 'product', name: 'Wagyu Steak', price: 45.00, delivery: 4.00, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop', rating: 4.9 },
                            { type: 'event', name: 'Jazz Night', price: 12.00, delivery: 0, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', rating: 4.8 },
                            { type: 'product', name: 'Sushi Platter', price: 28.99, delivery: 2.50, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop', rating: 4.7 },
                            { type: 'subscription', name: 'Fitness Plus', price: 9.99, delivery: 0, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', rating: 4.7 },
                            { type: 'service', name: 'Hair Color', price: 65.00, delivery: 0, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop&q=80', rating: 4.9 },
                          ] as Array<{ type: SlideType; name: string; price: number; delivery: number; image: string; rating: number }>)
                            .filter(item => trendyFilter === 'all' || item.type === trendyFilter)
                            .map((item, idx) => {
                            const getButtonText = () => {
                              switch (item.type) {
                                case 'service': return 'Book Now';
                                case 'event': return 'Get Ticket';
                                case 'subscription': return 'Subscribe';
                                case 'live_stream': return 'Join Live';
                                default: return 'Add to Cart';
                              }
                            };
                            
                            const getButtonColor = () => {
                              switch (item.type) {
                                case 'service': return 'bg-[#0D1B2A]';
                                case 'event': return 'bg-indigo-600';
                                case 'subscription': return 'bg-green-600';
                                case 'live_stream': return 'bg-red-600';
                                default: return 'bg-crave-orange';
                              }
                            };

                            const getSecondaryText = () => {
                              switch (item.type) {
                                case 'service': return 'Book';
                                case 'event': return 'Ticket';
                                case 'subscription': return 'Monthly';
                                case 'live_stream': return 'Live';
                                default: return 'Delivery';
                              }
                            };

                            const getSecondaryValue = () => {
                              if (item.type === 'service') return '30-45 min';
                              if (item.type === 'event') return 'Instant';
                              if (item.type === 'subscription') return '€' + item.price.toFixed(2) + '/mo';
                              if (item.type === 'live_stream') return 'Now';
                              return '€' + item.delivery.toFixed(2);
                            };

                            return (
                              <div
                                key={idx}
                                className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                                onClick={() => {
                                  if (item.type === 'product') {
                                    setCartCount(c => c + 1);
                                  } else if (item.type === 'service') {
                                    setHasApptPending(true);
                                  }
                                  openTray(item.type as SlideType);
                                }}
                              >
                                {/* Product Image */}
                                <div className="aspect-square relative bg-white/5">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder.svg';
                                      target.onerror = null; // Prevent infinite loop
                                    }}
                                  />
                                  {item.rating > 0 && (
                                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                                      <span className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-white font-semibold`}>⭐ {item.rating}</span>
                                    </div>
                                  )}
                                  {item.type === 'live_stream' && (
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                      LIVE
                                    </div>
                                  )}
                                </div>

                                {/* Product Info */}
                                <div className="p-3 space-y-1">
                                  <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-white line-clamp-1`}>{item.name}</h3>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/60`}>Price</div>
                                      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-white`}>
                                        {item.price === 0 ? 'Free' : '€' + item.price.toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/60`}>{getSecondaryText()}</div>
                                      <div className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-white/90`}>{getSecondaryValue()}</div>
                                    </div>
                                  </div>
                                  <Button
                                    className={`w-full ${isMobile ? 'h-8 text-xs' : 'h-9 text-sm'} rounded-xl ${getButtonColor()} text-white font-semibold hover:opacity-90 mt-2`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (item.type === 'product') {
                                        setCartCount(c => c + 1);
                                      } else if (item.type === 'service') {
                                        setHasApptPending(true);
                                      }
                                      openTray(item.type as SlideType);
                                    }}
                                  >
                                    {getButtonText()}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vertical feed inside phone */}
                {currentView === 'feed' && (
                  <div ref={containerRef} key={videoKey} className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory scrollbar-hide scroll-y-pan">
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

                      {/* Scroll Hint - Centered strip box, shows until first scroll */}
                      {scrollHintVisible && i === currentIndex && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                          <div className={`bg-black/70 backdrop-blur-md rounded-full ${isMobile ? 'px-4 py-1.5' : 'px-5 py-2'} border border-white/20 shadow-lg animate-fade-in`}>
                            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/90 flex items-center gap-2 whitespace-nowrap`}>
                              <span className="text-base">⬆️⬇️</span>
                              <span>Swipe to explore videos</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Button Hint - Strip box above button, shows until clicked */}
                      {actionHintVisible && i === currentIndex && !clickedActions.has(i) && (
                        <div className={`absolute left-1/2 -translate-x-1/2 ${isMobile ? 'bottom-36' : 'bottom-40'} z-20 pointer-events-none`}>
                          <div className={`bg-black/70 backdrop-blur-md rounded-full ${isMobile ? 'px-4 py-1.5' : 'px-5 py-2'} border border-white/20 shadow-lg animate-fade-in`}>
                            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-white/90 flex items-center gap-2 whitespace-nowrap`}>
                              <span className="text-base">👆</span>
                              <span>
                                {s.type === 'service' 
                                  ? 'Tap "Book Appointment" to try'
                                  : s.type === 'subscription'
                                  ? 'Tap "Subscribe" to see plans'
                                  : s.type === 'event'
                                  ? 'Tap "Get Ticket" to explore'
                                  : s.type === 'live_stream'
                                  ? 'Tap "Join Live" to experience'
                                  : 'Tap "Buy Now" to checkout'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      {ctaVisible && i === currentIndex && (
                        <div className={`absolute left-1/2 -translate-x-1/2 ${isMobile ? 'bottom-20' : 'bottom-24'} z-10`}>
                          <Button
                            onClick={() => openTray(s.type, i)}
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
                    </div>
                  ))}
                  </div>
                )}

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

                {/* Bottom nav - Fixed for all views */}
                <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'p-1' : 'p-2'} z-30`}>
                  <div className={`rounded-2xl bg-white/10 backdrop-blur border border-white/15 ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} text-white flex items-center justify-between ${isMobile ? 'text-[10px]' : 'text-[11px]'}`}>
                    <button 
                      type="button"
                      onClick={handleCravyClick}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="font-semibold text-white hover:text-white/90 transition-colors cursor-pointer"
                    >
                      Cravy
                    </button>
                    <div className="flex gap-4 opacity-90 items-center">
                      <button 
                        type="button"
                        onClick={handleTrendyClick}
                        className={`${currentView === 'trendy' ? 'text-white font-semibold' : 'text-white/70 hover:text-white'} transition-colors cursor-pointer`}
                      >
                        Trendy
                      </button>
                      <span className="cursor-pointer hover:text-white transition-colors">Upload</span>
                      <span className="relative cursor-pointer hover:text-white transition-colors">Appts{hasApptPending && <span className="absolute -top-1 -right-3 h-2 w-2 bg-red-500 rounded-full" />}</span>
                      <span className="cursor-pointer hover:text-white transition-colors">Saved</span>
                      <button
                        type="button"
                        onClick={handleProfileClick}
                        className={`${currentView === 'profile' ? 'text-white font-semibold' : 'text-white/70 hover:text-white'} transition-colors cursor-pointer`}
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
}


