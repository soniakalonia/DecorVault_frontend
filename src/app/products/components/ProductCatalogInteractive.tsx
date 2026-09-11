'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import FilterPanel, { FilterState } from './FilterPanel';
import SortControls, { SortOption } from './SortControls';
import ProductGrid from './ProductGrid';
import MobileFilterPanel from './MobileFilterPanel';
import { Product } from './ProductCard';
import { useGetProductsQuery } from '@/store/api/productsApi';

const ProductCatalogInteractive = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryFromUrl = params?.category as string | undefined;
  const searchQuery = searchParams?.get('search') || '';
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    capacityRange: [0, 10000],
    priceRange: [0, 5000],
  });

  useEffect(() => {
    if (categoryFromUrl) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryFromUrl]
      }));
    }
  }, [categoryFromUrl]);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { data: productsData, isLoading, error } = useGetProductsQuery({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Convert API data to match Product interface
  const apiProducts: Product[] = useMemo(() => {
    if (!productsData?.data) return [];
    return productsData.data.map((product: any, index: number) => ({
      id: product.id.toString(),
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: product.name,
      category: product.category,
      price: product.discount_price || product.price,
      originalPrice: product.price !== product.discount_price ? product.price : undefined,
      image: product.product_images?.[0] || '/assets/products/placeholder.jpg',
      alt: product.description,
      sizes: product.sizes || ['Standard'],
      colors: product.colors || ['Default'],
      capacity: '500ml',
      inStock: product.stock_quantity > 0,
      rating: 4.5,
      reviewCount: 50 + (index * 13) % 200,
      isNew: product.is_new_arrival || false,
      isBestseller: product.is_featured || false,
    }));
  }, [productsData]);

  useEffect(() => {
    if (!isHydrated || !apiProducts.length) return;

    let result = [...apiProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.some((cat) =>
          p.category.toLowerCase().includes(cat.replace('-', ' '))
        )
      );
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((size) => filters.sizes.includes(size))
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((color) => filters.colors.includes(color))
      );
    }

    result = result.filter((p) => {
      const capacity = parseInt(p.capacity);
      return capacity >= filters.capacityRange[0] && capacity <= filters.capacityRange[1];
    });

    result = result.filter((p) => {
      return p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
    });

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [filters, sortBy, isHydrated, apiProducts, searchQuery]);

  const handleAddToCart = (_productId: string, _size: string, _color: string) => {
    if (!isHydrated) return;
    // Add to cart logic here
  };

  if (!isHydrated || isLoading) {
    return (
      <div className="w-full px-1 py-8 sm:px-6">
        <div className="mb-6 h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="flex gap-1 sm:gap-8">
          <div className="hidden w-56 flex-shrink-0 space-y-6 lg:block">
            <div className="h-96 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-32 animate-pulse rounded bg-muted" />
              <div className="h-10 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:grid-cols-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-red-500">Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-0 py-4 sm:px-6">
      <div className="flex gap-6 sm:gap-8">
        {/* Desktop Filter Panel */}
        <aside className="hidden w-56 flex-shrink-0 border-r border-border pr-6 lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <FilterPanel
              onFilterChange={setFilters}
              productCount={filteredProducts.length}
              initialFilters={filters}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="mb-4 flex items-center justify-between gap-2 px-1 sm:mb-6 sm:gap-4 sm:px-0">
            <MobileFilterPanel
              onFilterChange={setFilters}
              productCount={filteredProducts.length}
              initialFilters={filters}
            />
            <div className="hidden lg:block">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {apiProducts.length} products
              </p>
            </div>
            <SortControls onSortChange={(sortBy: string) => setSortBy(sortBy as SortOption)} />
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogInteractive;



