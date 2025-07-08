import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Minus, Plus, Heart, Star, Truck, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  deliveryFee: number;
  deliveryTime: string;
  badges?: string[];
}

interface CraveTrayProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  appContext?: 'food' | 'fashion' | 'tech' | 'default';
}

export const CraveTray: React.FC<CraveTrayProps> = ({ 
  isOpen, 
  onClose, 
  product,
  appContext = 'default'
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const contextColors = {
    food: 'bg-crave-orange',
    fashion: 'bg-crave-purple', 
    tech: 'bg-crave-blue',
    default: 'bg-primary'
  };

  const contextAccents = {
    food: 'text-crave-orange',
    fashion: 'text-crave-purple',
    tech: 'text-crave-blue', 
    default: 'text-primary'
  };

  const subtotal = product.price * quantity;
  const total = subtotal + product.deliveryFee;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Successfully added ${quantity}x ${product.name} to cart! Total: $${total.toFixed(2)}`);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Tray */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-gradient-tray border-t border-border rounded-t-3xl shadow-tray transition-transform duration-400 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="max-w-md mx-auto p-6 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2">
              {product.badges?.map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Image */}
          <div className="relative mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-2xl"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
            </Button>
          </div>

          {/* Product Info */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
            
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4 p-4 rounded-xl bg-card border">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span>Delivery</span>
              </div>
              <span className="font-medium">
                {product.deliveryFee === 0 ? 'FREE' : `$${product.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Est. time</span>
              </div>
              <span className="font-medium">{product.deliveryTime}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Secure checkout</span>
              </div>
              <span className={cn("font-medium", contextAccents[appContext])}>Protected</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 mb-6 p-4 rounded-xl bg-card border">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({quantity}x)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery fee</span>
              <span>{product.deliveryFee === 0 ? 'FREE' : `$${product.deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={cn(
              "w-full h-12 text-base font-semibold rounded-xl transition-all duration-200",
              contextColors[appContext],
              "hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isCheckingOut ? 'Processing...' : `Add to Cart • $${total.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </>
  );
};