'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BulkOrderContextType {
  isOpen: boolean;
  productName: string;
  openModal: (productName: string) => void;
  closeModal: () => void;
}

const BulkOrderContext = createContext<BulkOrderContextType | undefined>(undefined);

export const BulkOrderProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductName] = useState('');

  const openModal = (name: string) => {
    setProductName(name);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setProductName('');
  };

  return (
    <BulkOrderContext.Provider value={{ isOpen, productName, openModal, closeModal }}>
      {children}
    </BulkOrderContext.Provider>
  );
};

export const useBulkOrder = () => {
  const context = useContext(BulkOrderContext);
  if (!context) {
    throw new Error('useBulkOrder must be used within BulkOrderProvider');
  }
  return context;
};