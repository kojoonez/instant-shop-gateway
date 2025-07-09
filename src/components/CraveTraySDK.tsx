import React, { useState, useEffect } from 'react';
import { CraveTray } from './CraveTray';

export interface CraveTrayProduct {
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

export interface CraveTraySDKProps {
  /** Whether the tray is open */
  isOpen?: boolean;
  /** Callback when tray is closed */
  onClose?: () => void;
  /** Product data to display */
  product?: CraveTrayProduct | null;
  /** App context for styling */
  appContext?: 'food' | 'fashion' | 'tech' | 'default';
  /** Auto-trigger delay in milliseconds */
  autoTriggerDelay?: number;
  /** Whether to auto-trigger when product is set */
  autoTrigger?: boolean;
  /** Custom trigger element */
  trigger?: React.ReactNode;
  /** Trigger button text */
  triggerText?: string;
  /** Additional CSS classes for trigger */
  triggerClassName?: string;
  /** Callback when checkout is completed */
  onCheckout?: (product: CraveTrayProduct, quantity: number) => void;
  /** Whether to show trigger button */
  showTrigger?: boolean;
}

/**
 * CraveTraySDK - Universal embeddable commerce component
 * 
 * Usage examples:
 * 
 * // Basic usage with trigger button
 * <CraveTraySDK 
 *   product={productData} 
 *   appContext="food"
 *   triggerText="Order Now"
 * />
 * 
 * // Auto-trigger on product change
 * <CraveTraySDK 
 *   product={productData}
 *   autoTrigger={true}
 *   autoTriggerDelay={1500}
 * />
 * 
 * // Controlled state
 * <CraveTraySDK 
 *   isOpen={isTrayOpen}
 *   onClose={() => setIsTrayOpen(false)}
 *   product={productData}
 *   showTrigger={false}
 * />
 */
export const CraveTraySDK: React.FC<CraveTraySDKProps> = ({
  isOpen: controlledIsOpen,
  onClose,
  product,
  appContext = 'default',
  autoTriggerDelay = 1500,
  autoTrigger = false,
  trigger,
  triggerText = 'Order Now',
  triggerClassName = '',
  onCheckout,
  showTrigger = true
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const openTray = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
  };
  
  const closeTray = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    onClose?.();
  };

  // Auto-trigger functionality
  useEffect(() => {
    if (autoTrigger && product && !isOpen) {
      const timer = setTimeout(() => {
        openTray();
      }, autoTriggerDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoTrigger, product, autoTriggerDelay, isOpen]);

  // Default context colors for trigger button
  const contextStyles = {
    food: 'bg-crave-orange hover:bg-crave-orange/90 text-white',
    fashion: 'bg-crave-purple hover:bg-crave-purple/90 text-white', 
    tech: 'bg-crave-blue hover:bg-crave-blue/90 text-white',
    default: 'bg-primary hover:bg-primary/90 text-primary-foreground'
  };

  const defaultTriggerClasses = `
    px-4 py-2 rounded-lg font-semibold transition-all duration-200 
    hover:scale-105 active:scale-95 ${contextStyles[appContext]} ${triggerClassName}
  `.trim();

  if (!product) {
    return null;
  }

  return (
    <>
      {/* Trigger Button */}
      {showTrigger && (
        <div className="cravetray-trigger">
          {trigger ? (
            <div onClick={openTray} style={{ cursor: 'pointer' }}>
              {trigger}
            </div>
          ) : (
            <button 
              onClick={openTray}
              className={defaultTriggerClasses}
            >
              {triggerText}
            </button>
          )}
        </div>
      )}

      {/* CraveTray */}
      <CraveTray
        isOpen={isOpen}
        onClose={closeTray}
        product={product}
        appContext={appContext}
      />
    </>
  );
};

// Export for external usage
export { CraveTray };

// Hook for managing CraveTray state
export const useCraveTray = (initialProduct?: CraveTrayProduct | null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<CraveTrayProduct | null>(initialProduct || null);

  const openTray = (newProduct?: CraveTrayProduct) => {
    if (newProduct) {
      setProduct(newProduct);
    }
    setIsOpen(true);
  };

  const closeTray = () => {
    setIsOpen(false);
  };

  const updateProduct = (newProduct: CraveTrayProduct | null) => {
    setProduct(newProduct);
  };

  return {
    isOpen,
    product,
    openTray,
    closeTray,
    updateProduct,
    setProduct
  };
};

// Utility function to create product data
export const createProduct = (data: Partial<CraveTrayProduct> & Pick<CraveTrayProduct, 'id' | 'name' | 'price' | 'image'>): CraveTrayProduct => {
  return {
    description: '',
    rating: 4.5,
    reviews: 0,
    category: 'Product',
    deliveryFee: 0,
    deliveryTime: '2-3 days',
    badges: [],
    ...data
  };
};