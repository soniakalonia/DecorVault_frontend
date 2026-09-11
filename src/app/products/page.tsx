import type { Metadata } from 'next';
import { Suspense } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductCatalogInteractive from './components/ProductCatalogInteractive';

export const metadata: Metadata = {
  title: 'Product Catalog - DecorVault',
  description: 'Explore our premium collection of home decor, candles, clocks, photo frames, gift items, and more. Curated for your beautiful home.',
};

export default function ProductCatalogPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="mx-auto max-w-[1600px] px-4 py-2 sm:px-6">
        <Breadcrumb />
        
        <div className="mb-4" data-aos="fade-up">
          <h1 className="mb-2 font-heading text-3xl font-bold text-[#1A1A2E] sm:text-4xl">
            Product Catalog
          </h1>
          <p className="text-[#7A7A7A]">
            Discover our premium collection of home decor, candles, clocks, photo frames, and curated gift items
          </p>
        </div>

        <div data-aos="fade-up">
          <Suspense fallback={
            <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:grid-cols-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-lg bg-[#F0EDEA]" />
              ))}
            </div>
          }>
            <ProductCatalogInteractive />
          </Suspense>
        </div>
      </main>
    </div>
  );
}