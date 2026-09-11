'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SortControlsProps {
  onSortChange: (sortBy: string) => void;
}

export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'popularity' | 'newest';

const SortControls = ({ onSortChange }: SortControlsProps) => {
  const [selectedSort, setSelectedSort] = useState<SortOption>('relevance');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'relevance', label: 'Relevance', icon: 'SparklesIcon' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUpIcon' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDownIcon' },
    { value: 'popularity', label: 'Popularity', icon: 'FireIcon' },
    { value: 'newest', label: 'Newest Arrivals', icon: 'ClockIcon' },
  ];

  const handleSortChange = (sortValue: SortOption) => {
    setSelectedSort(sortValue);
    onSortChange(sortValue);
    setIsDropdownOpen(false);
  };

  const currentSortLabel = sortOptions.find((opt) => opt.value === selectedSort)?.label || 'Sort By';

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition-smooth hover:bg-muted"
      >
        <Icon name="AdjustmentsHorizontalIcon" size={18} />
        <span className="hidden sm:inline">Sort:</span>
        <span className="font-medium">{currentSortLabel}</span>
        <Icon 
          name={isDropdownOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
          size={16} 
        />
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-[150]"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 top-full z-[200] mt-2 w-56 rounded-md bg-popover shadow-elevation-3">
            <div className="p-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm transition-smooth ${
                    selectedSort === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-popover-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={option.icon as any} size={18} />
                  <span>{option.label}</span>
                  {selectedSort === option.value && (
                    <Icon name="CheckIcon" size={16} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SortControls;



