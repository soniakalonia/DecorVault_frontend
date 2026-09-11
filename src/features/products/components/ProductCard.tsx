'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  sizes: string[];
  colors: string[];
  capacity: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, size: string, color: string) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.sizes.length > 1 || product.colors.length > 1) {
      setShowVariantModal(true);
    } else {
      addToCart();
    }
  };

  const addToCart = () => {
    setIsAddingToCart(true);
    onAddToCart(product.id, selectedSize, selectedColor);
    
    setTimeout(() => {
      setIsAddingToCart(false);
      setShowVariantModal(false);
    }, 500);
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-elevation-1 transition-smooth hover:shadow-elevation-2">
        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              Bestseller
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-md bg-error px-2 py-1 text-xs font-medium text-error-foreground">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute right-2 top-2 z-10 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            Out of Stock
          </div>
        )}

        {/* Product Image */}
        <Link href={`/product-details?id=${product.id}`} className="relative aspect-square overflow-hidden bg-muted">
          <AppImage
            src={product.image}
            alt={product.alt}
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
        </Link>

        {/* Product Info */}
        <div className="flex flex-1 flex-col p-4">
          <Link href={`/product-details?id=${product.id}`}>
            <p className="caption mb-1 text-muted-foreground">{product.category}</p>
            <h3 className="mb-2 line-clamp-2 text-base font-medium text-card-foreground transition-smooth hover:text-primary">
              {product.name}
            </h3>
          </Link>

          {/* Capacity */}
          <p className="caption mb-2 text-muted-foreground">
            Capacity: {product.capacity}
          </p>

          {/* Rating */}
          <div className="mb-3 flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="StarIcon"
                  size={14}
                  variant={i < Math.floor(product.rating) ? 'solid' : 'outline'}
                  className={i < Math.floor(product.rating) ? 'text-accent' : 'text-muted-foreground'}
                />
              ))}
            </div>
            <span className="caption text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="mb-3 flex items-baseline space-x-2">
            <span className="data-text text-lg font-semibold text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="data-text text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Size & Color Options */}
          <div className="mb-3 space-y-2">
            {product.sizes.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 3).map((size) => (
                  <span
                    key={size}
                    className="caption rounded border border-border px-2 py-1 text-muted-foreground"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="caption rounded border border-border px-2 py-1 text-muted-foreground">
                    +{product.sizes.length - 3}
                  </span>
                )}
              </div>
            )}
            {product.colors.length > 1 && (
              <div className="flex items-center space-x-1">
                <span className="caption text-muted-foreground">Colors:</span>
                <span className="caption font-medium text-foreground">
                  {product.colors.length} available
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            className={`mt-auto flex items-center justify-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-smooth ${
              product.inStock
                ? 'bg-primary text-primary-foreground hover:scale-[0.97]'
                : 'cursor-not-allowed bg-muted text-muted-foreground'
            }`}
          >
            {isAddingToCart ? (
              <>
                <Icon name="CheckIcon" size={18} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Icon name="ShoppingCartIcon" size={18} />
                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Variant Selection Modal */}
      {showVariantModal && (
        <>
          <div
            className="fixed inset-0 z-[250] bg-background/80 backdrop-blur-sm"
            onClick={() => setShowVariantModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[300] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-6 shadow-elevation-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-card-foreground">
                Select Options
              </h3>
              <button
                onClick={() => setShowVariantModal(false)}
                className="text-muted-foreground transition-smooth hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-card-foreground">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-md px-4 py-2 text-sm transition-smooth ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 1 && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-card-foreground">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-md px-4 py-2 text-sm transition-smooth ${
                        selectedColor === color
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={addToCart}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
            >
              Add to Cart
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ProductCard;



