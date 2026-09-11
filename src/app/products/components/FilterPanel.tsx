'use client';

import { useState, useEffect } from 'react';
import { config } from '@/config/env';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
  initialFilters?: FilterState;
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  capacityRange: [number, number];
  priceRange: [number, number];
}

const FilterPanel = ({ onFilterChange, productCount, initialFilters }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    categories: [],
    sizes: [],
    colors: [],
    capacityRange: [0, 10000],
    priceRange: [0, 5000],
  });

  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string; image: string }>>([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string; slug: string; image: string }>>([]);
  const [loading, setLoading] = useState(true);

  const initialCategoriesKey = initialFilters?.categories.join(',') || '';

  useEffect(() => {
    if (initialFilters && initialFilters.categories.length > 0) {
      setFilters(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategoriesKey]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch(`${config.apiUrl}/categories`),
          fetch(`${config.apiUrl}/brands`)
        ]);
        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();
        
        const activeCategories = (categoriesData.categories || []).filter((c: any) => c.status === 'active');
        const activeBrands = (brandsData.brands || []).filter((b: any) => b.status === 'active');
        
        setCategories(activeCategories);
        setBrands(activeBrands);
      } catch (error) {
        console.error('Error fetching filters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const updateCapacityRange = (min: number, max: number) => {
    const newFilters = { ...filters, capacityRange: [min, max] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const updatePriceRange = (min: number, max: number) => {
    const newFilters = { ...filters, priceRange: [min, max] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters: FilterState = {
      categories: [],
      sizes: [],
      colors: [],
      capacityRange: [0, 10000],
      priceRange: [0, 5000],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.capacityRange[0] > 0 ||
    filters.capacityRange[1] < 10000 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Filters
          </h2>
          <p className="caption text-muted-foreground">
            {productCount} products found
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="caption text-primary transition-smooth hover:text-primary/80"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Categories</h3>
        {loading ? (
          <div className="space-y-2">
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-3 hover:opacity-80"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.slug)}
                  onChange={() => toggleCategory(category.slug)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={category.image} alt={category.name} className="h-8 w-8 rounded object-cover" />
                <span className="text-sm text-foreground">{category.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No categories available</p>
        )}
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Brands</h3>
        {loading ? (
          <div className="space-y-2">
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
          </div>
        ) : brands.length > 0 ? (
          <div className="space-y-2">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-3 hover:opacity-80"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(brand.slug)}
                  onChange={() => toggleCategory(brand.slug)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.image} alt={brand.name} className="h-8 w-8 rounded object-cover" />
                <span className="text-sm text-foreground">{brand.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No brands available</p>
        )}
      </div>

      {/* Capacity Range */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          Capacity (ml)
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={filters.capacityRange[0]}
              onChange={(e) => updateCapacityRange(Number(e.target.value), filters.capacityRange[1])}
              className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              placeholder="Min"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              value={filters.capacityRange[1]}
              onChange={(e) => updateCapacityRange(filters.capacityRange[0], Number(e.target.value))}
              className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          Price (₹)
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => updatePriceRange(Number(e.target.value), filters.priceRange[1])}
              className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              placeholder="Min"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => updatePriceRange(filters.priceRange[0], Number(e.target.value))}
              className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;



