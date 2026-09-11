'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
}

const SearchBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Updated search suggestions - Home Decor Theme
  const suggestions: SearchSuggestion[] = [
    { id: '1', text: 'Candles', category: 'Home Decor' },
    { id: '2', text: 'Wall Clocks', category: 'Clocks' },
    { id: '3', text: 'Photo Frames', category: 'Frames' },
    { id: '4', text: 'Vases', category: 'Table Decor' },
    { id: '5', text: 'Wall Art', category: 'Wall Decor' },
    { id: '6', text: 'Gift Hampers', category: 'Gift Items' },
    { id: '7', text: 'Indoor Plants', category: 'Plants' },
    { id: '8', text: 'Mirrors', category: 'Mirrors' },
    { id: '9', text: 'Scented Candles', category: 'Candles' },
    { id: '10', text: 'Wall Shelves', category: 'Storage' },
  ];

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setIsSearchExpanded(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setSearchQuery(suggestionText);
    router.push(`/products?search=${encodeURIComponent(suggestionText)}`);
    setShowSuggestions(false);
    setIsSearchExpanded(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleInputFocus = () => {
    setIsSearchExpanded(true);
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      if (!searchQuery) {
        setIsSearchExpanded(false);
      }
    }, 200);
  };

  return (
    <div className="relative flex-1 max-w-xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Search for home decor..."
            className={`h-10 w-full rounded-md border border-[#E8E4E0] bg-[#FAFAFA] pl-10 pr-4 text-sm text-[#1A1A2E] placeholder:text-[#7A7A7A] transition-smooth focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 ${
              isSearchExpanded ? 'md:w-full' : 'md:w-64'
            }`}
          />
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] transition-smooth hover:text-[#1A1A2E]"
            >
              <Icon name="XMarkIcon" size={16} />
            </button>
          )}
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-[200] mt-2 rounded-md bg-white shadow-elevation-3 border border-[#E8E4E0]">
            <div className="p-2">
              <p className="caption px-3 py-2 text-[#7A7A7A]">
                Suggestions
              </p>
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-[#1A1A2E] transition-smooth hover:bg-[#FAFAFA]"
                >
                  <span className="flex items-center space-x-2">
                    <Icon name="MagnifyingGlassIcon" size={16} className="text-[#7A7A7A]" />
                    <span>{suggestion.text}</span>
                  </span>
                  {suggestion.category && (
                    <span className="caption text-[#7A7A7A]">
                      {suggestion.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;