import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CraveTray } from './CraveTray';
import { Heart, Star, MapPin, Play, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoAppProps {
  type: 'food' | 'fashion' | 'tech';
  onProductClick: (product: any) => void;
}

const products = {
  food: {
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
  },
  fashion: {
    id: 'winter-coat',
    name: 'Alpine Winter Coat',
    price: 189.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d2d?w=400&h=300&fit=crop',
    description: 'Premium wool-blend coat with down insulation. Water-resistant and wind-proof. Perfect for harsh winter conditions.',
    rating: 4.9,
    reviews: 67,
    category: 'Winter Wear',
    deliveryFee: 9.99,
    deliveryTime: '2-3 days',
    badges: ['Limited Edition', 'Free Returns']
  },
  tech: {
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
};

const appStyles = {
  food: {
    bg: 'from-orange-500/20 to-red-500/20',
    accent: 'text-crave-orange',
    button: 'bg-crave-orange hover:bg-crave-orange/90'
  },
  fashion: {
    bg: 'from-purple-500/20 to-pink-500/20',
    accent: 'text-crave-purple',
    button: 'bg-crave-purple hover:bg-crave-purple/90'
  },
  tech: {
    bg: 'from-blue-500/20 to-cyan-500/20',
    accent: 'text-crave-blue',
    button: 'bg-crave-blue hover:bg-crave-blue/90'
  }
};

const FoodApp: React.FC<{ onProductClick: (product: any) => void }> = ({ onProductClick }) => {
  const product = products.food;
  
  return (
    <div className="h-full bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">FoodieApp</h2>
            <div className="flex items-center gap-1 text-orange-300">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">Downtown • 2.1 mi</span>
            </div>
          </div>
          <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Trending Now</h3>
          <Card 
            className="bg-card/80 backdrop-blur-sm border-orange-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onProductClick(product)}
          >
            <div className="p-3">
              <div className="flex gap-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-orange-500 text-white text-xs">Popular</Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.rating}</span>
                    </div>
                    <span className="text-sm font-bold text-orange-500">${product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center py-8">
          <div className="text-2xl mb-2">🍔</div>
          <p className="text-xs text-muted-foreground">Tap the burger to see CraveTray in action!</p>
        </div>
      </div>
    </div>
  );
};

const FashionApp: React.FC<{ onProductClick: (product: any) => void }> = ({ onProductClick }) => {
  const product = products.fashion;
  
  return (
    <div className="h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">StyleHub</h2>
          <Heart className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Winter Collection</h3>
        </div>
        
        <Card 
          className="bg-card/80 backdrop-blur-sm border-purple-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => onProductClick(product)}
        >
          <div className="p-3">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-32 rounded-xl object-cover mb-3"
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                <Badge className="bg-purple-500 text-white text-xs">Limited</Badge>
                <Badge variant="outline" className="text-xs">Free Returns</Badge>
              </div>
              <h4 className="font-semibold">{product.name}</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{product.rating} ({product.reviews})</span>
                </div>
                <span className="text-lg font-bold text-purple-500">${product.price}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">Tap the coat to experience seamless checkout!</p>
        </div>
      </div>
    </div>
  );
};

const TechApp: React.FC<{ onProductClick: (product: any) => void }> = ({ onProductClick }) => {
  const product = products.tech;
  
  return (
    <div className="h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">TechStore</h2>
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-white" />
            <span className="text-xs text-white">Live</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Featured Product</h3>
          <Card 
            className="bg-card/80 backdrop-blur-sm border-blue-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => onProductClick(product)}
          >
            <div className="p-3">
              <div className="relative mb-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-28 rounded-xl object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-blue-500 text-white text-xs">
                  Best Seller
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.rating}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-500">${product.price}</div>
                    <div className="text-xs text-muted-foreground line-through">${product.originalPrice}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">Try the earbuds with instant purchase!</p>
        </div>
      </div>
    </div>
  );
};

export const DemoApp: React.FC<DemoAppProps> = ({ type, onProductClick }) => {
  const apps = {
    food: FoodApp,
    fashion: FashionApp,
    tech: TechApp
  };
  
  const AppComponent = apps[type];
  
  return <AppComponent onProductClick={onProductClick} />;
};