'use client';

import { useState } from 'react';
import { useSubscribeMutation } from '@/store/api/subscriptionApi';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribe, { isLoading }] = useSubscribeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribe({ email }).unwrap();
      alert('✅ Successfully subscribed!');
      setEmail('');
    } catch (error: any) {
      alert(error?.data?.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <section className="py-10 md:py-16 bg-[#1A1A2E]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">
            Sign Up & Get Upto ₹1,500 off on Your First Purchase!
          </h2>
          <p className="text-white/70 mt-2 text-sm md:text-base">
            Get exclusive access to new collections, early sales, and design inspiration
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-[#D4AF37] text-[#1A1A2E] font-semibold rounded-full hover:bg-[#C5A035] transition-all duration-300 disabled:opacity-50 text-sm"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          <p className="text-white/40 text-xs mt-3">No spam, unsubscribe anytime</p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;