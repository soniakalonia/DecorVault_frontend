'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface WishlistItemProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  inStock: boolean;
  category: string;
  onRemove: () => void;
  onAddToCart: () => void;
}

const WishlistItem = ({
  id,
  name,
  price,
  originalPrice,
  image,
  alt,
  inStock,
  category,
  onRemove,
  onAddToCart,
}: WishlistItemProps) => {
  return (
    <div className="group rounded-lg border border-border bg-card p-4 shadow-elevation-1 transition-smooth hover:shadow-elevation-2">
      <div className="relative mb-3 overflow-hidden rounded-md bg-muted">
        <Link href={`/product-details?id=${id}`}>
          <AppImage
            src={image}
            alt={alt}
            className="h-48 w-full object-cover transition-smooth group-hover:scale-105"
          />
        </Link>
        <button
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-error shadow-elevation-2 transition-smooth hover:bg-white hover:scale-110"
          aria-label="Remove from wishlist"
        >
          <Icon name="HeartIcon" size={20} variant="solid" />
        </button>
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-md bg-error px-3 py-1 text-sm font-medium text-error-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="caption mb-1 text-muted-foreground">{category}</p>
        <Link href={`/product-details?id=${id}`}>
          <h3 className="font-heading text-base font-semibold text-card-foreground transition-smooth hover:text-primary line-clamp-2">
            {name}
          </h3>
        </Link>
      </div>

      <div className="mb-3 flex items-center space-x-2">
        <span className="data-text text-lg font-semibold text-primary">
          ₹{price.toLocaleString('en-IN')}
        </span>
        {originalPrice && (
          <span className="data-text text-sm text-muted-foreground line-through">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      <button
        onClick={onAddToCart}
        disabled={!inStock}
        className={`flex w-full items-center justify-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-smooth ${
          inStock
            ? 'bg-accent text-accent-foreground hover:scale-[0.97]'
            : 'cursor-not-allowed bg-muted text-muted-foreground'
        }`}
      >
        <Icon name="ShoppingCartIcon" size={18} />
        <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
      </button>
    </div>
  );
};

export default WishlistItem;
