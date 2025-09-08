import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CraveTray } from './CraveTray';
import { useScreenSize } from '@/hooks/useScreenSize';

const defaultCenter: [number, number] = [60.1699, 24.9384]; // Helsinki as example

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

export const MapDemo: React.FC = () => {
  const { isMobile, isTablet } = useScreenSize();
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof restaurants[0]['product'] | null>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  const markerIcon = useMemo(() =>
    L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }),
  []);

  const handleClick = (r: typeof restaurants[0]) => {
    setSelectedRestaurant(r);
    setSelectedProduct(null);
    setIsTrayOpen(false);
  };

  return (
    <div className={`${isMobile ? 'h-auto' : 'h-screen'} ${isMobile ? 'flex flex-col' : 'grid grid-cols-1 md:grid-cols-[1fr_420px]'}`}>
      <div className={`${isMobile ? 'h-64' : 'h-full'}`}>
        <MapContainer 
          center={defaultCenter} 
          zoom={isMobile ? 13 : 14} 
          className="h-full w-full" 
          scrollWheelZoom={!isMobile}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {restaurants.map(r => (
            <Marker key={r.id} position={r.coords} icon={markerIcon} eventHandlers={{ click: () => handleClick(r) }}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-muted-foreground">{r.cuisine}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className={`bg-card ${isMobile ? 'border-t border-border' : 'border-l border-border'} overflow-y-auto ${isMobile ? 'max-h-96' : ''}`}>
        <div className={`${isMobile ? 'p-3' : 'p-4'} border-b`}>
          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Nearby Restaurants</h2>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Tap a marker to see menu</p>
        </div>
        <div className={`${isMobile ? 'p-3' : 'p-4'} ${isMobile ? 'space-y-3' : 'space-y-4'}`}>
          {selectedRestaurant ? (
            <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
              <div className={`flex items-start justify-between ${isMobile ? 'mb-1' : 'mb-1'}`}>
                <div>
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>{selectedRestaurant.name}</h3>
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>{selectedRestaurant.cuisine}</p>
                </div>
                {selectedRestaurant.featured && <Badge className={`bg-crave-orange text-white ${isMobile ? 'text-xs px-2 py-1' : ''}`}>Featured</Badge>}
              </div>
              {/* Menu list */}
              {(() => {
                const menu = (selectedRestaurant as any).menu as Array<any> | undefined;
                const fallback = (selectedRestaurant as any).product ? [(selectedRestaurant as any).product] : [];
                const items = (menu && menu.length ? menu : fallback);
                if (!items.length) {
                  return <p className="text-sm text-muted-foreground">Menu not available.</p>;
                }
                return (
                  <div className={`grid ${isMobile ? 'gap-2' : 'gap-3'}`}>
                    {items.map((p) => (
                      <Card key={p.id} className={`${isMobile ? 'p-2' : 'p-3'} cursor-pointer hover:shadow`} onClick={() => { setSelectedProduct(p); setIsTrayOpen(true); }}>
                        <div className={`flex ${isMobile ? 'gap-2' : 'gap-3'}`}>
                          <img src={p.image} alt={p.name} className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-lg object-cover`} />
                          <div className="flex-1">
                            <div className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>{p.name}</div>
                            <div className={`text-crave-orange font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>€{p.price}</div>
                            <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground line-clamp-1`}>{p.description}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                );
              })()}
            </div>
          ) : (
            restaurants.map(r => (
              <Card key={r.id} className={`${isMobile ? 'p-2' : 'p-3'} cursor-pointer hover:shadow`} onClick={() => handleClick(r)}>
                <div className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>{r.name}</div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>{r.cuisine}</div>
              </Card>
            ))
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className={`${isMobile ? 'fixed inset-0 z-50 bg-black/50 flex items-end' : 'hidden md:block absolute right-4 bottom-4 w-[380px]'}`}>
          <div className={`${isMobile ? 'w-full max-h-[80vh] bg-card rounded-t-xl' : ''}`}>
            <CraveTray 
              isOpen={isTrayOpen} 
              onClose={() => setIsTrayOpen(false)} 
              product={selectedProduct} 
              appContext="food"
              inline={!isMobile}
            />
          </div>
        </div>
      )}
    </div>
  );
};