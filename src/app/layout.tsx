import React from 'react';
import type { Metadata, Viewport } from 'next';
import { ToastContainer } from 'react-toastify';
import { StoreProvider } from '@/lib/providers/StoreProvider';
import { BulkOrderProvider } from '@/components/ui/modal/BulkOrderContext';
import BulkOrderModal from '@/components/ui/modal/BulkOrderModal';
import DataSync from '@/components/common/DataSync';
import '../styles/index.css';
import '../styles/toastify.css';
import 'react-toastify/dist/ReactToastify.css';

import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/common/Header'), {
  ssr: true,
  loading: () => <div className="h-16 bg-white border-b" />,
});
const Footer = dynamic(() => import('@/components/common/Footer'), {
  ssr: true,
  loading: () => <div className="h-32 bg-gray-50" />,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'DecorVault - Premium Home Decor & Gifts',
  description: 'Discover premium home decor, candles, clocks, photo frames, gift items and more. Shop the finest collection for your home.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: 'light' }}>
      <body>
        <StoreProvider>
          <DataSync />
          <BulkOrderProvider>
            <Header />
            {children}
            <Footer />
            <BulkOrderModal />
            <ToastContainer position="top-right" autoClose={3000} />
          </BulkOrderProvider>
        </StoreProvider>
      </body>
    </html>
  );
}