'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import FilterPanel, { FilterState } from './FilterPanel';

interface MobileFilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
}

const MobileFilterPanel = ({ onFilterChange, productCount }: MobileFilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filters: FilterState) => {
    onFilterChange(filters);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition-smooth hover:bg-muted lg:hidden"
      >
        <Icon name="FunnelIcon" size={18} />
        <span>Filters</span>
      </button>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[250] bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 top-0 z-[300] flex flex-col bg-card lg:hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-heading text-lg font-semibold text-card-foreground">
                Filters
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground transition-smooth hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <FilterPanel
                onFilterChange={handleFilterChange}
                productCount={productCount}
              />
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileFilterPanel;



