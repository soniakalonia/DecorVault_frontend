import type { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import CheckoutInteractive from './components/CheckoutInteractive';

export const metadata: Metadata = {
  title: 'Checkout - DecorVault',
  description: 'Complete your purchase securely with Razorpay. Review your order, select payment method, and place your order.',
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
        <CheckoutInteractive />
      </div>
    </main>
  );
}