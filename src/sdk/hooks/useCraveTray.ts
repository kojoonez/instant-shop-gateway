import { useState } from 'react';
import { CraveTrayProduct } from '../utils/product';

export interface UseCraveTrayReturn {
  isOpen: boolean;
  product: CraveTrayProduct | null;
  openTray: (newProduct?: CraveTrayProduct) => void;
  closeTray: () => void;
  updateProduct: (newProduct: CraveTrayProduct | null) => void;
  setProduct: (product: CraveTrayProduct | null) => void;
}

// Hook for managing CraveTray state
export const useCraveTray = (initialProduct?: CraveTrayProduct | null): UseCraveTrayReturn => {
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