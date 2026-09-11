'use client';

import { useState, useEffect } from 'react';
import FilterPanel, { FilterState } from './FilterPanel';
import SortControls, { SortOption } from './SortControls';
import ProductGrid from './ProductGrid';
import MobileFilterPanel from './MobileFilterPanel';
import { Product } from './ProductCard';

const ProductCatalogInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    capacityRange: [0, 10000],
    priceRange: [0, 5000],
  });
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Updated mock products - Home Decor Theme
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Aromatherapy Lavender Candle',
      category: 'Candles',
      price: 399,
      originalPrice: 499,
      image: '/assets/images/products/candles/candle-1.jpg',
      alt: 'Lavender scented candle in glass jar with wooden lid',
      sizes: ['150ml', '250ml'],
      colors: ['Lavender Purple'],
      capacity: '150ml',
      inStock: true,
      rating: 4.8,
      reviewCount: 128,
      isNew: true,
      isBestseller: true,
    },
    {
      id: '2',
      name: 'Modern Round Wall Mirror',
      category: 'Mirrors',
      price: 1999,
      originalPrice: 2499,
      image: '/assets/images/products/mirrors/mirror-1.jpg',
      alt: 'Elegant round wall mirror with gold metal frame',
      sizes: ['60cm'],
      colors: ['Gold'],
      capacity: '60cm',
      inStock: true,
      rating: 4.7,
      reviewCount: 89,
      isBestseller: true,
    },
    {
      id: '3',
      name: 'Modern Wall Clock - Gold Finish',
      category: 'Clocks',
      price: 999,
      originalPrice: 1299,
      image: '/assets/images/products/clocks/clock-1.jpg',
      alt: 'Sleek modern wall clock with metal frame',
      sizes: ['30cm'],
      colors: ['Gold'],
      capacity: '30cm',
      inStock: true,
      rating: 4.6,
      reviewCount: 256,
      isNew: true,
    },
    {
      id: '4',
      name: 'Snake Plant - Sansevieria',
      category: 'Indoor Plants',
      price: 449,
      originalPrice: 599,
      image: '/assets/images/products/plants/plant-1.jpg',
      alt: 'Beautiful snake plant in ceramic pot',
      sizes: ['Medium'],
      colors: ['Green'],
      capacity: '20cm pot',
      inStock: true,
      rating: 4.5,
      reviewCount: 167,
    },
    {
      id: '5',
      name: 'Modern Gold Photo Frame',
      category: 'Photo Frames',
      price: 699,
      originalPrice: 899,
      image: '/assets/images/products/frames/frame-1.jpg',
      alt: 'Elegant gold photo frame with modern design',
      sizes: ['8x10 inches'],
      colors: ['Gold'],
      capacity: '8x10 inches',
      inStock: true,
      rating: 4.6,
      reviewCount: 203,
      isBestseller: true,
    },
    {
      id: '6',
      name: 'Premium Gift Hamper',
      category: 'Gift Items',
      price: 1999,
      originalPrice: 2499,
      image: '/assets/images/products/gifts/gift-1.jpg',
      alt: 'Premium gift hamper with luxury items',
      sizes: ['Large'],
      colors: ['Gold'],
      capacity: 'Set of 6 items',
      inStock: true,
      rating: 4.9,
      reviewCount: 94,
      isNew: true,
    },
    {
      id: '7',
      name: 'Modern Ceramic Vase',
      category: 'Vases',
      price: 999,
      originalPrice: 1299,
      image: '/assets/images/products/vases/vase-1.jpg',
      alt: 'Elegant modern ceramic vase with matte finish',
      sizes: ['25cm', '35cm'],
      colors: ['White'],
      capacity: '25cm',
      inStock: true,
      rating: 4.4,
      reviewCount: 312,
      isBestseller: true,
    },
    {
      id: '8',
      name: 'Abstract Wall Art Set of 3',
      category: 'Wall Decor',
      price: 2999,
      originalPrice: 3999,
      image: '/assets/images/products/walldecor/walldecor-1.jpg',
      alt: 'Stunning abstract wall art set with bold colors',
      sizes: ['40x60cm'],
      colors: ['Multicolor'],
      capacity: '40x60cm',
      inStock: true,
      rating: 4.5,
      reviewCount: 178,
    },
    {
      id: '9',
      name: 'Vanilla Bean Scented Candle',
      category: 'Candles',
      price: 499,
      originalPrice: 599,
      image: '/assets/images/products/candles/candle-2.jpg',
      alt: 'Warm vanilla bean scented candle with wooden wick',
      sizes: ['150ml', '300ml'],
      colors: ['Vanilla Cream'],
      capacity: '150ml',
      inStock: true,
      rating: 4.3,
      reviewCount: 67,
    },
    {
      id: '10',
      name: 'Floating Wall Shelf Set of 2',
      category: 'Wall Shelves',
      price: 1999,
      originalPrice: 2499,
      image: '/assets/images/products/shelves/shelf-1.jpg',
      alt: 'Elegant floating wall shelf set with clean design',
      sizes: ['60cm'],
      colors: ['White'],
      capacity: '60cm',
      inStock: true,
      rating: 4.7,
      reviewCount: 421,
      isNew: true,
    },
    {
      id: '11',
      name: 'Peace Lily Plant',
      category: 'Indoor Plants',
      price: 599,
      originalPrice: 749,
      image: '/assets/images/products/plants/plant-4.jpg',
      alt: 'Beautiful peace lily with white flowers in ceramic pot',
      sizes: ['Medium'],
      colors: ['White'],
      capacity: '18cm pot',
      inStock: true,
      rating: 4.8,
      reviewCount: 112,
    },
    {
      id: '12',
      name: 'Luxury Perfume Gift Set',
      category: 'Fragrances',
      price: 1999,
      originalPrice: 2499,
      image: '/assets/images/products/fragrances/fragrance-1.jpg',
      alt: 'Premium perfume gift set with 3 luxury fragrances',
      sizes: ['Set of 3'],
      colors: ['Gold'],
      capacity: '50ml each',
      inStock: true,
      rating: 4.7,
      reviewCount: 234,
      isBestseller: true,
    },
  ];

  useEffect(() => {
    if (!isHydrated) return;

    let result = [...mockProducts];

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
  }, [filters, sortBy, isHydrated]);

  const handleAddToCart = (productId: string, size: string, color: string) => {
    if (!isHydrated) return;
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <div className="mb-6 h-10 w-48 animate-pulse rounded bg-[#F0EDEA]" />
        <div className="flex gap-8">
          <div className="hidden w-64 flex-shrink-0 space-y-6 lg:block">
            <div className="h-96 animate-pulse rounded-lg bg-[#F0EDEA]" />
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-32 animate-pulse rounded bg-[#F0EDEA]" />
              <div className="h-10 w-48 animate-pulse rounded bg-[#F0EDEA]" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-lg bg-[#F0EDEA]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="flex gap-8">
        {/* Desktop Filter Panel */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterPanel
              onFilterChange={setFilters}
              productCount={filteredProducts.length}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <MobileFilterPanel
              onFilterChange={setFilters}
              productCount={filteredProducts.length}
            />
            <div className="hidden lg:block">
              <p className="text-sm text-[#7A7A7A]">
                Showing {filteredProducts.length} of {mockProducts.length} products
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