'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface RecentProduct {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
}

interface EmptyCartProps {
  recentProducts: RecentProduct[];
}

export default function EmptyCart({ recentProducts }: EmptyCartProps) {
  const categories = [
    { name: 'Flower Pots', icon: 'HomeIcon', path: '/products?category=flower-pots' },
    { name: 'Mugs', icon: 'CupIcon', path: '/products?category=mugs' },
    { name: 'Containers', icon: 'ArchiveBoxIcon', path: '/products?category=containers' },
    { name: 'Buckets', icon: 'BeakerIcon', path: '/products?category=buckets' },
    { name: 'Dustbins', icon: 'TrashIcon', path: '/products?category=dustbins' },
  ];

  return (
    <div className="mx-auto max-w-4xl py-12 text-center">
      {/* Empty State Icon */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-muted p-8">
          <Icon name="ShoppingCartIcon" size={64} className="text-muted-foreground" />
        </div>
      </div>

      <h2 className="font-heading mb-3 text-3xl font-semibold text-foreground">
        Your Cart is Empty
      </h2>
      <p className="mb-8 text-muted-foreground">
        Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
      </p>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
      >
        <Icon name="ShoppingBagIcon" size={20} />
        Start Shopping
      </Link>

      {/* Category Suggestions */}
      <div className="mt-12">
        <h3 className="font-heading mb-6 text-xl font-semibold text-foreground">
          Browse by Category
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.path}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 transition-smooth hover:shadow-elevation-2"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <Icon name={category.icon as any} size={32} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-card-foreground">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="font-heading mb-6 text-xl font-semibold text-foreground">
            Recently Viewed Products
          </h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {recentProducts.map((product) => (
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
                  <h4 className="mb-2 line-clamp-2 text-sm font-medium text-card-foreground">
                    {product.name}
                  </h4>
                  <p className="data-text font-semibold text-primary">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



