import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CraveTray } from './CraveTray';
import { MapPin, Star, Clock, Navigation, Phone, Globe, ChevronRight } from 'lucide-react';

const restaurants = [
  {
    id: '1',
    name: "Marco's Trattoria",
    cuisine: 'Italian',
    rating: 4.8,
    reviews: 342,
    distance: '0.3 mi',
    estimatedTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    position: { x: 45, y: 35 },
    featured: true,
    product: {
      id: 'truffle-pasta',
      name: 'Truffle Mushroom Pasta',
      price: 28.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      description: 'House-made fettuccine with truffle oil, wild mushrooms, and fresh herbs. A signature dish from our chef.',
      rating: 4.9,
      reviews: 156,
      category: 'Italian Cuisine',
      deliveryFee: 2.99,
      deliveryTime: '25-35 min',
      badges: ['Chef Special', 'Popular']
    }
  },
  {
    id: '2',
    name: 'Sakura Sushi',
    cuisine: 'Japanese',
    rating: 4.7,
    reviews: 189,
    distance: '0.5 mi',
    estimatedTime: '30-40 min',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    position: { x: 65, y: 55 }
  },
  {
    id: '3',
    name: 'The Burger Joint',
    cuisine: 'American',
    rating: 4.6,
    reviews: 423,
    distance: '0.7 mi',
    estimatedTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    position: { x: 30, y: 70 }
  },
  {
    id: '4',
    name: 'Green Garden Café',
    cuisine: 'Healthy',
    rating: 4.5,
    reviews: 267,
    distance: '0.4 mi',
    estimatedTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    position: { x: 75, y: 25 }
  }
];

export const MapDemo: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  const handleRestaurantClick = (restaurant: typeof restaurants[0]) => {
    setSelectedRestaurant(restaurant);
    
    // Auto-trigger CraveTray for featured restaurants with products
    if (restaurant.featured && restaurant.product) {
      setTimeout(() => {
        setIsTrayOpen(true);
      }, 1000);
    }
  };

  const closeTray = () => {
    setIsTrayOpen(false);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Map Background */}
        <div 
          className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #f0f9ff 25%, transparent 25%),
              linear-gradient(-45deg, #f0f9ff 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f0f9ff 75%),
              linear-gradient(-45deg, transparent 75%, #f0f9ff 75%)
            `,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px'
          }}
        >
          {/* Street Lines */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-300"></div>
            <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-300"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-300"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-gray-300"></div>
          </div>

          {/* User Location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse"></div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600">
              You
            </div>
          </div>

          {/* Restaurant Pins */}
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ 
                left: `${restaurant.position.x}%`, 
                top: `${restaurant.position.y}%` 
              }}
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <div className={`relative group hover:scale-110 transition-transform ${
                selectedRestaurant?.id === restaurant.id ? 'scale-110' : ''
              }`}>
                <MapPin className={`h-8 w-8 ${
                  restaurant.featured ? 'text-crave-orange' : 'text-red-500'
                } drop-shadow-lg`} />
                {restaurant.featured && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-crave-orange rounded-full animate-pulse">
                    <div className="absolute inset-0 w-3 h-3 bg-crave-orange rounded-full animate-ping"></div>
                  </div>
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {restaurant.name}
                    {restaurant.featured && (
                      <Badge className="ml-1 bg-crave-orange text-white text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button variant="outline" size="icon" className="bg-white shadow-lg">
            <Navigation className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white shadow-lg">
            +
          </Button>
          <Button variant="outline" size="icon" className="bg-white shadow-lg">
            -
          </Button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Your location</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-red-500" />
              <span>Restaurants</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-crave-orange" />
              <span>Featured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Details Panel */}
      <div className="w-96 bg-white border-l border-border overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Nearby Restaurants</h2>
          <p className="text-sm text-muted-foreground">
            Tap a pin on the map to see details
          </p>
        </div>

        {selectedRestaurant ? (
          <div className="p-4 space-y-4">
            {/* Restaurant Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold">{selectedRestaurant.name}</h3>
                  <p className="text-muted-foreground">{selectedRestaurant.cuisine}</p>
                </div>
                {selectedRestaurant.featured && (
                  <Badge className="bg-crave-orange text-white">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{selectedRestaurant.rating}</span>
                  <span>({selectedRestaurant.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedRestaurant.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedRestaurant.estimatedTime}</span>
                </div>
              </div>
            </div>

            {/* Restaurant Image */}
            <img 
              src={selectedRestaurant.image}
              alt={selectedRestaurant.name}
              className="w-full h-48 object-cover rounded-lg"
            />

            {/* Featured Product */}
            {selectedRestaurant.featured && selectedRestaurant.product && (
              <Card className="p-4 border-crave-orange/20 bg-gradient-to-r from-crave-orange/5 to-crave-purple/5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-crave-orange text-white">
                    Chef's Special
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Auto-suggested for you
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <img 
                    src={selectedRestaurant.product.image}
                    alt={selectedRestaurant.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{selectedRestaurant.product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-crave-orange">
                        ${selectedRestaurant.product.price}
                      </span>
                      {selectedRestaurant.product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${selectedRestaurant.product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setIsTrayOpen(true)}
                  className="w-full mt-3 bg-crave-orange hover:bg-crave-orange/90 text-white"
                >
                  Order Now
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call Restaurant
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                View Menu
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {restaurants.map((restaurant) => (
              <Card 
                key={restaurant.id}
                className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <div className="flex gap-3">
                  <img 
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{restaurant.name}</h4>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                      {restaurant.featured && (
                        <Badge className="bg-crave-orange text-white text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.rating}</span>
                      </div>
                      <span>{restaurant.distance}</span>
                      <span>{restaurant.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CraveTray */}
      {selectedRestaurant?.product && (
        <CraveTray
          isOpen={isTrayOpen}
          onClose={closeTray}
          product={selectedRestaurant.product}
          appContext="food"
        />
      )}
    </div>
  );
};