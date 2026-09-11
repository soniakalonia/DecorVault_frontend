'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import ProductCard from '@/components/ui/ProductCard';
import type { RootState } from '@/store/store';

export default function WishlistPage() {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-1">{wishlistItems.length} items</p>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="HeartIcon" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Add items you love to your wishlist</p>
            <Link href="/products" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {wishlistItems.map((item: any) => (
              <ProductCard
                key={item.id}
                id={item.productId}
                slug={item.productId}
                name={item.name}
                category=""
                price={item.price}
                image={item.image}
                alt={item.name}
                rating={4.5}
                showThumbnails={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
