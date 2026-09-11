'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface CartItemData {
  id: string;
  name: string;
  image: string;
  alt?: string;
  size?: string;
  color?: string;
  capacity?: string;
  material?: string;
  price: number;
  quantity: number;
  minOrderQty?: number;
  isWholesale?: boolean;
  stock?: number;
}

interface CartItemProps {
  item: CartItemData;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
  onSaveForLater: (id: string) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove, onSaveForLater }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (newQty: number) => {
    const minQty = item.minOrderQty ?? 1;
    const maxQty = item.stock ?? Infinity;
    if (newQty >= minQty && newQty <= maxQty) {
      setQuantity(newQty);
      onQuantityChange(item.id, newQty);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.id);
    }, 300);
  };

  const itemTotal = item.price * quantity;

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-smooth sm:flex-row ${
        isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* Product Image */}
      <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <AppImage
          src={item.image}
          alt={item.alt || item.name}
          className="h-full w-full object-cover transition-smooth hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-heading text-lg font-semibold text-card-foreground">
                {item.name}
              </h3>
              {item.isWholesale && (
                <span className="mt-1 inline-block rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                  Wholesale Item
                </span>
              )}
            </div>
            <button
              onClick={handleRemove}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-smooth hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove item"
            >
              <Icon name="TrashIcon" size={18} />
            </button>
          </div>

          {/* Variant Details */}
          <div className="mb-3 space-y-1">
            {item.size || item.color ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {item.size && (
                  <span className="flex items-center gap-1">
                    <Icon name="Square3Stack3DIcon" size={16} />
                    Size: <span className="font-medium text-card-foreground">{item.size}</span>
                  </span>
                )}
                {item.color && (
                  <span className="flex items-center gap-1">
                    <Icon name="SwatchIcon" size={16} />
                    Color: <span className="font-medium text-card-foreground">{item.color}</span>
                  </span>
                )}
              </div>
            ) : null}
            {item.capacity || item.material ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {item.capacity && (
                  <span className="flex items-center gap-1">
                    <Icon name="BeakerIcon" size={16} />
                    Capacity: <span className="font-medium text-card-foreground">{item.capacity}</span>
                  </span>
                )}
                {item.material && (
                  <span className="flex items-center gap-1">
                    <Icon name="CubeIcon" size={16} />
                    Material: <span className="font-medium text-card-foreground">{item.material}</span>
                  </span>
                )}
              </div>
            ) : null}
          </div>

          {/* Stock Status */}
          {item.stock !== undefined && item.stock < 10 && (
            <p className="caption mb-2 text-warning">
              Only {item.stock} items left in stock
            </p>
          )}
        </div>

        {/* Price and Quantity Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Qty:</span>
              <div className="flex items-center rounded-md border border-border">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= (item.minOrderQty ?? 1)}
                  className="flex h-8 w-8 items-center justify-center text-foreground transition-smooth hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Icon name="MinusIcon" size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || (item.minOrderQty ?? 1);
                    handleQuantityChange(val);
                  }}
                  min={item.minOrderQty ?? 1}
                  max={item.stock}
                  className="data-text h-8 w-16 border-x border-border bg-transparent text-center text-sm focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={item.stock !== undefined && quantity >= item.stock}
                  className="flex h-8 w-8 items-center justify-center text-foreground transition-smooth hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Icon name="PlusIcon" size={16} />
                </button>
              </div>
            </div>

            {/* Min Order Qty Info */}
            {item.isWholesale && (
              <span className="caption text-muted-foreground">
                Min: {item.minOrderQty} pcs
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="data-text text-sm text-muted-foreground line-through">
                ₹{(item.price * 1.2).toLocaleString('en-IN')}
              </p>
              <p className="data-text text-xl font-semibold text-primary">
                ₹{itemTotal.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Save for Later */}
        <button
          onClick={() => onSaveForLater(item.id)}
          className="mt-3 flex items-center gap-2 text-sm text-primary transition-smooth hover:underline"
        >
          <Icon name="BookmarkIcon" size={16} />
          Save for Later
        </button>
      </div>
    </div>
  );
}