'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import RelatedProducts from './RelatedProducts';
import EmptyCart from './EmptyCart';
import ClearCartModal from './ClearCartModal';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'react-toastify';
import { Tag, X, Check, Loader2 } from 'lucide-react';
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useUpdateCartMutation,
} from '@/store/api/cartApi';
import { useGetProductsQuery } from '@/store/api/productsApi';
import { useValidateCouponMutation } from '@/store/api/couponApi';
import { clearCart, removeItem, updateQuantity, syncCart } from '@/store/slices/cart';
import type { RootState } from '@/store/store';

interface RelatedProduct {
  id: string;
  slug?: string;
  name: string;
  category?: string;
  image: string;
  alt: string;
  price: number;
  originalPrice: number;
  discount?: number;
  rating: number;
  reviews?: number;
  packingStandard?: string;
}

interface RecentProduct {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
}

interface AppliedCoupon {
  coupon_id: number;
  code: string;
  type: string;
  discount_amount: number;
  coupon_details?: any;
}

function extractFirstImage(product: any): string {
  const raw = product?.product_images ?? product?.image ?? product?.images ?? '';
  if (!raw) return '';
  if (Array.isArray(raw)) return raw[0] || '';
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed[0] || '';
        if (typeof parsed === 'string') return parsed;
      } catch {
        return raw;
      }
    }
    return raw;
  }
  return '';
}

/* ===================== INLINE OrderSummary ===================== */

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  couponLoading: boolean;
  onApplyPromo: (code: string) => Promise<boolean>;
  onRemovePromo: () => void;
  onProceedToCheckout: () => void;
}

function OrderSummary({
  subtotal,
  discount,
  deliveryCharges,
  gstRate,
  gstAmount,
  total,
  itemCount,
  appliedCoupon,
  couponLoading,
  onApplyPromo,
  onRemovePromo,
  onProceedToCheckout,
}: OrderSummaryProps) {
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (appliedCoupon) {
      setCode('');
      setLocalError('');
    }
  }, [appliedCoupon]);

  const handleApply = async () => {
    if (!code.trim()) {
      setLocalError('Please enter a coupon code');
      return;
    }
    setLocalError('');
    const ok = await onApplyPromo(code.trim());
    if (!ok) setLocalError('Invalid coupon code');
    else setCode('');
  };

  const handleRemove = () => {
    onRemovePromo();
    setCode('');
    setLocalError('');
  };

  const fmt = (n: number) =>
    `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  return (
    <div className="rounded-lg border border-[#E8E4E0] bg-white p-6">
      <h2 className="mb-4 font-heading text-xl font-bold text-[#1A1A2E]">
        Order Summary
      </h2>

      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-[#1A1A2E]">
          Promo Code
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  {appliedCoupon.code}
                </p>
                <p className="text-xs text-green-600">
                  You saved {fmt(appliedCoupon.discount_amount)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              type="button"
              aria-label="Remove coupon"
              className="text-green-600 hover:text-green-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7A7A]" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApply();
                    }
                  }}
                  placeholder="Enter coupon code"
                  disabled={couponLoading}
                  className="w-full rounded-lg border border-[#E8E4E0] py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:opacity-60"
                />
              </div>
              <button
                onClick={handleApply}
                type="button"
                disabled={couponLoading || !code.trim()}
                className="flex items-center gap-1 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#1A1A2E] hover:bg-[#D4AF37]/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {couponLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {couponLoading ? 'Applying' : 'Apply'}
              </button>
            </div>

            {localError && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <X className="h-4 w-4" />
                {localError}
              </p>
            )}
          </>
        )}
      </div>

      <div className="space-y-3 border-t border-[#E8E4E0] pt-4 text-sm">
        <div className="flex justify-between text-[#7A7A7A]">
          <span>
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium text-[#1A1A2E]">{fmt(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span className="font-medium">−{fmt(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#7A7A7A]">
          <span>Delivery Charges</span>
          <span className="font-medium text-[#1A1A2E]">
            {deliveryCharges === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              fmt(deliveryCharges)
            )}
          </span>
        </div>

        <div className="flex justify-between text-[#7A7A7A]">
          <span>GST ({gstRate}%)</span>
          <span className="font-medium text-[#1A1A2E]">{fmt(gstAmount)}</span>
        </div>

        <div className="flex justify-between border-t border-[#E8E4E0] pt-3 text-base font-bold text-[#1A1A2E]">
          <span>Total Amount</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onProceedToCheckout}
        className="mt-5 w-full rounded-lg bg-[#1A1A2E] py-3 font-medium text-white transition-smooth hover:bg-[#1A1A2E]/90"
      >
        Proceed to Checkout
      </button>

      <button
        type="button"
        onClick={() => window.history.back()}
        className="mt-3 w-full rounded-lg border border-[#E8E4E0] py-2.5 text-sm font-medium text-[#1A1A2E] transition-smooth hover:bg-[#F0EDEA]"
      >
        ← Continue Shopping
      </button>
    </div>
  );
}

/* ===================== Main Component ===================== */

export default function ShoppingCartInteractive() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = useSelector((state: RootState) => state.cart.itemCount);

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: productsData } = useGetProductsQuery({ limit: 8 });

  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCartMutation] = useClearCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [validateCoupon] = useValidateCouponMutation();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (cartData?.success && Array.isArray(cartData.data)) {
      const items = cartData.data.map((item: any) => {
        let images: any[] = [];
        try {
          images =
            typeof item.product_images === 'string'
              ? JSON.parse(item.product_images)
              : item.product_images || [];
        } catch {
          images = [];
        }

        return {
          id:
            item.variant_id && item.variant_id !== 'default'
              ? item.variant_id.toString()
              : item.product_id?.toString() || item.id?.toString() || 'unknown',
          recordId: item.id,
          name: item.name,
          image: Array.isArray(images) ? images[0] || '' : '',
          price: Number(item.discount_price ?? item.price) || 0,
          originalPrice: item.price ? Number(item.price) : undefined,
          quantity: Number(item.quantity) || 1,
          variant:
            item.variant_id && item.variant_id !== 'default'
              ? item.variant_id
              : undefined,
          packingStandard: item.packing_standard || undefined,
        };
      });
      items.sort((a: any, b: any) => (b.recordId ?? 0) - (a.recordId ?? 0));

      dispatch(syncCart(items));
    }
  }, [cartData, dispatch]);

  const relatedProducts: RelatedProduct[] = useMemo(() => {
    const raw = productsData?.data ?? [];
    if (!Array.isArray(raw)) return [];

    return raw.slice(0, 4).map((p: any) => {
      const price = Number(p.discount_price ?? p.price) || 0;
      const originalPrice = Number(p.original_price ?? p.price) || price;
      const discount =
        originalPrice > price && originalPrice > 0
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : 0;

      return {
        id: String(p.id ?? p.product_id ?? ''),
        slug: p.slug || String(p.id ?? ''),
        name: p.name || '',
        category: p.category_name || p.category || '',
        image: extractFirstImage(p),
        alt: p.name || 'Product',
        price,
        originalPrice,
        discount,
        rating: Number(p.rating) || 0,
        reviews: Number(p.reviews ?? p.reviews_count) || 0,
      };
    });
  }, [productsData]);

  const recentProducts: RecentProduct[] = useMemo(() => {
    const raw = productsData?.data ?? [];
    if (!Array.isArray(raw)) return [];

    return raw.slice(0, 2).map((p: any) => ({
      id: String(p.id ?? p.product_id ?? ''),
      name: p.name || '',
      image: extractFirstImage(p),
      alt: p.name || 'Product',
      price: Number(p.discount_price ?? p.price) || 0,
    }));
  }, [productsData]);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    const cartItem = cartItems.find((item) => item.id === id);
    const updateId = cartItem?.recordId ?? id;

    dispatch(updateQuantity({ id, quantity: newQuantity }));
    try {
      await updateCart({ id: updateId, quantity: newQuantity }).unwrap();
    } catch (err) {
      console.error('Failed to update quantity on server:', err);
    }
  };

  const handleRemoveItem = async (id: string) => {
    const cartItem = cartItems.find((item) => item.id === id);
    const deleteId = cartItem?.recordId ?? id;

    dispatch(removeItem(id));
    try {
      await removeFromCart(deleteId).unwrap();
    } catch (err) {
      console.error('Failed to remove item on server:', err);
    }
  };

  const handleSaveForLater = async (id: string) => {
    const cartItem = cartItems.find((item) => item.id === id);
    const deleteId = cartItem?.recordId ?? id;

    dispatch(removeItem(id));
    try {
      await removeFromCart(deleteId).unwrap();
    } catch (err) {
      console.error('Failed to save-for-later (remove) item on server:', err);
    }
  };

  const handleClearCart = async () => {
    dispatch(clearCart());
    setAppliedCoupon(null);
    setIsClearModalOpen(false);
    try {
      await clearCartMutation(undefined).unwrap();
    } catch (err) {
      console.error('Failed to clear cart on server:', err);
    }
  };

  const handleApplyCoupon = async (code: string): Promise<boolean> => {
    if (!code?.trim()) {
      toast.error('Please enter a coupon code');
      return false;
    }

    setCouponLoading(true);
    try {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const userId =
        typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      const res = await validateCoupon({
        code: code.trim().toUpperCase(),
        cart_total: subtotal,
        user_id: userId,
      }).unwrap();

      setAppliedCoupon(res.data);
      toast.success(`Coupon applied — you saved ₹${res.data.discount_amount}`);
      return true;
    } catch (err: any) {
      const msg = err?.data?.message || 'Invalid coupon code';
      toast.error(msg);
      setAppliedCoupon(null);
      return false;
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout-process');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
          <div className="h-8 w-48 animate-pulse rounded bg-[#F0EDEA]"></div>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-lg bg-[#F0EDEA]"></div>
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-lg bg-[#F0EDEA]"></div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponDiscount = appliedCoupon?.discount_amount || 0;
  const deliveryCharges = subtotal > 1000 ? 0 : 50;
  const gstRate = 18;
  // ✅ Math.round for nearest rupee (was Math.floor)
  const gstAmount = Math.round(
    ((subtotal - couponDiscount + deliveryCharges) * gstRate) / 100
  );
  const total = subtotal - couponDiscount + deliveryCharges + gstAmount;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        {cartItems.length > 0 ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl font-bold text-[#1A1A2E]">
                  Shopping Cart
                </h1>
                <p className="mt-1 text-[#7A7A7A]">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <button
                onClick={() => setIsClearModalOpen(true)}
                className="flex items-center gap-2 rounded-md border border-[#E8E4E0] px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-smooth hover:bg-[#FEE2E2] hover:text-[#E74C3C]"
              >
                <Icon name="TrashIcon" size={18} />
                Clear Cart
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    onSaveForLater={handleSaveForLater}
                  />
                ))}
              </div>

              <div>
                <OrderSummary
                  subtotal={subtotal}
                  discount={couponDiscount}
                  deliveryCharges={deliveryCharges}
                  gstRate={gstRate}
                  gstAmount={gstAmount}
                  total={total}
                  itemCount={totalItems}
                  appliedCoupon={appliedCoupon}
                  couponLoading={couponLoading}
                  onApplyPromo={handleApplyCoupon}
                  onRemovePromo={handleRemoveCoupon}
                  onProceedToCheckout={handleProceedToCheckout}
                />
              </div>
            </div>

            <RelatedProducts products={relatedProducts} />
          </>
        ) : (
          <EmptyCart recentProducts={recentProducts} />
        )}
      </div>

      <ClearCartModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearCart}
      />
    </div>
  );
}