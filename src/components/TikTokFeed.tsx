import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UniversalInfoTray, FeedType, UniversalFeedItem } from './UniversalInfoTray';
import { assetPaths } from '@/config/assets';
import { useScreenSize } from '@/hooks/useScreenSize';

type DemoVideo = {
  id: string;
  url: string;
  type: FeedType;
  item: UniversalFeedItem;
};

const typeToCta: Record<FeedType, string> = {
  product: 'Buy Now',
  service: 'Book Appointment',
  event: 'Get Ticket',
  subscription: 'Subscribe',
  live_stream: 'Join Live',
};

const typeColor: Record<FeedType, string> = {
  product: '#FF6B35',
  service: '#001F4D',
  event: '#4A148C',
  subscription: '#006400',
  live_stream: '#DC2626',
};

const generateSampleItem = (type: FeedType, sourceLabel: string): UniversalFeedItem => {
  const baseItem: UniversalFeedItem = {
    name: sourceLabel.replace(/_|-|\.mp4/g, ' ').trim(),
    description: 'Experience seamless live shopping, food ordering, and service booking.',
    price: 24.99,
    image: 'https://via.placeholder.com/150',
    rating: 4.5,
    reviews: 120,
    distanceKm: 0.8,
  };

  switch (type) {
    case 'product':
      return {
        ...baseItem,
        name: 'Gourmet Truffle Pasta',
        description: 'Indulge in our exquisite truffle pasta, made with fresh ingredients.',
        price: 24.99,
        spiceLevel: 'Mild',
        cuisineType: 'Italian',
        restaurant: 'Chef Marco’s Kitchen',
        dietaryInfo: 'Vegetarian',
        preparationTime: '15 min',
        deliveryFee: 3.5,
        deliveryTime: '30-45 min',
        specialOffers: 'Free delivery on orders over €50',
        addOns: ['Extra Cheese', 'Garlic Bread'],
      };
    case 'service':
      return {
        ...baseItem,
        name: 'Luxury Haircut & Shave',
        description: 'Experience a premium grooming session with our master barber.',
        price: 45,
        restaurant: 'The Gentlemen’s Barber',
        serviceCategory: 'Grooming',
        preparationTime: '60 min',
        uploaderAddress: '123 Main St, Helsinki',
        priceNotes: 'Includes hot towel and massage.',
        availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'],
      };
    case 'event':
      return {
        ...baseItem,
        name: 'Summer Night Live Concert',
        description: 'Enjoy an evening of live music under the stars with local artists.',
        price: 15,
        eventDate: 'Sat, Aug 23 · 7:00 PM',
        eventLocation: 'City Park Amphitheater',
        capacity: 500,
        capacityStatus: 'Available',
        eventDetails: 'Featuring pop and indie artists. Food and drinks available.',
        availableTickets: 150,
      };
    case 'subscription':
      return {
        ...baseItem,
        name: 'Premium Gym Membership',
        description: 'Unlock unlimited access to all Cravy Gym locations and premium classes.',
        price: 49.99,
        subscriptionPlan: 'Monthly Premium',
        subscriptionDuration: '1 month',
        subscriptionFeatures: ['Unlimited classes', 'Personal trainer sessions', 'Nutrition plans'],
        formattedPrice: '€49.99 / month',
        tier: 'Gold',
        trainerAccess: true,
        accessAreas: 'All Cravy Gym locations',
      };
    case 'live_stream':
      return {
        ...baseItem,
        name: 'Fashion Drop Live',
        description: 'Join our live stream for exclusive fashion drops and styling tips.',
        price: undefined,
        roomName: 'Fashionista Hub',
        streamDuration: '1 hour',
      };
    default:
      return baseItem;
  }
};

const inferTypeFromKey = (key: string, path: string): FeedType => {
  const src = `${key} ${path}`.toLowerCase();
  if (src.includes('live_stream')) return 'live_stream';
  if (src.includes('subscription')) return 'subscription';
  if (src.includes('service')) return 'service';
  if (src.includes('event')) return 'event';
  return 'product';
};

const makeVideosFromAssets = (): DemoVideo[] =>
  Object.entries(assetPaths.videos).map(([key, path], idx) => {
    const url = typeof path === 'string' ? path : String(path);
    const type = inferTypeFromKey(key, url);
    const label = url.split('/').pop() || key;
    return {
      id: String(idx + 1),
      url,
      type,
      item: generateSampleItem(type, label),
    };
  });

type VideoItemProps = {
  video: DemoVideo;
  isActive: boolean;
  onCtaTrigger: (item: UniversalFeedItem, type: FeedType, ctaText: string) => void;
};

const VideoItem: React.FC<VideoItemProps> = ({ video, isActive, onCtaTrigger }) => {
  const { isMobile } = useScreenSize();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  // Tray opens only when user taps the CTA button (no auto-trigger)

  return (
    <div className={`relative ${isMobile ? 'h-[70vh]' : 'h-screen'} w-full bg-black flex-shrink-0 overflow-hidden`}>
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Right Actions */}
      <div className={`absolute ${isMobile ? 'right-2' : 'right-4'} ${isMobile ? 'bottom-20' : 'bottom-24'} flex flex-col ${isMobile ? 'gap-4' : 'gap-6'} z-20`}>
        <Button
          variant="ghost"
          size="icon"
          className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={cn(`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`, isLiked ? 'fill-red-500 text-red-500' : 'text-white')} />
        </Button>
        <Button variant="ghost" size="icon" className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40`}>
          <MessageCircle className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-white`} />
        </Button>
        <Button variant="ghost" size="icon" className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40`}>
          <Share className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-white`} />
        </Button>
        <Button variant="ghost" size="icon" className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40`}>
          <MoreHorizontal className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-white`} />
        </Button>
      </div>

      {/* CTA Button */}
      <div className={`absolute ${isMobile ? 'bottom-4 left-2' : 'bottom-6 left-4'} z-50 pointer-events-auto`} onClick={(e) => e.stopPropagation()}>
        <Button
          className={`rounded-full ${isMobile ? 'px-4 h-8 text-sm' : 'px-5 h-10'} font-semibold`}
          style={{ backgroundColor: typeColor[video.type], color: '#fff' }}
          onClick={() => onCtaTrigger(video.item, video.type, typeToCta[video.type])}
        >
          {typeToCta[video.type]}
        </Button>
      </div>

      {/* Mute toggle */}
      <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} flex gap-2 z-20`}>
        <Button
          variant="ghost"
          size="icon"
          className={`${isMobile ? 'h-7 w-7' : 'h-8 w-8'} rounded-full bg-black/20 backdrop-blur-sm`}
          onClick={() => setIsMuted((m) => !m)}
        >
          {isMuted ? <VolumeX className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} /> : <Volume2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />}
        </Button>
      </div>
    </div>
  );
};

export const TikTokFeed: React.FC = () => {
  const { isMobile } = useScreenSize();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<UniversalFeedItem | null>(null);
  const [currentFeedType, setCurrentFeedType] = useState<FeedType>('product');
  const [currentCtaText, setCurrentCtaText] = useState<string>('Buy Now');
  const containerRef = useRef<HTMLDivElement>(null);

  const videos = makeVideosFromAssets();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const videoHeight = element.clientHeight;
    const newIndex = Math.round(scrollTop / videoHeight);
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
    }
  };

  const openTrayWithItem = (item: UniversalFeedItem, type: FeedType, ctaText: string) => {
    setCurrentItem(item);
    setCurrentFeedType(type);
    setCurrentCtaText(ctaText);
    setIsTrayOpen(true);
  };

  const closeTray = () => {
    setIsTrayOpen(false);
    setCurrentItem(null);
  };

  const handleAction = () => {
    // Simple close on action for demo parity
    setIsTrayOpen(false);
    setCurrentItem(null);
  };

  return (
    <div className={`relative ${isMobile ? 'h-[70vh]' : 'h-screen'} bg-black overflow-hidden`}>
      {/* Header */}
      <div className={`absolute top-0 left-0 right-0 z-30 flex justify-center ${isMobile ? 'pt-8 pb-2' : 'pt-12 pb-4'}`}>
        <div className={`flex ${isMobile ? 'gap-4' : 'gap-6'}`}>
          <span className={`${isMobile ? 'text-sm' : 'text-base'} text-white font-medium`}>Following</span>
          <span className={`${isMobile ? 'text-sm' : 'text-base'} text-white font-bold border-b-2 border-white pb-1`}>For You</span>
        </div>
      </div>

      {/* Video Feed */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
      >
        {videos.map((video, index) => (
          <div key={video.id} className="snap-start">
            <VideoItem
              video={video}
              isActive={index === currentVideoIndex}
              onCtaTrigger={openTrayWithItem}
            />
          </div>
        ))}
      </div>

      {/* Universal Info Tray */}
      <div className="absolute bottom-0 left-0 right-0 z-[60] pointer-events-auto">
        {currentItem && (
          <UniversalInfoTray
            isOpen={isTrayOpen}
            onClose={closeTray}
            item={currentItem}
            feedType={currentFeedType}
            ctaText={currentCtaText}
            onAction={handleAction}
          />
        )}
      </div>
    </div>
  );
};