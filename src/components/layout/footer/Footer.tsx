'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useSubscribeMutation } from '@/store/api/subscriptionApi';

const Footer = () => {
  const [email, setEmail] = useState('');
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

  return (
    <footer className="bg-white border-t border-[#E8E4E0]">
      {/* Main Footer Content */}
      <div className="mx-auto w-full px-4 py-12 sm:px-6" data-aos="fade-up">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
          
          {/* Brand Section */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <div className="flex items-center space-x-2 mb-4">
              {/* Gold Diamond Logo */}
              <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <span className="text-[#1A1A2E] font-heading text-sm font-bold">DV</span>
              </div>
              <span className="font-heading text-xl font-bold text-[#1A1A2E]">
                Decor<span className="text-[#D4AF37]">Vault</span>
              </span>
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
                  className="px-4 py-2 bg-[#D4AF37] text-[#1A1A2E] text-sm font-medium rounded-md hover:scale-[0.97] transition-smooth disabled:opacity-50"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              <p className="text-xs text-[#7A7A7A] mt-2">No spam, unsubscribe anytime</p>
            </div>
          </div>

          {/* Quick Links */}
          <div data-aos="fade-up">
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

          {/* Product Categories */}
          <div data-aos="fade-up">
            <h4 className="font-semibold text-[#1A1A2E] mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products/candles" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Candles</Link></li>
              <li><Link href="/products/clocks" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Clocks</Link></li>
              <li><Link href="/products/photo-frames" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Photo Frames</Link></li>
              <li><Link href="/products/gift-items" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Gift Items</Link></li>
              <li><Link href="/products" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Home Decor</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div data-aos="fade-up">
            <h4 className="font-semibold text-[#1A1A2E] mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">FAQs</Link></li>
              <li><Link href="#" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Shipping & Delivery</Link></li>
              <li><Link href="#" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Return Policy</Link></li>
              <li><Link href="/order-tracking" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Order Tracking</Link></li>
              <li><Link href="#" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[#7A7A7A] hover:text-[#D4AF37] transition-smooth">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div data-aos="fade-left">
            <h4 className="font-semibold text-[#1A1A2E] mb-4">Contact & Follow</h4>
            <div className="space-y-2 text-sm text-[#7A7A7A] mb-4">
              <p className="flex items-center gap-2"><Icon name="PhoneIcon" size={16} />+91 98765 43210</p>
              <p className="flex items-center gap-2"><Icon name="EnvelopeIcon" size={16} />contact@decorvault.online</p>
              <p className="flex items-center gap-2"><Icon name="ClockIcon" size={16} />Mon-Sat: 10 AM - 7 PM</p>
            </div>
            <div className="flex space-x-2">
              <a href="#" className="p-2 bg-[#FAFAFA] rounded-md hover:bg-[#D4AF37] hover:text-[#1A1A2E] transition-smooth"><Icon name="ShareIcon" size={16} /></a>
              <a href="#" className="p-2 bg-[#FAFAFA] rounded-md hover:bg-[#D4AF37] hover:text-[#1A1A2E] transition-smooth"><Icon name="CameraIcon" size={16} /></a>
              <a href="#" className="p-2 bg-[#FAFAFA] rounded-md hover:bg-[#D4AF37] hover:text-[#1A1A2E] transition-smooth"><Icon name="ChatBubbleLeftRightIcon" size={16} /></a>
              <a href="#" className="p-2 bg-[#FAFAFA] rounded-md hover:bg-[#D4AF37] hover:text-[#1A1A2E] transition-smooth"><Icon name="BuildingOfficeIcon" size={16} /></a>
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
              <div className="flex items-center space-x-2">
                <div className="px-2 py-1 bg-white border border-[#E8E4E0] rounded text-xs font-medium text-[#1A1A2E]">VISA</div>
                <div className="px-2 py-1 bg-white border border-[#E8E4E0] rounded text-xs font-medium text-[#1A1A2E]">MC</div>
                <div className="px-2 py-1 bg-white border border-[#E8E4E0] rounded text-xs font-medium text-[#1A1A2E]">UPI</div>
                <div className="px-2 py-1 bg-white border border-[#E8E4E0] rounded text-xs font-medium text-[#1A1A2E]">Paytm</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;