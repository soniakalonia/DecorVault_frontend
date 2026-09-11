'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

const CartIndicator = () => {
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
  
  // Mock cart data - in real app, this would come from context/state management
  const cartItems: CartItem[] = [
    {
      id: '1',
      name: 'Premium Storage Container Set',
      quantity: 2,
      price: 499,
      image: '/assets/images/no_image.png',
    },
    {
      id: '2',
      name: 'Kitchen Organizer Bins',
      quantity: 1,
      price: 299,
      image: '/assets/images/no_image.png',
    },
  ];

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const toggleCartPreview = () => {
    setIsCartPreviewOpen(!isCartPreviewOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleCartPreview}
        className="relative flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-smooth hover:bg-muted"
        aria-label="Shopping cart"
      >
        <Icon name="ShoppingCartIcon" size={24} />
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground data-text">
            {cartCount}
          </span>
        )}
      </button>

      {isCartPreviewOpen && (
        <>
          <div
            className="fixed inset-0 z-[150]"
            onClick={() => setIsCartPreviewOpen(false)}
          />
          <div className="absolute right-0 top-full z-[200] mt-2 w-80 rounded-md bg-popover shadow-elevation-3 transition-smooth">
            <div className="border-b border-border p-4">
              <h3 className="font-heading text-lg font-semibold text-popover-foreground">
                Shopping Cart
              </h3>
              <p className="caption text-muted-foreground">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
              </p>
            </div>

            {cartItems.length > 0 ? (
              <>
                <div className="max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 border-b border-border p-4 transition-smooth hover:bg-muted"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/images/no_image.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-popover-foreground truncate">
                          {item.name}
                        </p>
                        <p className="caption text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="data-text text-sm font-medium text-primary">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-popover-foreground">
                      Subtotal:
                    </span>
                    <span className="data-text text-lg font-semibold text-primary">
                      ₹{cartTotal}
                    </span>
                  </div>
                  <Link
                    href="/shopping-cart"
                    onClick={() => setIsCartPreviewOpen(false)}
                    className="block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout-process"
                    onClick={() => setIsCartPreviewOpen(false)}
                    className="mt-2 block w-full rounded-md bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground transition-smooth hover:scale-[0.97]"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <Icon name="ShoppingCartIcon" size={48} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Your cart is empty</p>
                <Link
                  href="/products"
                  onClick={() => setIsCartPreviewOpen(false)}
                  className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartIndicator;



