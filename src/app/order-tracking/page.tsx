import { Suspense } from 'react';
import type { Metadata } from 'next';
import OrderTrackingInteractive from './components/OrderTrackingInteractive';

export const metadata: Metadata = {
  title: 'Order Tracking - DecorVault',
  description: 'Track your DecorVault orders in real-time. Enter your order ID to check delivery status.',
};

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B8A] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tracking details...</p>
            </div>
          </div>
        }>
          <OrderTrackingInteractive />
        </Suspense>
      </div>
    </div>
  );
}