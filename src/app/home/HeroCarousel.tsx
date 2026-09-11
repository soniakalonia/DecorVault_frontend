'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
}

interface HeroCarouselProps {
  slides?: Slide[];
  autoPlayInterval?: number;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: '/assets/images/hero/slide-1.jpg',
    title: 'Curate Your Space',
    subtitle: 'Discover timeless pieces that tell your story',
    ctaText: 'Explore Collection',
    ctaLink: '/products',
    badge: 'New Collection 2026'
  },
  {
    id: 2,
    image: '/assets/images/hero/slide-2.jpg',
    title: 'Elegant Candles',
    subtitle: 'Handcrafted with love for every moment',
    ctaText: 'Shop Candles',
    ctaLink: '/products/candles',
    badge: 'Best Sellers'
  },
  {
    id: 3,
    image: '/assets/images/hero/slide-3.jpg',
    title: 'Gift Hampers',
    subtitle: 'Perfect presents for every occasion',
    ctaText: 'Explore Gifts',
    ctaLink: '/products/gifts',
    badge: 'Special Offer'
  }
];

const HeroCarousel = ({ 
  slides = defaultSlides, 
  autoPlayInterval = 5000 
}: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#FAFAFA]">
      {/* Slides */}
      <div 
        className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full transition-all duration-500"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-2xl">
                  {/* Badge */}
                  {slide.badge && (
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                      <span className="text-white text-xs font-medium tracking-wider uppercase">
                        {slide.badge}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-white/80 text-sm md:text-base lg:text-lg max-w-lg mb-6">
                    {slide.subtitle}
                  </p>

                  {/* CTA */}
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3.5 bg-[#D4AF37] text-[#1A1A2E] font-semibold rounded-full hover:bg-[#C5A035] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base"
                  >
                    <span>{slide.ctaText}</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 h-2 bg-[#D4AF37] rounded-full'
                : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hidden md:block"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hidden md:block"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroCarousel;