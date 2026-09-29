'use client';

import { useMemo } from 'react';
import {
  Loader2,
  Tag,
  Percent,
  DollarSign,
  Truck,
  Gift,
  Copy,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useGetCouponsQuery, type Coupon } from '@/store/api/couponApi';

export default function CouponsPage() {
  const { data, isLoading, isError } = useGetCouponsQuery({
    status: 'active',
    limit: 200,
  });

  const coupons: Coupon[] = useMemo(() => {
    const all = data?.data ?? [];
    const now = new Date();
    return all.filter(
      (c) =>
        c.status === 'active' &&
        new Date(c.start_date) <= now &&
        new Date(c.end_date) >= now
    );
  }, [data]);

  const copyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.success(`Copied "${code}"`);
    }
  };

  const typeIcon = (t: string) => {
    switch (t) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'fixed':
        return <DollarSign className="w-4 h-4" />;
      case 'free_shipping':
        return <Truck className="w-4 h-4" />;
      case 'buy_x_get_y':
        return <Gift className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const typeValue = (c: Coupon) => {
    if (c.type === 'percentage') {
      return c.maximum_discount
        ? `${c.value}% OFF (up to ₹${c.maximum_discount})`
        : `${c.value}% OFF`;
    }
    if (c.type === 'fixed') return `₹${c.value} OFF`;
    if (c.type === 'free_shipping') return 'FREE SHIPPING';
    return `Buy ${c.value} Get 1`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary font-heading mb-4">
        My Coupons
      </h1>

      {isError ? (
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-elevation-1 border border-border text-error">
          Failed to load coupons. Please try again later.
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-elevation-1 border border-border">
          <p className="text-muted-foreground">
            No coupons available right now. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-card text-card-foreground rounded-2xl shadow-elevation-1 border border-border overflow-hidden"
            >
              <div className="p-5 border-b border-dashed border-border bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    {typeIcon(c.type)}
                    <span className="text-lg">{typeValue(c)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{c.name}</p>
              </div>

              <div className="p-4 space-y-3">
                {c.description && (
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                )}

                {c.minimum_amount > 0 && (
                  <p className="text-xs text-foreground/80">
                    Min order:{' '}
                    <span className="font-medium">₹{c.minimum_amount}</span>
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Valid till{' '}
                  {new Date(c.end_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>

                <button
                  onClick={() => copyCode(c.code)}
                  className="w-full flex items-center justify-between bg-primary/5 hover:bg-primary/10 border border-dashed border-primary/30 rounded-lg px-3 py-2 transition"
                >
                  <span className="font-mono font-bold text-primary tracking-wider">
                    {c.code}
                  </span>
                  <Copy className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}