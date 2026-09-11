'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Deal {
  id: number;
  title: string;
  discount: string;
  image: string;
  link: string;
}

const deals: Deal[] = [
  {
    id: 1,
    title: 'Artificial Plants & Flowers',
    discount: 'Upto 70% Off',
    image: '/assets/images/deals/deal-plants.jpg',
    link: '/products/plants',
  },
  {
    id: 2,
    title: 'Home Fragrances',
    discount: 'Upto 60% Off',
    image: '/assets/images/deals/deal-fragrances.jpg',
    link: '/products/fragrances',
  },
];

const DealsOfTheDay = () => {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-6">
          Deals of the day
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={deal.link}
              className="group relative overflow-hidden rounded-xl bg-[#F5F0EB] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center p-4 md:p-6 gap-4 md:gap-6">
                {/* Image */}
                <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 relative rounded-lg overflow-hidden bg-[#F0EDEA]">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/images/placeholder-deal.jpg';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm md:text-base font-bold text-[#D4AF37]">
                    {deal.discount}
                  </p>
                  <h3 className="font-medium text-[#1A1A2E] text-sm md:text-base mt-1">
                    {deal.title}
                  </h3>
                  <p className="text-[#D4AF37] text-sm font-medium mt-2 group-hover:translate-x-1 transition-transform">
                    Shop Now → →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsOfTheDay;