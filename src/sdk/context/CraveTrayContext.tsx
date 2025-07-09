import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CraveTrayProduct } from '../utils/product';

interface CraveTrayContextValue {
  isOpen: boolean;
  product: CraveTrayProduct | null;
  openTray: (product?: CraveTrayProduct) => void;
  closeTray: () => void;
  updateProduct: (product: CraveTrayProduct | null) => void;
}

const CraveTrayContext = createContext<CraveTrayContextValue | undefined>(undefined);

interface CraveTrayProviderProps {
  children: ReactNode;
  initialProduct?: CraveTrayProduct | null;
}

export const CraveTrayProvider: React.FC<CraveTrayProviderProps> = ({ 
  children, 
  initialProduct = null 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<CraveTrayProduct | null>(initialProduct);

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

  const value: CraveTrayContextValue = {
    isOpen,
    product,
    openTray,
    closeTray,
    updateProduct
  };

  return (
    <CraveTrayContext.Provider value={value}>
      {children}
    </CraveTrayContext.Provider>
  );
};

export const useCraveTrayContext = (): CraveTrayContextValue => {
  const context = useContext(CraveTrayContext);
  if (!context) {
    throw new Error('useCraveTrayContext must be used within a CraveTrayProvider');
  }
  return context;
};