'use client';

import { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';

interface CouponValidatorProps {
  cartTotal: number;
  onCouponApplied: (couponData: any) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: any;
}

export default function CouponValidator({ 
  cartTotal, 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon 
}: CouponValidatorProps) {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/public/coupon/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          cart_total: cartTotal,
          user_id: localStorage.getItem('userId') || null
        })
      });

      const data = await response.json();

      if (data.success) {
        onCouponApplied(data.data);
        setCouponCode('');
        setError('');
      } else {
        setError(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setError('Failed to validate coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    onCouponRemoved();
    setCouponCode('');
    setError('');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-sm text-green-600">
                You saved ₹{appliedCoupon.discount_amount}
              </p>
            </div>
          </div>
          <button
            onClick={removeCoupon}
            className="text-green-600 hover:text-green-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-espresso focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
          />
        </div>
        <button
          onClick={validateCoupon}
          disabled={loading || !couponCode.trim()}
          className="px-4 py-2 bg-espresso text-white rounded-lg hover:bg-espresso/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Validating...' : 'Apply'}
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}