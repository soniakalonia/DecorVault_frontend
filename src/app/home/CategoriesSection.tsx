'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { config } from '@/config/env';

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  status: 'active' | 'inactive';
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiUrl}/categories`);
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories.filter((cat: Category) => cat.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            Shop by Category
          </h2>
          <p className="text-[#7A7A7A] mt-2 text-sm md:text-base">
            Find the perfect decor for every space
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-[#F0EDEA] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="aspect-square relative">
                {category.image && category.image.trim() ? (
                  <Image
                    src={category.image.startsWith('http') ? category.image : `${config.apiUrl.replace('/api', '')}${category.image}`}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F0EDEA] flex items-center justify-center">
                    <span className="text-[#7A7A7A] text-sm">{category.name}</span>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium text-sm md:text-base">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[#D4AF37] font-medium hover:text-[#C5A035] transition-colors"
          >
            <span>View All Categories</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}