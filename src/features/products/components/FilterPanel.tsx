'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  capacityRange: [number, number];
  priceRange: [number, number];
}

const FilterPanel = ({ onFilterChange, productCount }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    capacityRange: [0, 10000],
    priceRange: [0, 5000],
  });

  const categories = [
    { id: 'flower-pots', label: 'Flower Pots', icon: 'SparklesIcon' },
    { id: 'mugs', label: 'Mugs', icon: 'BeakerIcon' },
    { id: 'containers', label: 'Containers', icon: 'ArchiveBoxIcon' },
    { id: 'buckets', label: 'Buckets', icon: 'CubeIcon' },
    { id: 'dustbins', label: 'Dustbins', icon: 'TrashIcon' },
  ];

  const sizes = ['Small', 'Medium', 'Large'];
  
  const colors = [
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#1F2937' },
  ];

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    
    const newFilters = { ...filters, sizes: newSizes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleColor = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    
    const newFilters = { ...filters, colors: newColors };
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
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm transition-smooth ${
                filters.categories.includes(category.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={category.icon as any} size={16} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`rounded-md px-4 py-2 text-sm transition-smooth ${
                filters.sizes.includes(size)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-smooth ${
                filters.colors.includes(color.name)
                  ? 'border-primary scale-110' :'border-border hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Filter by ${color.name}`}
            >
              {filters.colors.includes(color.name) && (
                <Icon name="CheckIcon" size={20} className="text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
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



