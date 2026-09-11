'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useGetProductsQuery } from '@/store/api/productsApi';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  limit?: number;
  filter?: 'new' | 'bestseller' | 'trending';
}

const ProductSection = ({ 
  title, 
  subtitle, 
  viewAllLink = '/products',
  limit = 4,
  filter = 'new'
}: ProductSectionProps) => {
  const { data: productsData, isLoading } = useGetProductsQuery({});

  // Get products and apply filter
  let products = productsData?.data || [];
  
  // Apply filter
  if (filter === 'new') {
    products = products.filter((p: any) => p.is_new_arrival).slice(0, limit);
    if (products.length === 0) {
      // If no new arrivals, just take first 4
      products = productsData?.data?.slice(0, limit) || [];
    }
  } else if (filter === 'bestseller') {
    products = products.filter((p: any) => p.is_featured).slice(0, limit);
    if (products.length === 0) {
      products = productsData?.data?.slice(4, 4 + limit) || [];
    }
  } else {
    products = productsData?.data?.slice(0, limit) || [];
  }

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-[#FAFAFA]">
        <div className="container mx-auto px-4">
          <div className="text-center text-[#7A7A7A]">Loading products...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-[#FAFAFA]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-[#1A1A2E]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[#7A7A7A] text-sm mt-0.5">{subtitle}</p>
            )}
          </div>
          <Link
            href={viewAllLink}
            className="group flex items-center gap-1 text-sm font-medium text-[#D4AF37] hover:text-[#C5A035] transition-colors"
          >
            <span>View All</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product: any) => {
            let productImages: any[] = [];
            if (Array.isArray(product.product_images)) {
              productImages = product.product_images;
            } else if (typeof product.product_images === 'string') {
              try {
                productImages = JSON.parse(product.product_images || '[]');
              } catch (e) {
                productImages = [];
              }
            }

            const image = productImages.length > 0 
              ? productImages[0] 
              : '/placeholder.jpg';
            
            const price = Number(product.discount_price) || Number(product.price);
            const originalPrice = Number(product.price);
            const discount = originalPrice > price 
              ? Math.round(((originalPrice - price) / originalPrice) * 100) 
              : 0;

            return (
              <Link 
                key={product.id} 
                href={`/product/${product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-[#F0EDEA]">
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-[#D4AF37] text-[#1A1A2E] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {discount}% OFF
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs text-[#7A7A7A] truncate">{product.category}</p>
                  <h3 className="font-medium text-sm text-[#1A1A2E] truncate hover:text-[#D4AF37] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-sm text-[#1A1A2E]">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    {originalPrice > price && (
                      <span className="text-xs text-[#7A7A7A] line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;