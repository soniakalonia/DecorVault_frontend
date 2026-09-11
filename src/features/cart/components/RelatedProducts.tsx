'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          You May Also Like
        </h2>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm font-medium text-primary transition-smooth hover:underline"
        >
          View All
          <Icon name="ArrowRightIcon" size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product-details?id=${product.id}`}
            className="group rounded-lg border border-border bg-card transition-smooth hover:shadow-elevation-2"
          >
            <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
              <AppImage
                src={product.image}
                alt={product.alt}
                className="h-full w-full object-cover transition-smooth group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="mb-2 line-clamp-2 text-sm font-medium text-card-foreground">
                {product.name}
              </h3>
              <div className="mb-2 flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="StarIcon"
                      size={14}
                      variant={i < Math.floor(product.rating) ? 'solid' : 'outline'}
                      className={
                        i < Math.floor(product.rating) ? 'text-accent' : 'text-muted-foreground'
                      }
                    />
                  ))}
                </div>
                <span className="caption text-muted-foreground">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="data-text font-semibold text-primary">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="data-text text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}



