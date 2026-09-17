'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import RelatedProducts from './RelatedProducts';
import EmptyCart from './EmptyCart';
import ClearCartModal from './ClearCartModal';
import Icon from '@/components/ui/AppIcon';
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useUpdateCartMutation,
} from '@/store/api/cartApi';
import { useGetProductsQuery } from '@/store/api/productsApi';
import { clearCart, removeItem, updateQuantity, syncCart } from '@/store/slices/cart';
import type { RootState } from '@/store/store';

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
}

interface RecentProduct {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
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

export default function ShoppingCartInteractive() {
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = useSelector((state: RootState) => state.cart.itemCount);

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Live products from API — no hardcoding
  const { data: productsData } = useGetProductsQuery({ limit: 8 });

  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCartMutation] = useClearCartMutation();
  const [updateCart] = useUpdateCartMutation();

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

  // Map API products -> RelatedProduct shape (You May Also Like)
  const relatedProducts: RelatedProduct[] = useMemo(() => {
    const raw = productsData?.data ?? [];
    if (!Array.isArray(raw)) return [];

    return raw.slice(0, 4).map((p: any) => {
      const price = Number(p.discount_price ?? p.price) || 0;
      const originalPrice = Number(p.original_price ?? p.price) || price;

      return {
        id: String(p.id ?? p.product_id ?? ''),
        name: p.name || '',
        image: extractFirstImage(p),
        alt: p.name || 'Product',
        price,
        originalPrice,
        rating: Number(p.rating) || 0,
        reviews: Number(p.reviews ?? p.reviews_count) || 0,
      };
    });
  }, [productsData]);

  // Map API products -> RecentProduct shape (for EmptyCart)
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
    setIsClearModalOpen(false);
    try {
      await clearCartMutation(undefined).unwrap();
    } catch (err) {
      console.error('Failed to clear cart on server:', err);
    }
  };

  const handleApplyPromo = (_code: string) => {
    // no-op
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
  const discount = subtotal > 2000 ? Math.floor(subtotal * 0.1) : 0;
  const deliveryCharges = subtotal > 1000 ? 0 : 50;
  const gstRate = 18;
  const gstAmount = Math.floor(((subtotal - discount + deliveryCharges) * gstRate) / 100);
  const total = subtotal - discount + deliveryCharges + gstAmount;

  const orderSummary = {
    subtotal,
    discount,
    deliveryCharges,
    gstRate,
    gstAmount,
    total,
  };

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
                {cartItems.map((item) => {
                  // Build itemData so that undefined optional props are OMITTED,
                  // not passed as `undefined` (required by exactOptionalPropertyTypes)
                  const itemData: {
                    id: string;
                    name: string;
                    image: string;
                    price: number;
                    quantity: number;
                    variant?: string;
                    originalPrice?: number;
                    packingStandard?: string;
                  } = {
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                  };

                  if (item.variant !== undefined) {
                    itemData.variant = item.variant;
                  }
                  if (item.originalPrice !== undefined) {
                    itemData.originalPrice = item.originalPrice;
                  }
                  if (item.packingStandard !== undefined) {
                    itemData.packingStandard = item.packingStandard;
                  }

                  return (
                    <CartItem
                      key={item.id}
                      item={itemData}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                      onSaveForLater={handleSaveForLater}
                    />
                  );
                })}
              </div>

              <div>
                <OrderSummary
                  summary={orderSummary}
                  itemCount={totalItems}
                  onApplyPromo={handleApplyPromo}
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