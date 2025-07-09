import React, { useState, useEffect } from 'react';
import { CraveTrayProduct } from './utils/product';

export interface CraveTrayProps {
  isOpen: boolean;
  onClose: () => void;
  product: CraveTrayProduct | null;
  appContext?: 'food' | 'fashion' | 'tech' | 'default';
  onCheckout?: (product: CraveTrayProduct, quantity: number) => void;
  apiEndpoint?: string;
}

export const CraveTray: React.FC<CraveTrayProps> = ({ 
  isOpen, 
  onClose, 
  product,
  appContext = 'default',
  onCheckout,
  apiEndpoint
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const contextColors = {
    food: '#FF6B35',
    fashion: '#8B5CF6', 
    tech: '#3B82F6',
    default: '#6366F1'
  };

  const contextAccents = {
    food: '#FF6B35',
    fashion: '#8B5CF6',
    tech: '#3B82F6', 
    default: '#6366F1'
  };

  const subtotal = product.price * quantity;
  const total = subtotal + product.deliveryFee;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      if (onCheckout) {
        await onCheckout(product, quantity);
      } else if (apiEndpoint) {
        // Call custom API endpoint
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product, quantity, total })
        });
        
        if (!response.ok) throw new Error('Checkout failed');
        
        const result = await response.json();
        if (result.url) {
          window.open(result.url, '_blank');
        }
      } else {
        // Default behavior - simulate checkout
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Successfully added ${quantity}x ${product.name} to cart! Total: $${total.toFixed(2)}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
      onClose();
    }
  };

  const trayStyles: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    pointerEvents: isOpen ? 'auto' : 'none'
  };

  const backdropStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  const containerStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '28rem',
    margin: '0 auto',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: '1.5rem',
    borderTopRightRadius: '1.5rem',
    boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.2)',
    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    color: 'white',
    maxHeight: '80vh',
    overflowY: 'auto'
  };

  return (
    <div style={trayStyles}>
      {/* Backdrop */}
      <div style={backdropStyles} onClick={onClose} />
      
      {/* Tray */}
      <div style={containerStyles}>
        <div style={{ padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {product.badges?.map((badge, index) => (
                <span key={index} style={{
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {badge}
                </span>
              ))}
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* Product Image */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '12rem',
                objectFit: 'cover',
                borderRadius: '1rem'
              }}
            />
            <button
              onClick={() => setIsLiked(!isLiked)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                borderRadius: '50%',
                width: '2.25rem',
                height: '2.25rem',
                color: isLiked ? '#EF4444' : 'white',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ♥
            </button>
          </div>

          {/* Product Info */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#FCD34D' }}>★</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{product.rating}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({product.reviews})</span>
              </div>
              <span style={{
                padding: '0.125rem 0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0.375rem',
                fontSize: '0.75rem'
              }}>
                {product.category}
              </span>
            </div>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{product.name}</h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.75rem' }}>{product.description}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span style={{ fontSize: '1.125rem', opacity: 0.6, textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            padding: '1rem',
            borderRadius: '0.75rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <span style={{ fontWeight: '500' }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  width: '2rem',
                  height: '2rem',
                  color: 'white',
                  cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                  opacity: quantity <= 1 ? 0.5 : 1
                }}
              >
                −
              </button>
              <span style={{ fontWeight: 'bold', fontSize: '1.125rem', width: '2rem', textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  width: '2rem',
                  height: '2rem',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Delivery Info */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🚚 Delivery
              </span>
              <span style={{ fontWeight: '500' }}>
                {product.deliveryFee === 0 ? 'FREE' : `$${product.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🕒 Est. time
              </span>
              <span style={{ fontWeight: '500' }}>{product.deliveryTime}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛡️ Secure checkout
              </span>
              <span style={{ fontWeight: '500', color: contextAccents[appContext] }}>Protected</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '0.75rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <span>Subtotal ({quantity}x)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <span>Delivery fee</span>
              <span>{product.deliveryFee === 0 ? 'FREE' : `$${product.deliveryFee.toFixed(2)}`}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem' }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            style={{
              width: '100%',
              height: '3rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '0.75rem',
              border: 'none',
              background: contextColors[appContext],
              color: 'white',
              cursor: isCheckingOut ? 'not-allowed' : 'pointer',
              opacity: isCheckingOut ? 0.7 : 1,
              transition: 'all 0.2s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!isCheckingOut) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isCheckingOut ? 'Processing...' : `Add to Cart • $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};