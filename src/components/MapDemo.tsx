import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScreenSize } from '@/hooks/useScreenSize';

const defaultCenter: [number, number] = [60.1699, 24.9384]; // Helsinki as example

// Define shop categories
const shopCategories = {
  food: {
    name: 'Food & Restaurants',
    icon: '🍔',
    color: 'bg-orange-500'
  },
  fashion: {
    name: 'Fashion & Clothing',
    icon: '👗',
    color: 'bg-pink-500'
  },
  tech: {
    name: 'Electronics & Tech',
    icon: '📱',
    color: 'bg-blue-500'
  },
  beauty: {
    name: 'Beauty & Cosmetics',
    icon: '💄',
    color: 'bg-purple-500'
  },
  home: {
    name: 'Home & Garden',
    icon: '🏠',
    color: 'bg-green-500'
  }
};

const restaurants = [
  {
    id: '1',
    name: "Marco's Trattoria",
    cuisine: 'Italian',
    rating: 4.8,
    reviews: 342,
    coords: [60.1709, 24.9375] as [number, number],
    featured: true,
    menu: [
      {
        id: 'truffle-pasta',
        name: 'Truffle Mushroom Pasta',
        price: 28.99,
        originalPrice: 34.99,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
        description: 'House-made fettuccine with truffle oil and wild mushrooms.',
        rating: 4.9,
        reviews: 156,
        category: 'Pasta',
        deliveryFee: 2.99,
        deliveryTime: '25-35 min',
        badges: ['Chef Special']
      },
      {
        id: 'margherita',
        name: 'Margherita Pizza',
        price: 12.5,
        image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?w=400&h=300&fit=crop',
        description: 'Tomato, mozzarella, basil, extra virgin olive oil.',
        rating: 4.7,
        reviews: 298,
        category: 'Pizza',
        deliveryFee: 1.99,
        deliveryTime: '20-30 min',
        badges: ['Popular']
      },
      {
        id: 'tiramisu',
        name: 'Tiramisu',
        price: 6.9,
        image: 'https://images.unsplash.com/photo-1613478223719-3d57b0f633a1?w=400&h=300&fit=crop',
        description: 'Classic coffee-soaked ladyfingers, mascarpone cream, cocoa.',
        rating: 4.8,
        reviews: 221,
        category: 'Dessert',
        deliveryFee: 0,
        deliveryTime: '20-30 min',
        badges: ['Sweet']
      }
    ],
    // keep first menu item as default featured product
    product: undefined
  },
  {
    id: '2',
    name: 'Sakura Sushi',
    cuisine: 'Japanese',
    rating: 4.7,
    reviews: 189,
    coords: [60.168, 24.94] as [number, number],
    menu: [
      {
        id: 'salmon-nigiri',
        name: 'Salmon Nigiri (6pc)',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
        description: 'Fresh salmon over seasoned rice.',
        rating: 4.6,
        reviews: 143,
        category: 'Sushi',
        deliveryFee: 1.5,
        deliveryTime: '20-30 min',
        badges: ['Fresh']
      },
      {
        id: 'rainbow-roll',
        name: 'Rainbow Roll',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        description: 'California roll topped with assorted sashimi.',
        rating: 4.7,
        reviews: 167,
        category: 'Rolls',
        deliveryFee: 1.5,
        deliveryTime: '25-35 min',
        badges: ['Colorful']
      },
      {
        id: 'miso-soup',
        name: 'Miso Soup',
        price: 3.5,
        image: 'https://images.unsplash.com/photo-1617191518300-0b3f7e8e79b8?w=400&h=300&fit=crop',
        description: 'Tofu, wakame, scallion; light and comforting.',
        rating: 4.5,
        reviews: 92,
        category: 'Soup',
        deliveryFee: 0,
        deliveryTime: '15-20 min',
        badges: ['Warm']
      }
    ]
  },
  {
    id: '3',
    name: 'The Burger Joint',
    cuisine: 'American',
    rating: 4.6,
    reviews: 423,
    coords: [60.172, 24.942] as [number, number],
    menu: [
      {
        id: 'smash-burger',
        name: 'Double Smash Burger',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
        description: 'Two smashed patties, cheddar, pickles, house sauce.',
        rating: 4.7,
        reviews: 512,
        category: 'Burger',
        deliveryFee: 2.49,
        deliveryTime: '20-30 min',
        badges: ['Best Seller']
      },
      {
        id: 'fries',
        name: 'Crispy Fries',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1541592553160-82008b127ccb?w=400&h=300&fit=crop',
        description: 'Golden, lightly salted potato fries.',
        rating: 4.6,
        reviews: 403,
        category: 'Sides',
        deliveryFee: 0,
        deliveryTime: '15-20 min',
        badges: ['Crispy']
      },
      {
        id: 'chicken-burger',
        name: 'Spicy Chicken Burger',
        price: 12.5,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
        description: 'Crunchy chicken, spicy mayo, lettuce.',
        rating: 4.5,
        reviews: 218,
        category: 'Burger',
        deliveryFee: 2.49,
        deliveryTime: '20-30 min',
        badges: ['Spicy']
      }
    ]
  }
];

// Fashion shops
const fashionShops = [
  {
    id: 'f1',
    name: 'Style Boutique',
    category: 'Fashion',
    rating: 4.6,
    reviews: 128,
    coords: [60.1715, 24.9395] as [number, number],
    featured: true,
    menu: [
      {
        id: 'summer-dress',
        name: 'Floral Summer Dress',
        price: 89.99,
        originalPrice: 129.99,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
        description: 'Light and breezy floral dress perfect for summer.',
        rating: 4.8,
        reviews: 45,
        category: 'Dresses',
        deliveryFee: 4.99,
        deliveryTime: '2-3 days',
        badges: ['Summer Collection']
      },
      {
        id: 'denim-jacket',
        name: 'Classic Denim Jacket',
        price: 65.99,
        image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=300&fit=crop',
        description: 'Timeless denim jacket for any occasion.',
        rating: 4.7,
        reviews: 32,
        category: 'Jackets',
        deliveryFee: 4.99,
        deliveryTime: '2-3 days',
        badges: ['Classic']
      },
      {
        id: 'sneakers',
        name: 'White Canvas Sneakers',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
        description: 'Comfortable white canvas sneakers.',
        rating: 4.5,
        reviews: 67,
        category: 'Shoes',
        deliveryFee: 4.99,
        deliveryTime: '2-3 days',
        badges: ['Comfortable']
      }
    ]
  },
  {
    id: 'f2',
    name: 'Urban Streetwear',
    category: 'Fashion',
    rating: 4.4,
    reviews: 89,
    coords: [60.1685, 24.9365] as [number, number],
    menu: [
      {
        id: 'hoodie',
        name: 'Oversized Hoodie',
        price: 55.99,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop',
        description: 'Comfortable oversized hoodie with modern fit.',
        rating: 4.6,
        reviews: 23,
        category: 'Hoodies',
        deliveryFee: 3.99,
        deliveryTime: '1-2 days',
        badges: ['Streetwear']
      }
    ]
  },
  {
    id: 'f3',
    name: 'Adidas Store Helsinki',
    category: 'Fashion',
    rating: 4.8,
    reviews: 312,
    coords: [60.1735, 24.9455] as [number, number],
    featured: true,
    menu: [
      {
        id: 'ultraboost-22',
        name: 'Ultraboost 22 Running Shoes',
        price: 189.99,
        originalPrice: 220.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
        description: 'Premium running shoes with Boost midsole technology for maximum energy return.',
        rating: 4.9,
        reviews: 156,
        category: 'Running Shoes',
        deliveryFee: 5.99,
        deliveryTime: '1-2 days',
        badges: ['Best Seller', 'Running']
      },
      {
        id: 'originals-tracksuit',
        name: 'Originals Tracksuit Set',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
        description: 'Classic three-stripe tracksuit in iconic Adidas style.',
        rating: 4.7,
        reviews: 89,
        category: 'Tracksuits',
        deliveryFee: 4.99,
        deliveryTime: '1-2 days',
        badges: ['Classic', 'Originals']
      },
      {
        id: 'stan-smith',
        name: 'Stan Smith White Sneakers',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
        description: 'Timeless white leather sneakers with green heel tab.',
        rating: 4.8,
        reviews: 234,
        category: 'Lifestyle Shoes',
        deliveryFee: 3.99,
        deliveryTime: '1-2 days',
        badges: ['Iconic', 'Lifestyle']
      },
      {
        id: 'adizero-jersey',
        name: 'Adizero Football Jersey',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
        description: 'Lightweight football jersey with moisture-wicking technology.',
        rating: 4.6,
        reviews: 67,
        category: 'Sports Jerseys',
        deliveryFee: 4.99,
        deliveryTime: '1-2 days',
        badges: ['Sports', 'Performance']
      },
      {
        id: 'backpack',
        name: 'Adidas Backpack',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
        description: 'Durable backpack perfect for sports and everyday use.',
        rating: 4.5,
        reviews: 45,
        category: 'Accessories',
        deliveryFee: 2.99,
        deliveryTime: '1-2 days',
        badges: ['Durable', 'Versatile']
      }
    ]
  }
];

// Tech shops
const techShops = [
  {
    id: 't1',
    name: 'TechHub Electronics',
    category: 'Electronics',
    rating: 4.7,
    reviews: 234,
    coords: [60.1705, 24.9415] as [number, number],
    featured: true,
    menu: [
      {
        id: 'wireless-headphones',
        name: 'Wireless Noise-Canceling Headphones',
        price: 199.99,
        originalPrice: 249.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        description: 'Premium wireless headphones with active noise cancellation.',
        rating: 4.8,
        reviews: 156,
        category: 'Audio',
        deliveryFee: 9.99,
        deliveryTime: '1-2 days',
        badges: ['Premium']
      },
      {
        id: 'smartphone',
        name: 'Latest Smartphone',
        price: 899.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        description: 'Latest generation smartphone with advanced features.',
        rating: 4.9,
        reviews: 89,
        category: 'Phones',
        deliveryFee: 9.99,
        deliveryTime: '1-2 days',
        badges: ['Latest']
      },
      {
        id: 'laptop',
        name: 'Gaming Laptop',
        price: 1299.99,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        description: 'High-performance gaming laptop with RTX graphics.',
        rating: 4.7,
        reviews: 45,
        category: 'Computers',
        deliveryFee: 19.99,
        deliveryTime: '2-3 days',
        badges: ['Gaming']
      }
    ]
  }
];

// Beauty shops
const beautyShops = [
  {
    id: 'b1',
    name: 'Glamour Cosmetics',
    category: 'Beauty',
    rating: 4.5,
    reviews: 167,
    coords: [60.1675, 24.9385] as [number, number],
    featured: true,
    menu: [
      {
        id: 'lipstick-set',
        name: 'Luxury Lipstick Set',
        price: 49.99,
        originalPrice: 69.99,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop',
        description: 'Set of 5 premium lipsticks in various shades.',
        rating: 4.6,
        reviews: 78,
        category: 'Makeup',
        deliveryFee: 2.99,
        deliveryTime: '1-2 days',
        badges: ['Luxury']
      },
      {
        id: 'skincare-set',
        name: 'Anti-Aging Skincare Set',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
        description: 'Complete anti-aging skincare routine set.',
        rating: 4.7,
        reviews: 92,
        category: 'Skincare',
        deliveryFee: 2.99,
        deliveryTime: '1-2 days',
        badges: ['Anti-Aging']
      }
    ]
  }
];

// Home & Garden shops
const homeShops = [
  {
    id: 'h1',
    name: 'Home & Garden Center',
    category: 'Home',
    rating: 4.4,
    reviews: 145,
    coords: [60.1725, 24.9355] as [number, number],
    featured: true,
    menu: [
      {
        id: 'indoor-plant',
        name: 'Monstera Deliciosa Plant',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        description: 'Large indoor plant perfect for home decoration.',
        rating: 4.5,
        reviews: 34,
        category: 'Plants',
        deliveryFee: 7.99,
        deliveryTime: '2-3 days',
        badges: ['Indoor']
      },
      {
        id: 'candles',
        name: 'Scented Candle Set',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
        description: 'Set of 3 luxury scented candles.',
        rating: 4.3,
        reviews: 56,
        category: 'Home Decor',
        deliveryFee: 4.99,
        deliveryTime: '1-2 days',
        badges: ['Scented']
      }
    ]
  }
];

// Combine all shops
const allShops = [
  ...restaurants.map(shop => ({ ...shop, type: 'food' as const })),
  ...fashionShops.map(shop => ({ ...shop, type: 'fashion' as const })),
  ...techShops.map(shop => ({ ...shop, type: 'tech' as const })),
  ...beautyShops.map(shop => ({ ...shop, type: 'beauty' as const })),
  ...homeShops.map(shop => ({ ...shop, type: 'home' as const }))
];

export const MapDemo: React.FC = () => {
  const { isMobile, isTablet } = useScreenSize();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof shopCategories>('food');
  const [selectedShop, setSelectedShop] = useState<typeof allShops[0] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Fix Leaflet default icon issue - must be done before creating markers
    if (typeof window !== 'undefined' && L.Icon.Default) {
      // Remove the problematic _getIconUrl method
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      
      // Set default icon options
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }
  }, []);

  const markerIcon = useMemo(() => {
    if (!isMounted) return undefined;
    
    // Create custom SVG marker icon to avoid external image loading issues
    const svgIcon = `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="#3388ff" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 8.75 12.5 28.5 12.5 28.5S25 21.25 25 12.5C25 5.596 19.404 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      </svg>
    `;
    
    try {
      return L.divIcon({
        html: svgIcon,
        className: 'custom-marker-icon',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });
    } catch (error) {
      console.error('Error creating marker icon:', error);
      // Fallback to default icon
      return L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }
  }, [isMounted]);

  const handleShopClick = (shop: typeof allShops[0]) => {
    setSelectedShop(shop);
    setSelectedProduct(null);
    setIsTrayOpen(false);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsTrayOpen(true);
  };

  const closeTray = () => {
    setIsTrayOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // Filter shops by selected category
  const filteredShops = allShops.filter(shop => shop.type === selectedCategory);

  if (!isMounted) {
    return (
      <div className={`${isMobile ? 'h-64' : 'h-screen'} flex items-center justify-center bg-muted`}>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'h-auto' : 'h-screen'} ${isMobile ? 'flex flex-col' : 'grid grid-cols-1 md:grid-cols-[1fr_420px]'}`}>
      <div className={`${isMobile ? 'h-64' : 'h-full'} relative z-0`} style={{ minHeight: isMobile ? '256px' : '100%' }}>
        <MapContainer 
          center={defaultCenter} 
          zoom={isMobile ? 13 : 14} 
          className="h-full w-full z-0" 
          scrollWheelZoom={!isMobile}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredShops.map(shop => (
            markerIcon && (
              <Marker 
                key={shop.id} 
                position={shop.coords} 
                icon={markerIcon}
                eventHandlers={{ 
                  click: () => handleShopClick(shop)
                }}
              >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{shop.name}</div>
                  <div className="text-muted-foreground">{shop.cuisine || shop.category}</div>
                  <div className="text-xs text-muted-foreground">{shopCategories[shop.type].name}</div>
                </div>
              </Popup>
            </Marker>
            )
          ))}
        </MapContainer>
      </div>
      <div className={`bg-card ${isMobile ? 'border-t border-border' : 'border-l border-border'} overflow-y-auto ${isMobile ? 'max-h-96' : ''} relative`}>
        <div className={`${isMobile ? 'p-3' : 'p-4'} border-b`}>
          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Nearby Shops</h2>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Tap a marker to see products</p>
        </div>
        
        {/* Category Tabs */}
        <div className={`${isMobile ? 'p-3' : 'p-4'} border-b`}>
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as keyof typeof shopCategories)}>
            <TabsList className="grid w-full grid-cols-5">
              {Object.entries(shopCategories).map(([key, category]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  <span className="mr-1">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className={`${isMobile ? 'p-3' : 'p-4'} ${isMobile ? 'space-y-3' : 'space-y-4'}`}>
          {isTrayOpen && selectedProduct ? (
            // Product Detail View - replaces sidebar content
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product Details</h3>
                <Button variant="ghost" size="sm" onClick={closeTray}>
                  ✕
                </Button>
              </div>
              
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-48 object-cover rounded-lg"
              />
              
              <div className="space-y-2">
                <h4 className="text-xl font-bold">{selectedProduct.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-crave-orange">€{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">€{selectedProduct.originalPrice}</span>
                  )}
                </div>
                <p className="text-muted-foreground">{selectedProduct.description}</p>
                
                {selectedProduct.badges && selectedProduct.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.badges.map((badge: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>⭐ {selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                  <span>🚚 {selectedProduct.deliveryTime}</span>
                  <span>💰 €{selectedProduct.deliveryFee} delivery</span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" onClick={() => {
                    alert('Added to cart! (This is a demo)');
                    closeTray();
                  }}>
                    Add to Cart
                  </Button>
                  <Button variant="outline" onClick={closeTray}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedShop ? (
            // Shop Products View
            <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
              <div className={`flex items-start justify-between ${isMobile ? 'mb-1' : 'mb-1'}`}>
                <div>
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>{selectedShop.name}</h3>
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>{selectedShop.cuisine || selectedShop.category}</p>
                  <div className={`text-xs ${shopCategories[selectedShop.type].color} text-white px-2 py-1 rounded-full inline-block mt-1`}>
                    {shopCategories[selectedShop.type].name}
                  </div>
                </div>
                {selectedShop.featured && <Badge className={`bg-crave-orange text-white ${isMobile ? 'text-xs px-2 py-1' : ''}`}>Featured</Badge>}
              </div>
              {/* Product list */}
              {(() => {
                const menu = (selectedShop as any).menu as Array<any> | undefined;
                const fallback = (selectedShop as any).product ? [(selectedShop as any).product] : [];
                const items = (menu && menu.length ? menu : fallback);
                if (!items.length) {
                  return <p className="text-sm text-muted-foreground">Products not available.</p>;
                }
                return (
                  <div className={`grid ${isMobile ? 'gap-2' : 'gap-3'}`}>
                    {items.map((p) => (
                      <Card key={p.id} className={`${isMobile ? 'p-2' : 'p-3'} cursor-pointer hover:shadow transition-shadow`} onClick={() => handleProductClick(p)}>
                        <div className={`flex ${isMobile ? 'gap-2' : 'gap-3'}`}>
                          <img src={p.image} alt={p.name} className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-lg object-cover`} />
                          <div className="flex-1">
                            <div className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>{p.name}</div>
                            <div className={`text-crave-orange font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>€{p.price}</div>
                            <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground line-clamp-1`}>{p.description}</div>
                            {p.badges && p.badges.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.badges.map((badge: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                );
              })()}
            </div>
          ) : (
            // Shop List View
            filteredShops.map(shop => (
              <Card key={shop.id} className={`${isMobile ? 'p-2' : 'p-3'} cursor-pointer hover:shadow transition-shadow`} onClick={() => handleShopClick(shop)}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{shopCategories[shop.type].icon}</span>
                  <div className="flex-1">
                    <div className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>{shop.name}</div>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>{shop.cuisine || shop.category}</div>
                  </div>
                  <div className={`text-xs ${shopCategories[shop.type].color} text-white px-2 py-1 rounded-full`}>
                    {shopCategories[shop.type].name.split(' ')[0]}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

    </div>
  );
};