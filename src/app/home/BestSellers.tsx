'use client';

import Link from 'next/link';
import Image from 'next/image';

interface BestSeller {
  id: number;
  title: string;
  options: string;
  price: string;
  image: string;
  link: string;
}

const bestSellers: BestSeller[] = [
  {
    id: 1,
    title: 'Table Vases',
    options: '600+ Options',
    price: 'Starting at Just Rs. 249',
    image: '/assets/images/bestsellers/bestseller-vases.jpg',
    link: '/products/vases',
  },
  {
    id: 2,
    title: 'Pots and Planters',
    options: '1000+ Options',
    price: 'Starting at Just Rs. 199',
    image: '/assets/images/bestsellers/bestseller-planters.jpg',
    link: '/products/planters',
  },
  {
    id: 3,
    title: 'Candles',
    options: '400+ Options',
    price: 'Starting at Just Rs. 119',
    image: '/assets/images/bestsellers/bestseller-candles.jpg',
    link: '/products/candles',
  },
  {
    id: 4,
    title: 'Wall Art and Paintings',
    options: '5000+ Options',
    price: 'Starting at Just Rs. 199',
    image: '/assets/images/bestsellers/bestseller-wall-art.jpg',
    link: '/products/wall-art',
  },
  {
    id: 5,
    title: 'Table Decor and Accents',
    options: '600+ Options',
    price: 'Starting at Just Rs. 299',
    image: '/assets/images/bestsellers/bestseller-table-decor.jpg',
    link: '/products/table-decor',
  },
  {
    id: 6,
    title: 'Wall Shelves',
    options: '600+ Options',
    price: 'Starting at Just Rs. 499',
    image: '/assets/images/bestsellers/bestseller-shelves.jpg',
    link: '/products/shelves',
  },
];

const BestSellers = () => {
  return (
    <section className="py-8 md:py-12 bg-[#FAFAFA]">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-6">
          Shop Best Sellers
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {bestSellers.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#F0EDEA] transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/images/placeholder-product.jpg';
                  }}
                />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-[#1A1A2E] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#7A7A7A]">{item.options}</p>
              <p className="text-xs text-[#D4AF37] font-medium mt-0.5">{item.price}</p>
            </Link>
          ))}
        </div>

        {/* Buy on Phone */}
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

export default BestSellers;