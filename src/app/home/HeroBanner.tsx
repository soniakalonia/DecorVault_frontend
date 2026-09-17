'use client';

import Image from 'next/image';
import Link from 'next/link';

const HeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white min-h-[420px] md:min-h-[480px] lg:min-h-[520px]">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/hero/background.png"
          alt="Hero Background"
          fill
          className="object-cover object-right"
          priority
          quality={100}
        />
        {/* Stronger, wider dark gradient on the left side to create a clean reading area */}
        <div className="absolute inset-y-0 left-0 w-full md:w-4/5 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Decorative Gold Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F7C948] to-[#D4AF37] z-20"></div>

      {/* Main Content Container - Shifted further from left edge */}
      <div className="container mx-auto px-4 pl-10 md:pl-20 lg:pl-32 py-12 md:py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left max-w-2xl">
            
            {/* Badge - Bright Gold with white text */}
            <div className="inline-block bg-[#D4AF37] text-white text-xs font-bold tracking-wider px-4 py-1.5 rounded-full mb-4 shadow-lg">
              MONSOON MADNESS SALE
            </div>

            {/* Title - Pure White with heavy shadow */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
              Home Decor
            </h1>

            {/* Offer - Bright Glowing Gold with heavy shadow */}
            <div className="mt-3">
              <p className="text-3xl md:text-4xl font-bold text-[#FFC107] drop-shadow-2xl">
                Upto 50% Off
              </p>
              {/* Light Grey with shadow */}
              <p className="text-gray-200 text-sm mt-1 font-medium drop-shadow-md">*T&C Apply</p>
            </div>

            {/* Extra Offer - Darker background for maximum contrast */}
            <div className="mt-5 inline-block bg-black/60 backdrop-blur-md border border-white/30 rounded-lg px-5 py-2.5 shadow-xl">
              <p className="text-white font-semibold text-sm drop-shadow-md">
                EXTRA 5% OFF* <span className="text-gray-300 font-normal">On All Home Decor</span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] text-white font-bold rounded-full hover:bg-[#C5A035] transition-all duration-300 shadow-2xl hover:shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-105"
              >
                <span>Shop Now →</span>
              </Link>
            </div>

            {/* Sign Up Offer - Light Grey with shadow */}
            <p className="text-gray-300 text-xs mt-5 font-medium tracking-wide drop-shadow-md">
              Sign Up & Get Your First Purchase!
            </p>
          </div>

          {/* Right Side - Empty spacer */}
          <div className="hidden md:block flex-1 max-w-2xl"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;