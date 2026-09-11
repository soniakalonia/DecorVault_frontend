'use client';

import Image from 'next/image';
import Link from 'next/link';

const HeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Leaf Pattern Overlay - SVG Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="leafPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path 
              d="M10 0 C10 5 5 10 0 10 C5 10 10 15 10 20 C10 15 15 10 20 10 C15 10 10 5 10 0Z" 
              fill="#D4AF37" 
              opacity="0.3"
            />
          </pattern>
          <rect width="100" height="100" fill="url(#leafPattern)" />
        </svg>
      </div>

      {/* Decorative Gold Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F7C948] to-[#D4AF37]"></div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            {/* Badge */}
            <div className="inline-block bg-[#D4AF37] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              MONSOON MADNESS SALE
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A2E] leading-tight">
              Home Decor
            </h1>

            {/* Offer */}
            <div className="mt-3">
              <p className="text-2xl md:text-3xl font-bold text-[#D4AF37]">
                Upto 70% Off + 20% Cashback
              </p>
              <p className="text-[#7A7A7A] text-sm mt-1">*T&C Apply</p>
            </div>

            {/* Extra Offer */}
            <div className="mt-4 inline-block bg-[#F5F0EB] border border-[#D4AF37]/30 rounded-lg px-4 py-2">
              <p className="text-[#1A1A2E] font-semibold text-sm">
                EXTRA 15% OFF* <span className="text-[#7A7A7A] font-normal">On All Home Decor</span>
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#C5A035] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Shop Now →</span>
              </Link>
            </div>

            {/* Sign Up Offer */}
            <p className="text-[#7A7A7A] text-xs mt-4">
              Sign Up & Get Upto ₹1,500 off on Your First Purchase!
            </p>
          </div>

          {/* Right Side - Two Images Side by Side */}
          <div className="flex-1 max-w-2xl">
            <div className="flex flex-row items-center gap-4 md:gap-6 justify-center">
              {/* Image 1 - Flower */}
              <div className="relative w-1/2 aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <Image
                  src="/assets/images/hero/flower-gold.jpg"
                  alt="Golden Flower"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Image 2 - Mirror */}
              <div className="relative w-1/2 aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <Image
                  src="/assets/images/hero/mirror-ornate.jpg"
                  alt="Ornate Mirror"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;