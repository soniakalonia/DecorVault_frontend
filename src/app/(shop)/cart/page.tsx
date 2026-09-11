import type { Metadata } from 'next';
import Breadcrumb from '@/components/common/Breadcrumb';
import ShoppingCartInteractive from '@/features/cart/components/ShoppingCartInteractive';

export const metadata: Metadata = {
  title: 'Shopping Cart - DecorVault',
  description: 'Review your selected home decor items, candles, clocks, photo frames, and gifts. Modify quantities, apply promo codes, and proceed to secure checkout with premium quality products.',
};

export default function ShoppingCartPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
        <Breadcrumb />
        <ShoppingCartInteractive />
      </div>
    </main>
  );
}