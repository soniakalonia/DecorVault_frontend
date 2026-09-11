'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';
import { useSubscribeMutation } from '@/store/api/subscriptionApi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [subscribe, { isLoading }] = useSubscribeMutation();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribe({ email }).unwrap();
      alert('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error: any) {
      alert(error?.data?.message || 'Subscription failed. Please try again.');
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-white border-t border-[#E8E4E0]">
      <div className="mx-auto w-full px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/assets/images/logo.png" alt="DecorVault" width={40} height={40} className="rounded-lg" />
              <span className="font-heading text-xl font-bold text-[#1A1A2E]">DecorVault</span>
            </div>
            <p className="text-sm text-[#7A7A7A] mb-4">
              Premium home decor, candles, clocks, photo frames, and curated gift items for every occasion.
            </p>
            <p className="text-sm font-medium text-[#D4AF37] mb-6">
              ✦ Curated with love for your home ✦
            </p>
            
            <div>
              <h4 className="font-semibold text-[#1A1A2E] mb-3">Stay Inspired</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 text-sm border border-[#E8E4E0] rounded-md bg-[#FAFAFA] text-[#1A1A2E] placeholder:text-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" 
                  required 
                />
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-4 py-2 bg-[#D4AF37] text-[#1A1A2E] text-sm font-medium rounded-md hover:scale-[0.97] hover:bg-[#C5A035] transition-smooth disabled:opacity-50"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              <p className="text-xs text-[#7A7A7A] mt-2">No spam, unsubscribe anytime</p>
            </div>
          </div>

          {/* Quick Links - Mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => toggleSection('quickLinks')}
              className="flex w-full items-center justify-between py-2 font-semibold text-[#1A1A2E]"
            >
              Quick Links
              <Icon name={openSection === 'quickLinks' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
            </button>
            {openSection === 'quickLinks' && (
              <ul className="mt-2 space-y-2 text-sm">
                <li><Link href="/" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Home</Link></li>
                <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Shop</Link></li>
                <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Categories</Link></li>
                <li><Link href="/about" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">About Us</Link></li>
                <li><Link href="/contact" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Contact Us</Link></li>
                <li><Link href="#" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Bulk Orders</Link></li>
              </ul>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => toggleSection('categories')}
              className="flex w-full items-center justify-between py-2 font-semibold text-[#1A1A2E]"
            >
              Categories
              <Icon name={openSection === 'categories' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
            </button>
            {openSection === 'categories' && (
              <ul className="mt-2 space-y-2 text-sm">
                <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Candles</Link></li>
                <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Clocks</Link></li>
                <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Photo Frames</Link></li>
                <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Gift Items</Link></li>
                <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Home Decor</Link></li>
              </ul>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => toggleSection('support')}
              className="flex w-full items-center justify-between py-2 font-semibold text-[#1A1A2E]"
            >
              Support
              <Icon name={openSection === 'support' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
            </button>
            {openSection === 'support' && (
              <ul className="mt-2 space-y-2 text-sm">
                <li><Link href="/faqs" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">FAQs</Link></li>
                <li><Link href="/shipping-delivery" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Shipping & Delivery</Link></li>
                <li><Link href="/return-policy" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Return Policy</Link></li>
                <li><Link href="/order-tracking" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Order Tracking</Link></li>
                <li><Link href="/privacy-policy" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Terms & Conditions</Link></li>
              </ul>
            )}
          </div>

          {/* Quick Links - Desktop */}
          <div className="hidden lg:block">
            <h4 className="font-semibold text-[#1A1A2E] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Home</Link></li>
              <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Shop</Link></li>
              <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Categories</Link></li>
              <li><Link href="/about" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">About Us</Link></li>
              <li><Link href="/contact" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Contact Us</Link></li>
              <li><Link href="#" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Bulk Orders</Link></li>
            </ul>
          </div>

          <div className="hidden lg:block">
            <h4 className="font-semibold text-[#1A1A2E] mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Candles</Link></li>
              <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Clocks</Link></li>
              <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Photo Frames</Link></li>
              <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Gift Items</Link></li>
              <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Home Decor</Link></li>
            </ul>
          </div>

          <div className="hidden lg:block">
            <h4 className="font-semibold text-[#1A1A2E] mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faqs" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">FAQs</Link></li>
              <li><Link href="/shipping-delivery" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Shipping & Delivery</Link></li>
              <li><Link href="/return-policy" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Return Policy</Link></li>
              <li><Link href="/order-tracking" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Order Tracking</Link></li>
              <li><Link href="/privacy-policy" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-[#1A1A2E] mb-4">Contact & Follow</h4>
            <div className="space-y-2 text-sm text-[#7A7A7A]">
              <p className="flex items-center gap-2"><Icon name="PhoneIcon" size={16} />+91 98765 43210</p>
              <p className="flex items-center gap-2"><Icon name="EnvelopeIcon" size={16} />contact@decorvault.online</p>
              <p className="flex items-center gap-2"><Icon name="ClockIcon" size={16} />Mon-Sat: 10 AM - 7 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E8E4E0] bg-[#FAFAFA]">
        <div className="mx-auto w-full px-4 py-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-[#7A7A7A]">© {new Date().getFullYear()} DecorVault. All Rights Reserved.</p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-[#7A7A7A]">We Accept:</span>
              <div className="flex items-center space-x-3">
                <Image src="/assets/payments/visa.png" alt="Visa" width={40} height={25} className="h-7 w-auto object-contain" />
                <Image src="/assets/payments/rupay.png" alt="RuPay" width={40} height={25} className="h-7 w-auto object-contain" />
                <Image src="/assets/payments/upi.png" alt="UPI" width={40} height={25} className="h-7 w-auto object-contain" />
                <Image src="/assets/payments/cod.png" alt="Cash on Delivery" width={40} height={25} className="h-7 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;