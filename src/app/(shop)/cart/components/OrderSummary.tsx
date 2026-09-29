'use client';

import { useState, useEffect } from 'react';
import { Tag, X, Check, Loader2 } from 'lucide-react';

export interface AppliedCoupon {
  coupon_id: number;
  code: string;
  type: string;
  discount_amount: number;
  coupon_details?: any;
}

export interface OrderSummaryData {
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  appliedCoupon?: AppliedCoupon | null;
}

interface OrderSummaryProps {
  summary: OrderSummaryData;
  itemCount: number;
  onApplyPromo: (code: string) => Promise<boolean>;
  onRemovePromo?: () => void;
  couponLoading?: boolean;
  onProceedToCheckout?: () => void;
}

export default function OrderSummary({
  summary,
  itemCount,
  onApplyPromo,
  onRemovePromo,
  couponLoading = false,
  onProceedToCheckout,
}: OrderSummaryProps) {
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (summary.appliedCoupon) {
      setCode('');
      setLocalError('');
    }
  }, [summary.appliedCoupon]);

  const handleApply = async () => {
    if (!code.trim()) {
      setLocalError('Please enter a coupon code');
      return;
    }
    setLocalError('');
    const ok = await onApplyPromo(code.trim());
    if (!ok) {
      setLocalError('Invalid coupon code');
    } else {
      setCode('');
    }
  };

  const handleRemove = () => {
    onRemovePromo?.();
    setCode('');
    setLocalError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  const fmt = (n: number) =>
    `₹${Number(n || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
      <h2 className="mb-4 font-heading text-xl font-bold text-primary">
        Order Summary
      </h2>

      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-foreground">
          Promo Code
        </label>

        {summary.appliedCoupon ? (
          <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  {summary.appliedCoupon.code}
                </p>
                <p className="text-xs text-green-600">
                  You saved {fmt(summary.appliedCoupon.discount_amount)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              type="button"
              aria-label="Remove coupon"
              className="text-green-600 transition-colors hover:text-green-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter coupon code"
                  disabled={couponLoading}
                  className="w-full rounded-lg border border-border py-2 pl-10 pr-4 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60"
                />
              </div>
              <button
                onClick={handleApply}
                type="button"
                disabled={couponLoading || !code.trim()}
                className="flex items-center gap-1 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {couponLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {couponLoading ? 'Applying' : 'Apply'}
              </button>
            </div>

            {localError && (
              <p className="mt-2 flex items-center gap-1 text-sm text-error">
                <X className="h-4 w-4" />
                {localError}
              </p>
            )}
          </>
        )}
      </div>

      <div className="space-y-3 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium text-foreground">
            {fmt(summary.subtotal)}
          </span>
        </div>

        {summary.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span className="font-medium">−{fmt(summary.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <span>Delivery Charges</span>
          <span className="font-medium text-foreground">
            {summary.deliveryCharges === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              fmt(summary.deliveryCharges)
            )}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>GST ({summary.gstRate}%)</span>
          <span className="font-medium text-foreground">
            {fmt(summary.gstAmount)}
          </span>
        </div>

        <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-primary">
          <span>Total Amount</span>
          <span>{fmt(summary.total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onProceedToCheckout}
        className="mt-5 w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Proceed to Checkout
      </button>

      <button
        type="button"
        onClick={() => window.history.back()}
        className="mt-3 w-full rounded-lg border border-border py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
      >
        ← Continue Shopping
      </button>
    </div>
  );
}