import type { Metadata } from 'next';
import { Suspense } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductDetailsInteractive from './components/ProductDetailsInteractive';

export const metadata: Metadata = {
  title: 'Premium Home Decor - Candles, Clocks, Photo Frames & Gifts | DecorVault',
  description: 'Explore premium home decor products including scented candles, elegant clocks, beautiful photo frames, and curated gift items. Quality products with detailed specifications, pricing, and bulk ordering options.',
};

export default function ProductDetailsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Breadcrumb />
          </div>
          <Suspense fallback={
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent mx-auto mb-4"></div>
                <p className="text-[#7A7A7A]">Loading product details...</p>
              </div>
            </div>
          }>
            <ProductDetailsInteractive />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#E8E4E0] bg-white">
        <div className="mx-auto max-w-full px-4 py-8 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 font-heading text-lg font-bold text-[#1A1A2E]">
                About DecorVault
              </h3>
              <p className="text-sm leading-relaxed text-[#7A7A7A]">
                Your premium destination for curated home decor, scented candles, elegant clocks, beautiful photo frames, and thoughtful gift items. Quality products for every beautiful home.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-heading text-lg font-bold text-[#1A1A2E]">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-[#7A7A7A]">
                <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Bulk Orders</li>
                <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Track Order</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-heading text-lg font-bold text-[#1A1A2E]">
                Customer Service
              </h3>
              <ul className="space-y-2 text-sm text-[#7A7A7A]">
                <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Shipping Policy</li>
                <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Return Policy</li>
                <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">Warranty Info</li>
                <li className="hover:text-[#D4AF37] cursor-pointer transition-colors">FAQs</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-heading text-lg font-bold text-[#1A1A2E]">
                Contact Us
              </h3>
              <ul className="space-y-2 text-sm text-[#7A7A7A]">
                <li>Email: contact@decorvault.online</li>
                <li>Phone: +91 98765 43210</li>
                <li>Hours: Mon-Sat, 10AM-7PM</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-[#E8E4E0] pt-6 text-center">
            <p className="caption text-[#7A7A7A]">
              &copy; {new Date().getFullYear()} DecorVault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}