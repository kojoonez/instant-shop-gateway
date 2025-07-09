import React, { useState, useEffect } from 'react';
import { CraveTray } from './CraveTray';
import { CraveTrayProduct } from './utils/product';

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
  /** Custom API endpoint for checkout */
  apiEndpoint?: string;
  /** Custom styling overrides */
  customStyles?: React.CSSProperties;
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
  showTrigger = true,
  apiEndpoint,
  customStyles
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
    food: 'background: linear-gradient(135deg, #FF6B35, #F7931E); color: white;',
    fashion: 'background: linear-gradient(135deg, #8B5CF6, #A855F7); color: white;', 
    tech: 'background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white;',
    default: 'background: linear-gradient(135deg, #6366F1, #4F46E5); color: white;'
  };

  const defaultTriggerStyles: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '16px',
    ...customStyles
  };

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
              style={{
                ...defaultTriggerStyles,
                ...Object.fromEntries([contextStyles[appContext].split('; ').map(s => s.split(': '))])
              }}
              className={triggerClassName}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
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
        onCheckout={onCheckout}
        apiEndpoint={apiEndpoint}
      />
    </>
  );
};