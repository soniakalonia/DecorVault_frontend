'use client';

import Image from 'next/image';
import Link from 'next/link';

const HeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white min-h-[420px] md:min-h-[480px] lg:min-h-[520px]">
      {/* Background Image - Full Section */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/hero/background.png"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Soft white gradient overlay on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-transparent md:from-white/80 md:via-white/40 md:to-transparent" />
      </div>

      {/* Decorative Gold Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F7C948] to-[#D4AF37] z-20"></div>

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
                Upto 50% Off
              </p>
              <p className="text-[#7A7A7A] text-sm mt-1">*T&C Apply</p>
            </div>

            {/* Extra Offer */}
            <div className="mt-4 inline-block bg-[#F5F0EB] border border-[#D4AF37]/30 rounded-lg px-4 py-2">
              <p className="text-[#1A1A2E] font-semibold text-sm">
                EXTRA 5% OFF* <span className="text-[#7A7A7A] font-normal">On All Home Decor</span>
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
              Sign Up & Get Your First Purchase!
            </p>
          </div>

          {/* Right Side - Single Lamp Image aligned to platform */}
          <div className="flex-1 max-w-2xl relative flex items-end justify-center">
            <div className="relative w-full aspect-[3/2] translate-y-12 md:translate-y-20 lg:translate-y-6">
              <Image
                src="/assets/images/hero/lamp.png"
                alt="Featured Lamp"
                fill
                className="object-contain object-bottom"
                priority
                quality={90}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

