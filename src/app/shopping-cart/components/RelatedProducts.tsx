'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  packingStandard?: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-[#E8E4E0] pt-8">
      <h2 className="font-heading text-2xl font-bold text-[#1A1A2E] mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-[#F0EDEA]">
              {/* ✅ Image with fallback */}
              <img
                src={product.image}
                alt={product.alt}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Show fallback with product name
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'flex items-center justify-center w-full h-full bg-[#F0EDEA] text-[#7A7A7A] text-sm font-medium text-center p-2';
                    fallback.textContent = product.name;
                    parent.appendChild(fallback);
                  }
                }}
              />
              {product.discount > 0 && (
                <span className="absolute top-2 left-2 bg-[#D4AF37] text-[#1A1A2E] text-xs font-semibold px-2 py-0.5 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            <div className="mt-2">
              <p className="text-xs text-[#7A7A7A] truncate">{product.category}</p>
              <h3 className="font-medium text-sm text-[#1A1A2E] truncate group-hover:text-[#D4AF37] transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-sm text-[#1A1A2E]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-[#7A7A7A] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="StarIcon"
                      size={12}
                      variant={i < Math.floor(product.rating) ? 'solid' : 'outline'}
                      className={i < Math.floor(product.rating) ? 'text-[#D4AF37]' : 'text-[#E8E4E0]'}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#7A7A7A]">({product.rating})</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;