import type { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import ShoppingCartInteractive from './components/ShoppingCartInteractive';

export const metadata: Metadata = {
  title: 'Shopping Cart - DecorVault',
  description: 'Review your selected home decor items, candles, clocks, photo frames, and gifts. Modify quantities, apply promo codes, and proceed to secure checkout with premium quality products.',
};

export default function ShoppingCartPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="w-full px-2 py-6 sm:px-4">
        <div data-aos="fade-down">
          <Breadcrumb />
        </div>
        <div data-aos="fade-up">
          <ShoppingCartInteractive />
        </div>
      </div>
    </main>
  );
}