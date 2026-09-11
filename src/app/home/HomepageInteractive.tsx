'use client';

import HeroBanner from './HeroBanner';
import CategoryGrid from './CategoryGrid';
import DealsOfTheDay from './DealsOfTheDay';
import BestSellers from './BestSellers';
import NewsletterSignup from './NewsletterSignup';

const HomepageInteractive = () => {
  return (
    <main>
      {/* 1. Hero Banner */}
      <HeroBanner />
      
      {/* 2. Shop By Categories - With Images */}
      <CategoryGrid />
      
      {/* 3. Deals of the Day */}
      <DealsOfTheDay />
      
      {/* 4. Shop Best Sellers - With Images */}
      <BestSellers />
      
      {/* 5. Newsletter Signup */}
      <NewsletterSignup />
    </main>
  );
};

export default HomepageInteractive;