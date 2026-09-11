'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import RelatedProducts from './RelatedProducts';
import EmptyCart from './EmptyCart';
import ClearCartModal from './ClearCartModal';
import Icon from '@/components/ui/AppIcon';
import type { RootState } from '@/store/store';
import { removeItem, updateQuantity, clearCart } from '@/store/slices/cart';

interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  price: number;
  originalPrice: number;
  discount: number;
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

export default function ShoppingCartInteractive() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Get cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = useSelector((state: RootState) => state.cart.itemCount);

  useEffect(() => {
    setIsHydrated(true);
  }, [cartItems, totalItems]);

  // Related Products
  const relatedProducts: RelatedProduct[] = [
    {
      id: 'rp1',
      slug: 'modern-wall-clock',
      name: 'Modern Wall Clock - Gold Finish',
      category: 'Clocks',
      image: '/assets/images/products/clock/clock-1.jpg',
      alt: 'Sleek modern wall clock with metal frame',
      price: 999,
      originalPrice: 1299,
      discount: 23,
      rating: 4.5,
      reviews: 128,
    },
    {
      id: 'rp2',
      slug: 'photo-frame-gift-box',
      name: 'Photo Frame Gift Box',
      category: 'Gift Items',
      image: '/assets/images/products/gifts/gift-4.jpg',
      alt: 'Elegant photo frame gift box with candle and card',
      price: 1199,
      originalPrice: 1499,
      discount: 20,
      rating: 4.7,
      reviews: 245,
    },
    {
      id: 'rp3',
      slug: 'peace-lily-plant',
      name: 'Indoor Plant - Peace Lily',
      category: 'Indoor Plants',
      image: '/assets/images/products/plants/plant-4.jpg',
      alt: 'Beautiful peace lily with white flowers',
      price: 599,
      originalPrice: 749,
      discount: 20,
      rating: 4.3,
      reviews: 89,
    },
    {
      id: 'rp4',
      slug: 'premium-perfume-gift-set',
      name: 'Premium Perfume Gift Set',
      category: 'Fragrances',
      image: '/assets/images/products/Fragnances/fragrance-1.jpg',
      alt: 'Premium perfume gift set with 3 fragrances',
      price: 1999,
      originalPrice: 2499,
      discount: 20,
      rating: 4.6,
      reviews: 312,
    },
  ];

  const recentProducts: RecentProduct[] = [
    {
      id: '9',
      name: 'Vintage Wooden Wall Clock',
      image: '/assets/images/products/clock/clock-2.jpg',
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

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeItem(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleSaveForLater = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setIsClearModalOpen(false);
  };

  const handleApplyPromo = (code: string) => {
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    router.push('/checkout-process');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="w-full px-2 py-8 sm:px-4">
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
      <div className="w-full px-2 py-8 sm:px-4">
        {cartItems.length > 0 ? (
          <>
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

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      price: item.price,
                      quantity: item.quantity,
                      variant: item.variant || '',
                      originalPrice: (item as any).originalPrice || undefined,
                      packingStandard: (item as any).packingStandard || undefined,
                    }}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    onSaveForLater={handleSaveForLater}
                  />
                ))}
              </div>
              <div>
                <OrderSummary
                  summary={orderSummary}
                  itemCount={totalItems}
                  onApplyPromo={handleApplyPromo}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCheckout}
                className="rounded-lg bg-[#D4AF37] px-8 py-3 text-sm font-semibold text-[#1A1A2E] transition hover:bg-[#C5A035] hover:scale-[0.98]"
              >
                Proceed to Checkout
              </button>
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