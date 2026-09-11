'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface CartItemData {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
  originalPrice?: number;
  packingStandard?: string;
}

interface CartItemProps {
  item: CartItemData;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
  onSaveForLater: (id: string) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove, onSaveForLater }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const step = item.packingStandard ? parseInt(item.packingStandard) || 1 : 1;

  const handleDecrease = () => {
    const newQty = item.quantity - step;
    if (newQty <= 0) {
      handleRemove();
    } else {
      onQuantityChange(item.id, newQty);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + step);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  const itemTotal = item.price * item.quantity;
  const itemOriginalTotal = item.originalPrice ? item.originalPrice * item.quantity : null;

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border border-[#E8E4E0] bg-white p-4 transition-smooth sm:flex-row ${
        isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* Product Image */}
      <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-md bg-[#F0EDEA]">
        <AppImage
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-smooth hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-heading text-lg font-semibold text-[#1A1A2E]">
                {item.name}
              </h3>
              {item.variant && (
                <p className="mt-1 text-sm text-[#7A7A7A]">{item.variant}</p>
              )}
              {item.packingStandard && (
                <p className="mt-1 text-xs font-medium text-[#D4AF37]">
                  Pack of {item.packingStandard}
                </p>
              )}
            </div>
            <button
              onClick={handleRemove}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-md text-[#7A7A7A] transition-smooth hover:bg-[#FEE2E2] hover:text-[#E74C3C]"
              aria-label="Remove item"
            >
              <Icon name="TrashIcon" size={18} />
            </button>
          </div>
        </div>

        {/* Price and Quantity Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#7A7A7A]">Qty:</span>
              <div className="flex items-center rounded-md border border-[#E8E4E0]">
                <button
                  onClick={handleDecrease}
                  className="flex h-8 w-8 items-center justify-center text-[#1A1A2E] transition-smooth hover:bg-[#FAFAFA]"
                  aria-label="Decrease quantity"
                >
                  <Icon name="MinusIcon" size={16} />
                </button>
                <span className="data-text h-8 w-16 border-x border-[#E8E4E0] bg-transparent text-center text-sm leading-8 text-[#1A1A2E]">
                  {item.quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="flex h-8 w-8 items-center justify-center text-[#1A1A2E] transition-smooth hover:bg-[#FAFAFA]"
                  aria-label="Increase quantity"
                >
                  <Icon name="PlusIcon" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Price Display - Correct Order: Current Price then Original Price */}
          <div className="text-right">
            <p className="data-text text-xl font-semibold text-[#1A1A2E]">
              ₹{itemTotal.toLocaleString('en-IN')}
            </p>
            {itemOriginalTotal && itemOriginalTotal > itemTotal && (
              <p className="text-sm text-[#7A7A7A] line-through">
                ₹{itemOriginalTotal.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>

        {/* Save for Later */}
        <button
          onClick={() => onSaveForLater(item.id)}
          className="mt-3 flex w-fit items-center gap-2 text-sm text-[#D4AF37] transition-smooth hover:underline"
        >
          <Icon name="BookmarkIcon" size={16} />
          Save for Later
        </button>
      </div>
    </div>
  );
}