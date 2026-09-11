'use client';

import Link from 'next/link';

const CATEGORIES = [
  { id: 1, name: 'Candles', slug: 'candles', image: '/assets/images/categories/candles.jpg' },
  { id: 2, name: 'Clocks', slug: 'clocks', image: '/assets/images/categories/clocks.jpg' },
  { id: 3, name: 'Photo Frames', slug: 'photo-frames', image: '/assets/images/categories/photo-frames.jpg' },
  { id: 4, name: 'Vases', slug: 'vases', image: '/assets/images/categories/vases.jpg' },
  { id: 5, name: 'Wall Decor', slug: 'wall-decor', image: '/assets/images/categories/wall-decor.jpg' },
  { id: 6, name: 'Gift Items', slug: 'gift-items', image: '/assets/images/categories/gift-items.jpg' },
  { id: 7, name: 'Table Decor', slug: 'table-decor', image: '/assets/images/categories/table-decor.jpg' },
  { id: 8, name: 'Mirrors', slug: 'mirrors', image: '/assets/images/categories/mirrors.jpg' },
  { id: 9, name: 'Indoor Plants', slug: 'indoor-plants', image: '/assets/images/categories/indoor-plants.jpg' },
  { id: 10, name: 'Festival Decor', slug: 'festival-decor', image: '/assets/images/categories/festival-decor.jpg' },
];

const CategoryGrid = () => {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A2E]">
            Shop By Categories
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-[#D4AF37] hover:text-[#C5A035] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#F0EDEA] transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 relative">
                {/* ✅ Using img tag instead of Next.js Image for reliability */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails, show category name with background
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.backgroundColor = '#F0EDEA';
                      parent.style.display = 'flex';
                      parent.style.alignItems = 'center';
                      parent.style.justifyContent = 'center';
                      const text = document.createElement('span');
                      text.className = 'text-[#7A7A7A] font-medium text-sm';
                      text.textContent = category.name;
                      parent.appendChild(text);
                    }
                  }}
                />
              </div>
              <h3 className="mt-2 text-xs md:text-sm font-medium text-center text-[#1A1A2E] group-hover:text-[#D4AF37] transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>

        {/* Buy on Phone CTA */}
        <div className="mt-6 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] hover:text-[#C5A035] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Buy on Phone</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;