'use client';

import { useEffect, useState } from 'react';
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
          images = typeof item.product_images === 'string'
            ? JSON.parse(item.product_images)
            : item.product_images || [];
        } catch {
          images = [];
        }

        return {
          id: item.variant_id && item.variant_id !== 'default'
            ? item.variant_id.toString()
            : item.product_id?.toString() || item.id?.toString() || 'unknown',
          recordId: item.id,
          name: item.name,
          image: Array.isArray(images) ? images[0] || '' : '',
          price: Number(item.discount_price ?? item.price) || 0,
          originalPrice: item.price ? Number(item.price) : undefined,
          quantity: Number(item.quantity) || 1,
          variant: item.variant_id && item.variant_id !== 'default' ? item.variant_id : undefined,
          packingStandard: item.packing_standard || undefined,
        };
      });
      items.sort((a: any, b: any) => (b.recordId ?? 0) - (a.recordId ?? 0));

      dispatch(syncCart(items));
    }
  }, [cartData, dispatch]);

  const relatedProducts: RelatedProduct[] = [
    {
      id: '5',
      name: 'Modern Wall Clock - Gold Finish',
      image: '/assets/images/products/clocks/clock-1.jpg',
      alt: 'Sleek modern wall clock with metal frame',
      price: 999,
      originalPrice: 1299,
      rating: 4.5,
      reviews: 128,
    },
    {
      id: '6',
      name: 'Photo Frame Gift Box',
      image: '/assets/images/products/gifts/gift-4.jpg',
      alt: 'Elegant photo frame gift box with candle and card',
      price: 1199,
      originalPrice: 1499,
      rating: 4.7,
      reviews: 245,
    },
    {
      id: '7',
      name: 'Peace Lily Plant',
      image: '/assets/images/products/plants/plant-4.jpg',
      alt: 'Beautiful peace lily with white flowers',
      price: 599,
      originalPrice: 749,
      rating: 4.3,
      reviews: 89,
    },
    {
      id: '8',
      name: 'Luxury Perfume Gift Set',
      image: '/assets/images/products/fragrances/fragrance-1.jpg',
      alt: 'Premium perfume gift set with 3 fragrances',
      price: 1999,
      originalPrice: 2499,
      rating: 4.6,
      reviews: 312,
    },
  ];

  // Updated recent products - Home Decor
  const recentProducts: RecentProduct[] = [
    {
      id: '9',
      name: 'Vintage Wooden Wall Clock',
      image: '/assets/images/products/clocks/clock-2.jpg',
      alt: 'Beautiful vintage wooden wall clock with roman numerals',
      price: 1999,
    },
    {
      id: '10',
      name: 'Modern Ceramic Vase',
      image: '/assets/images/products/vases/vase-1.jpg',
      alt: 'Elegant modern ceramic vase with matte finish',
      price: 999,
    },
  ];

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    const cartItem = cartItems.find((item) => item.id === id);
    const updateId = cartItem?.recordId ?? id;

    // Optimistic local update for snappy UI...
    dispatch(updateQuantity({ id, quantity: newQuantity }));
    // ...but also persist to the server so it survives refresh.
    try {
      await updateCart({ id: updateId, quantity: newQuantity }).unwrap();
    } catch (err) {
      console.error('Failed to update quantity on server:', err);
    }
  };

  const handleRemoveItem = async (id: string) => {
    const cartItem = cartItems.find((item) => item.id === id);
    const deleteId = cartItem?.recordId ?? id;

    // Optimistic local update so the item disappears immediately.
    dispatch(removeItem(id));
    // Persist the removal server-side.
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

  const handleApplyPromo = (code: string) => {
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
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl font-bold text-[#1A1A2E]">Shopping Cart</h1>
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

            {/* Cart Content */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
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

              {/* Order Summary */}
              <div>
                <OrderSummary
                  summary={orderSummary}
                  itemCount={totalItems}
                  onApplyPromo={handleApplyPromo}
                />
              </div>
            </div>

            {/* Related Products */}
            <RelatedProducts products={relatedProducts} />
          </>
        ) : (
          <EmptyCart recentProducts={recentProducts} />
        )}
      </div>

      {/* Clear Cart Modal */}
      <ClearCartModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearCart}
      />
    </div>
  );
}