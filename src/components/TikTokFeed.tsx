import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CraveTray } from './CraveTray';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoData {
  id: string;
  username: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
  videoUrl: string;
  thumbnailUrl: string;
  isPromo?: boolean;
  product?: any;
}

const videos: VideoData[] = [
  {
    id: '1',
    username: '@foodie_sarah',
    description: 'Quick morning breakfast routine ✨ #breakfast #healthy',
    likes: '12.3K',
    comments: '892',
    shares: '445',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop',
  },
  {
    id: '2',
    username: '@chef_marco',
    description: 'This Truffle Mushroom Burger is INSANE 🔥 Available for delivery now! #sponsored #foodie',
    likes: '45.7K',
    comments: '2.1K',
    shares: '1.2K',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=600&fit=crop',
    isPromo: true,
    product: {
      id: 'burger-deluxe',
      name: 'Truffle Mushroom Burger',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      description: 'Grass-fed beef patty with truffle mushrooms, aged cheddar, arugula, and house-made aioli on a brioche bun.',
      rating: 4.8,
      reviews: 142,
      category: 'Gourmet Burgers',
      deliveryFee: 0,
      deliveryTime: '25-35 min',
      badges: ['Popular', 'Chef Special']
    }
  },
  {
    id: '3',
    username: '@style_queen',
    description: 'Winter outfit of the day ❄️ loving this cozy vibe',
    likes: '8.9K',
    comments: '456',
    shares: '223',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d2d?w=400&h=600&fit=crop',
  },
  {
    id: '4',
    username: '@tech_reviewer',
    description: 'These wireless earbuds are a GAME CHANGER! 🎧 Link in bio #tech #audio',
    likes: '67.2K',
    comments: '3.4K',
    shares: '2.8K',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=600&fit=crop',
    isPromo: true,
    product: {
      id: 'wireless-earbuds',
      name: 'ProAudio Elite Buds',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop',
      description: 'Premium wireless earbuds with active noise cancellation, 8-hour battery life, and crystal-clear audio quality.',
      rating: 4.7,
      reviews: 289,
      category: 'Audio Devices',
      deliveryFee: 0,
      deliveryTime: 'Same day',
      badges: ['Best Seller', 'Fast Shipping']
    }
  },
  {
    id: '5',
    username: '@daily_dancer',
    description: 'New choreography to my favorite song 💃 #dance #viral',
    likes: '156K',
    comments: '12.5K',
    shares: '8.9K',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=600&fit=crop',
  }
];

const VideoItem: React.FC<{ 
  video: VideoData; 
  isActive: boolean; 
  onPromoTrigger: (product: any) => void;
}> = ({ video, isActive, onPromoTrigger }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !isPlaying) {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else if (!isActive && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (isActive && video.isPromo && video.product) {
      // Auto-trigger CraveTray for promotional videos
      const timer = setTimeout(() => {
        onPromoTrigger(video.product);
      }, 1500); // Trigger after 1.5 seconds of viewing
      
      return () => clearTimeout(timer);
    }
  }, [isActive, video.isPromo, video.product, onPromoTrigger]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="relative h-screen w-full bg-black flex-shrink-0 overflow-hidden">
      {/* Video Element */}
      <video 
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onLoadStart={() => console.log(`Loading video: ${video.id}`)}
        onCanPlay={() => console.log(`Can play video: ${video.id}`)}
        onError={(e) => console.error(`Video error for ${video.id}:`, e)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Promo Badge */}
      {video.isPromo && (
        <div className="absolute top-20 left-4 z-10">
          <Badge className="bg-crave-orange text-white animate-pulse">
            🔥 Sponsored
          </Badge>
        </div>
      )}

      {/* Play/Pause Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
        onClick={togglePlayPause}
      >
        {!isPlaying && (
          <div className="bg-black/50 rounded-full p-4 animate-fade-in">
            <Play className="h-12 w-12 text-white fill-white" />
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-20">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={cn("h-6 w-6", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
        </Button>
        <div className="text-center">
          <span className="text-white text-xs font-medium">{video.likes}</span>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        <div className="text-center">
          <span className="text-white text-xs font-medium">{video.comments}</span>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
        >
          <Share className="h-6 w-6 text-white" />
        </Button>
        <div className="text-center">
          <span className="text-white text-xs font-medium">{video.shares}</span>
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
        >
          <MoreHorizontal className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-4 right-20 z-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{video.username}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 px-2 text-xs bg-transparent border-white text-white hover:bg-white hover:text-black"
            >
              Follow
            </Button>
          </div>
          <p className="text-white text-sm">{video.description}</p>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-white" />
          ) : (
            <Volume2 className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};

export const TikTokFeed: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const videoHeight = element.clientHeight;
    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
    }
  };

  const handlePromoTrigger = (product: any) => {
    setSelectedProduct(product);
    setIsTrayOpen(true);
  };

  const closeTray = () => {
    setIsTrayOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-12 pb-4">
        <div className="flex gap-6">
          <span className="text-white font-medium">Following</span>
          <span className="text-white font-bold border-b-2 border-white pb-1">For You</span>
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
              onPromoTrigger={handlePromoTrigger}
            />
          </div>
        ))}
      </div>

      {/* CraveTray */}
      <CraveTray
        isOpen={isTrayOpen}
        onClose={closeTray}
        product={selectedProduct}
        appContext="food"
      />

      {/* Auto-trigger indicator */}
      {videos[currentVideoIndex]?.isPromo && (
        <div className="absolute bottom-32 left-4 z-30">
          <div className="bg-crave-orange/90 backdrop-blur-sm rounded-full px-3 py-1 animate-pulse">
            <span className="text-white text-xs font-medium">🛒 Tap to order instantly!</span>
          </div>
        </div>
      )}
    </div>
  );
};