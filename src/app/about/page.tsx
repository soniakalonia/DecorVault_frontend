import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: 'About Us - DecorVault | Premium Home Decor & Gifts',
  description:
    'Discover DecorVault — your destination for premium home decor, candles, clocks, photo frames, gift items, and curated home accessories. Quality products for beautiful living spaces.',
};

const stats = [
  { label: 'Years in Business', value: '8+' },
  { label: 'Products in Range', value: '500+' },
  { label: 'Happy Customers', value: '25,000+' },
  { label: 'Cities Delivered', value: '75+' },
];

const values = [
  {
    icon: 'SparklesIcon',
    title: 'Curated Quality',
    desc: 'Every product in our collection is handpicked for quality, design, and craftsmanship. We believe your home deserves the best.',
  },
  {
    icon: 'HeartIcon',
    title: 'Made with Love',
    desc: 'From candles to photo frames, each piece is created with care and attention to detail. We pour our heart into everything we make.',
  },
  {
    icon: 'ShieldCheckIcon',
    title: 'Trusted & Reliable',
    desc: 'Thousands of customers trust DecorVault for their home decor needs. We stand behind every product we sell.',
  },
  {
    icon: 'GiftIcon',
    title: 'Perfect for Gifting',
    desc: 'Our curated collections make gifting easy and memorable. Find the perfect present for every occasion.',
  },
];

const timeline = [
  {
    year: '2018',
    title: 'The Beginning',
    desc: 'DecorVault was founded with a simple vision — to make beautiful home decor accessible to everyone. Started with a small collection of candles and photo frames.',
  },
  {
    year: '2020',
    title: 'Expanded Collections',
    desc: 'Grew our product range to include clocks, vases, wall decor, and gift items. Became a one-stop destination for home decor lovers.',
  },
  {
    year: '2022',
    title: 'Pan-India Reach',
    desc: 'Partnered with trusted logistics partners to deliver across 75+ cities. Thousands of homes now enjoy our curated collections.',
  },
  {
    year: '2024',
    title: 'Premium Collections',
    desc: 'Launched luxury collections including premium candles, designer photo frames, and exclusive gift hampers. Elevated the home decor experience.',
  },
];

const categories = [
  { name: 'Candles', icon: 'FireIcon' },
  { name: 'Clocks', icon: 'ClockIcon' },
  { name: 'Photo Frames', icon: 'PhotoIcon' },
  { name: 'Vases', icon: 'BeakerIcon' },
  { name: 'Wall Decor', icon: 'HomeIcon' },
  { name: 'Gift Items', icon: 'GiftIcon' },
  { name: 'Mirrors', icon: 'ViewfinderCircleIcon' },
  { name: 'Indoor Plants', icon: 'SparklesIcon' },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAFA]">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1A1A2E]/5 via-[#D4AF37]/10 to-[#FAFAFA] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          {/* ✅ Logo - Updated with actual image */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md overflow-hidden bg-white p-1">
              <Image
                src="/assets/images/logo.png"
                alt="DecorVault"
                width={56}
                height={56}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-heading text-3xl font-bold text-[#1A1A2E]">
              Decor<span className="text-[#D4AF37]">Vault</span>
            </span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-[#1A1A2E] sm:text-5xl">
            Our Story
          </h1>
          <p className="mt-5 text-lg text-[#7A7A7A] leading-relaxed max-w-2xl mx-auto">
            From a small passion project to thousands of beautiful homes across India — 
            DecorVault is your destination for premium home decor, candles, clocks, 
            photo frames, and curated gift items.
          </p>
          <p className="mt-3 text-base font-semibold text-[#D4AF37]">
            ✦ Curated with love for your home ✦
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-[#E8E4E0] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-heading text-4xl font-bold text-[#D4AF37]">{s.value}</p>
                <p className="mt-1 text-sm text-[#7A7A7A]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who We Are */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#1A1A2E] sm:text-3xl">
              Who We Are
            </h2>
            <p className="mt-4 text-[#7A7A7A] leading-relaxed">
              DecorVault is a premium home decor brand dedicated to curating the finest 
              collection of decorative items for your home. From elegant candles and 
              stylish clocks to beautiful photo frames and thoughtful gift items — 
              we bring you quality products that make your space truly special.
            </p>
            <p className="mt-4 text-[#7A7A7A] leading-relaxed">
              We believe that every home tells a story. Our carefully curated collections 
              help you tell yours — with pieces that reflect your personality, style, 
              and the love you pour into your living space.
            </p>
            <p className="mt-4 text-[#7A7A7A] leading-relaxed">
              Whether you're looking to refresh your decor, find the perfect gift, or 
              discover something unique for your home — DecorVault is here to inspire you.
            </p>
          </div>

          {/* Company Details Panel */}
          <div className="rounded-xl border border-[#E8E4E0] bg-white p-6 space-y-4 shadow-sm">
            <h3 className="font-heading text-lg font-semibold text-[#1A1A2E]">About DecorVault</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#7A7A7A]">Founded</p>
                <p className="font-semibold text-[#1A1A2E]">2018</p>
              </div>
              <div>
                <p className="text-[#7A7A7A]">Type</p>
                <p className="font-semibold text-[#1A1A2E]">Premium Home Decor</p>
              </div>
              <div>
                <p className="text-[#7A7A7A]">Industry</p>
                <p className="font-semibold text-[#1A1A2E]">Home Decor & Gifting</p>
              </div>
              <div>
                <p className="text-[#7A7A7A]">Products</p>
                <p className="font-semibold text-[#1A1A2E]">500+ Curated Items</p>
              </div>
              <div>
                <p className="text-[#7A7A7A]">Location</p>
                <p className="font-semibold text-[#1A1A2E]">Ghaziabad, UP – 201206</p>
              </div>
              <div>
                <p className="text-[#7A7A7A]">Delivery</p>
                <p className="font-semibold text-[#1A1A2E]">Pan-India</p>
              </div>
              <div>
                <p className="text-[#7A7A7A]">Speciality</p>
                <p className="font-semibold text-[#1A1A2E]">Candles, Clocks, Frames</p>
              </div>
              <div>
                <p className="text-[#7A7A7A]">Orders</p>
                <p className="font-semibold text-[#1A1A2E]">Retail & Bulk</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E8E4E0] flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-smooth hover:scale-[0.97] hover:bg-[#C5A035]"
              >
                <Icon name="PhoneIcon" size={15} />
                Get in Touch
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md border border-[#E8E4E0] bg-white px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-smooth hover:bg-[#F5F0EB]"
              >
                <Icon name="ShoppingBagIcon" size={15} />
                View Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-[#F5F0EB] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-[#1A1A2E] sm:text-3xl">
              What We Stand For
            </h2>
            <p className="mt-2 text-[#7A7A7A]">The values that guide everything we do.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-[#E8E4E0] bg-white p-6 shadow-sm transition-smooth hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10">
                  <Icon name={v.icon as any} size={24} className="text-[#D4AF37]" />
                </div>
                <h3 className="font-semibold text-[#1A1A2E]">{v.title}</h3>
                <p className="mt-2 text-sm text-[#7A7A7A] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey / Timeline */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-bold text-[#1A1A2E] sm:text-3xl">Our Journey</h2>
          <p className="mt-2 text-[#7A7A7A]">Growing with you, one beautiful piece at a time.</p>
        </div>
        <div className="relative space-y-8 before:absolute before:left-5 before:top-2 before:h-full before:w-0.5 before:bg-[#E8E4E0] sm:before:left-[calc(50%-1px)]">
          {timeline.map((item, i) => (
            <div
              key={item.year}
              className={`relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
            >
              {/* Content */}
              <div className={`flex-1 pl-14 sm:pl-0 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                <div className="rounded-lg border border-[#E8E4E0] bg-white p-4 shadow-sm">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wide">{item.year}</span>
                  <h3 className="mt-1 font-semibold text-[#1A1A2E]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#7A7A7A]">{item.desc}</p>
                </div>
              </div>
              {/* Dot */}
              <div className="absolute left-3.5 top-4 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] ring-4 ring-[#FAFAFA] sm:left-[calc(50%-8px)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Product Range */}
      <div className="bg-[#F5F0EB] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-[#1A1A2E] sm:text-3xl">
              What We Offer
            </h2>
            <p className="mt-2 text-[#7A7A7A]">
              500+ curated products across 8 categories — all carefully selected for your home.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products`}
                className="flex items-center gap-3 rounded-lg border border-[#E8E4E0] bg-white px-4 py-3 text-sm font-medium text-[#1A1A2E] shadow-sm transition-smooth hover:bg-[#D4AF37] hover:text-[#1A1A2E] hover:border-[#D4AF37] hover:shadow-md"
              >
                <Icon name={cat.icon as any} size={18} className="flex-shrink-0" />
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md bg-[#D4AF37] px-6 py-3 font-medium text-[#1A1A2E] transition-smooth hover:scale-[0.97] hover:bg-[#C5A035]"
            >
              <Icon name="ShoppingBagIcon" size={18} />
              Browse Full Catalogue
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#1A1A2E] py-12 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Find Your Perfect Decor
          </h2>
          <p className="mt-3 text-white/70 leading-relaxed">
            Looking for something special? Browse our curated collection of premium home decor, 
            candles, clocks, photo frames, and gift items.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="rounded-md bg-[#D4AF37] px-6 py-2.5 text-sm font-semibold text-[#1A1A2E] transition-smooth hover:scale-[0.97] hover:bg-[#C5A035]"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition-smooth hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}