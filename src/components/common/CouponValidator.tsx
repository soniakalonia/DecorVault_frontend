'use client';

import { useState } from 'react';
import { Tag, X, Check, Loader2 } from 'lucide-react';
import { useValidateCouponMutation } from '@/store/api/couponApi';

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
  appliedCoupon,
}: CouponValidatorProps) {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');

  const [validateCoupon, { isLoading: loading }] = useValidateCouponMutation();

  const handleValidate = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter a coupon code');
      return;
    }

    setError('');

    try {
      const userId =
        typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      const res = await validateCoupon({
        code,
        cart_total: cartTotal,
        user_id: userId,
      }).unwrap();

      onCouponApplied(res.data);
      setCouponCode('');
    } catch (err: any) {
      setError(err?.data?.message || 'Invalid coupon code');
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
            aria-label="Remove coupon"
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
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
          />
        </div>
        <button
          onClick={handleValidate}
          disabled={loading || !couponCode.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Validating...' : 'Apply'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}