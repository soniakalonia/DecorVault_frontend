'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import Icon from '@/components/ui/AppIcon';
import { Product } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string, size: string, color: string) => void;
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 30;

  useEffect(() => {
    setDisplayedProducts(products.slice(0, itemsPerPage));
    setHasMore(products.length > itemsPerPage);
  }, [products]);

  const loadMore = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const nextProducts = products.slice(currentLength, currentLength + itemsPerPage);
      setDisplayedProducts([...displayedProducts, ...nextProducts]);
      setHasMore(currentLength + itemsPerPage < products.length);
      setIsLoading(false);
    }, 800);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Icon name="MagnifyingGlassIcon" size={64} className="mb-4 text-muted-foreground" />
        <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
          No Products Found
        </h3>
        <p className="text-center text-muted-foreground">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:grid-cols-5">
        {displayedProducts.map((product, index) => {
          const discount = Math.floor(Math.random() * 30) + 10;
          return (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              category={product.category}
              price={product.price}
              image={product.image}
              alt={product.alt}
              rating={product.rating}
              discount={discount}
              showThumbnails={false}
              animationDelay={index * 50}
            />
          );
        })}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:grid-cols-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="aspect-square animate-pulse bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-6 w-28 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="flex items-center space-x-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
          >
            <span>Load More Products</span>
            <Icon name="ArrowDownIcon" size={18} />
          </button>
        </div>
      )}

      {!hasMore && displayedProducts.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          You've reached the end of the catalog
        </p>
      )}
    </div>
  );
};

export default ProductGrid;



