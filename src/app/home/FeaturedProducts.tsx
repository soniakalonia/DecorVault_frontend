'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useGetProductsQuery } from '@/store/api/productsApi';

interface FeaturedProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  alt: string;
  rating: number;
}

const FeaturedProducts = () => {
  const { data: productsData, isLoading } = useGetProductsQuery({});

  const featuredProducts: FeaturedProduct[] = productsData?.data?.slice(0, 12).map((product: any) => {
    let productImages: unknown[] = [];
    if (Array.isArray(product.product_images)) {
      productImages = product.product_images;
    } else if (typeof product.product_images === 'string') {
      try {
        const parsedImages = JSON.parse(product.product_images || '[]');
        productImages = Array.isArray(parsedImages) ? parsedImages : [];
      } catch (error) {
        productImages = [];
      }
    }

    return {
      id: product.id.toString(),
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: product.name,
      category: product.category,
      price: Number(product.discount_price) || Number(product.price),
      originalPrice: Number(product.price),
      image: (() => {
        const images = productImages;
        if (images.length > 0) {
          const img = images[0];
          if (typeof img === 'string') {
            if (img.startsWith('http')) return img;
            if (img.startsWith('/assets/')) return img;
            return img;
          }
        }
        return '/placeholder.jpg';
      })(),
      alt: product.description || product.name,
      rating: 4.5,
    };
  }) || [];

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-[#FAFAFA]">
        <div className="container mx-auto px-4">
          <div className="text-center text-[#7A7A7A]">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-[#FAFAFA]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A2E]">
              Editor's Picks
            </h2>
            <p className="text-[#7A7A7A] text-sm mt-1">
              Curated pieces to elevate your space
            </p>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-medium text-[#D4AF37] hover:text-[#C5A035] transition-colors"
          >
            <span>View All</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div key={product.id} className="group">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-[#F0EDEA]">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-[#D4AF37] text-[#1A1A2E] text-xs font-semibold px-2 py-1 rounded-full">
                        {discount}% OFF
                      </div>
                    )}
                  </div>
                </Link>
                <div className="mt-3">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-medium text-[#1A1A2E] text-sm hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#7A7A7A]">{product.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-[#1A1A2E]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#7A7A7A] line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;