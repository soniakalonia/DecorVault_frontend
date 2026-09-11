'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '@/store/slices/wishlist';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/store/api/wishlistApi';
import { toast } from 'react-toastify';
import Icon from '@/components/ui/AppIcon';
import type { RootState } from '@/store/store';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  capacity: string;
  price: number;
  originalPrice?: number;
  stock: number;
  minOrderQty: number;
}

interface ProductInfoProps {
  productName: string;
  category: string;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  currentImage?: string;
  onVariantChange: (_variant: ProductVariant) => void;
  onAddToCart: (_quantity: number) => void;
  onBuyNow: (_quantity: number) => void;
  packingStandard?: string;
}

const ProductInfo = ({
  productName,
  category,
  rating,
  reviewCount,
  variants,
  selectedVariant: initialSelectedVariant,
  currentImage = '',
  onVariantChange,
  onAddToCart,
  onBuyNow,
  packingStandard = '',
}: ProductInfoProps) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [addToWishlistApi] = useAddToWishlistMutation();
  const [removeFromWishlistApi] = useRemoveFromWishlistMutation();

  // Helper to extract numeric quantity from packing standard (e.g., "100 Pcs/Box" -> 100)
  const getPackingQty = (standard: string | null | undefined): number => {
    if (!standard) return 1;
    const match = standard.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  };

  const packingQty = getPackingQty(packingStandard);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(initialSelectedVariant || variants[0]);
  const [quantity, setQuantity] = useState(packingQty);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)));
  const uniqueColors = Array.from(
    new Set(variants.map((v) => JSON.stringify({ color: v.color, hex: v.colorHex })))
  ).map((str) => JSON.parse(str));

  const [selectedSize, setSelectedSize] = useState(selectedVariant?.size || '');
  const [selectedColor, setSelectedColor] = useState(selectedVariant?.color || '');

  useEffect(() => {
    if (initialSelectedVariant) {
      setSelectedVariant(initialSelectedVariant);
      setSelectedSize(initialSelectedVariant.size);
      setSelectedColor(initialSelectedVariant.color);
    }
  }, [initialSelectedVariant]);

  useEffect(() => {
    if (selectedVariant) {
      const inWishlist = wishlistItems.some(item => item.id === selectedVariant.id);
      setIsWishlisted(inWishlist);
    }
  }, [selectedVariant, wishlistItems]);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const newVariant = variants.find((v) => v.size === size && v.color === selectedColor);
    if (newVariant) {
      setSelectedVariant(newVariant);
      setQuantity(newVariant.minOrderQty);
      onVariantChange(newVariant);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const newVariant = variants.find((v) => v.size === selectedSize && v.color === color);
    if (newVariant) {
      setSelectedVariant(newVariant);
      setQuantity(newVariant.minOrderQty);
      onVariantChange(newVariant);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    // Ensure quantity is a multiple of packing standard quantity
    const remainder = newQuantity % packingQty;
    let adjustedQuantity = newQuantity;

    if (remainder !== 0) {
      // Round to the nearest multiple if user enters value manually
      adjustedQuantity = Math.round(newQuantity / packingQty) * packingQty;
    }

    if (selectedVariant && adjustedQuantity >= packingQty && adjustedQuantity <= selectedVariant.stock) {
      setQuantity(adjustedQuantity);
    } else if (selectedVariant && adjustedQuantity < packingQty) {
      setQuantity(packingQty);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  const handleBuyNow = () => {
    onBuyNow(quantity);
  };

  const toggleWishlist = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    const wishlistItem = {
      id: selectedVariant.id,
      productId: selectedVariant.id,
      name: productName,
      price: selectedVariant.price,
      image: currentImage,
      variant: `${selectedVariant.color} - ${selectedVariant.size}`,
    };

    const newWishlistState = !isWishlisted;

    try {
      if (newWishlistState) {
        await addToWishlistApi({
          product_id: selectedVariant.id,
          variant_id: selectedVariant.id,
        }).unwrap();
      } else {
        const item = wishlistItems.find(i => i.id === selectedVariant.id);
        if (item) {
          await removeFromWishlistApi(item.id).unwrap();
        }
      }
    } catch (error) {
      // Continue with local state even if API fails
    }

    dispatch(toggleWishlistItem(wishlistItem));
    setIsWishlisted(newWishlistState);
    toast.success(newWishlistState ? 'Added to wishlist!' : 'Removed from wishlist!');
  };

  const discountPercentage = selectedVariant?.originalPrice
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        {/* Breadcrumb Category */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Home</span>
          <Icon name="ChevronRightIcon" size={16} />
          <span>{category}</span>
        </div>

        {/* Product Title */}
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          {productName}
        </h1>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="StarIcon"
                size={18}
                variant={index < Math.floor(rating) ? 'solid' : 'outline'}
                className={index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm font-medium">
            {rating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">
            ({reviewCount.toLocaleString('en-IN')} reviews)
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-baseline space-x-3 mb-4">
          <span className="text-3xl font-bold text-primary">
            ₹{selectedVariant?.price.toLocaleString('en-IN') || '0'}
          </span>
          {selectedVariant?.originalPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                ₹{selectedVariant.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {discountPercentage}% OFF
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center space-x-2">
          <Icon
            name={(selectedVariant?.stock || 0) > 10 ? 'CheckCircleIcon' : 'ExclamationTriangleIcon'}
            size={18}
            variant="solid"
            className={(selectedVariant?.stock || 0) > 10 ? 'text-green-600' : 'text-orange-500'}
          />
          <span className="text-sm font-medium">
            {(selectedVariant?.stock || 0) > 10
              ? 'In Stock'
              : `Only ${selectedVariant?.stock || 0} left in stock`}
          </span>
        </div>
      </div>

      {/* Variant Selection - Size and Color Only */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Size Selection */}
        <div className="flex items-center gap-3">
          <label className="text-base font-semibold text-foreground whitespace-nowrap">
            Size:
          </label>
          <div className="flex items-center gap-2">
            {uniqueSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`min-w-[70px] rounded-lg border-2 px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 ${selectedSize === size
                  ? 'border-primary bg-primary text-white shadow-lg'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:shadow-md'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="flex items-center gap-3">
          <label className="text-base font-semibold text-foreground whitespace-nowrap">
            Color:
          </label>
          <div className="flex items-center gap-2">
            {uniqueColors.map((colorObj) => (
              <button
                key={colorObj.color}
                onClick={() => handleColorChange(colorObj.color)}
                className={`rounded-full border-2 p-1 transition-all hover:scale-110 ${selectedColor === colorObj.color
                  ? 'border-primary shadow-lg ring-4 ring-primary/20'
                  : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                  }`}
              >
                <div
                  className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: colorObj.hex }}
                  title={colorObj.color}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity and Packing Standard in One Row */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <label className="text-base font-semibold text-foreground whitespace-nowrap">Quantity</label>
          <div className="flex items-center rounded-lg border-2 border-gray-300 bg-white shadow-sm">
            <button
              onClick={() => handleQuantityChange(quantity - packingQty)}
              disabled={quantity <= packingQty}
              className="flex h-12 w-12 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="MinusIcon" size={20} />
            </button>
            <input
              type="number"
              value={quantity}
              step={packingQty}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || packingQty)}
              className="h-12 w-20 border-x-2 border-gray-300 bg-transparent text-center font-medium text-foreground focus:outline-none"
              min={packingQty}
              max={selectedVariant?.stock || 999}
            />
            <button
              onClick={() => handleQuantityChange(quantity + packingQty)}
              disabled={quantity + packingQty > (selectedVariant?.stock || 999)}
              className="flex h-12 w-12 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="PlusIcon" size={20} />
            </button>
          </div>
        </div>

        {/* Packing Standard */}
        {packingStandard && (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-2.5 border-2 border-dashed border-blue-200">
            <div className="flex items-center gap-2">
              <Icon name="BoxIcon" size={20} className="text-primary" />
              <span className="text-sm font-bold text-foreground uppercase tracking-wide whitespace-nowrap">Packing Standard</span>
            </div>
            <span className="text-base font-bold text-primary">{packingStandard}</span>
          </div>
        )}

        

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="flex items-center justify-center space-x-2 rounded-lg border-2 border-gray-300 bg-white px-4 h-12 font-semibold text-gray-700 transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-600"
        >
          <Icon
            name="HeartIcon"
            size={20}
            variant={isWishlisted ? 'solid' : 'outline'}
            className={isWishlisted ? 'text-red-500' : 'text-gray-400'}
          />
          <span>Wishlist</span>
        </button>
      </div>

      <span className="text-xs text-muted-foreground block">
        {packingQty > 1 ? `Packed in ${packingQty}s` : `Min: 1`} | Max: {selectedVariant?.stock || 999}
      </span>

      {/* Buy Now and Add to Cart in Row */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 rounded-lg border-2 border-primary bg-white px-6 py-4 font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:shadow-lg"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 rounded-lg bg-primary px-6 py-4 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg"
        >
          Buy Now
        </button>
      </div>

      {/* Additional Info */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center space-x-3">
          <Icon name="TruckIcon" size={20} className="text-green-600" />
          <span className="text-sm text-foreground">Free delivery on orders above ₹500</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icon name="ShieldCheckIcon" size={20} className="text-blue-600" />
          <span className="text-sm text-foreground">7-day return policy</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icon name="CreditCardIcon" size={20} className="text-purple-600" />
          <span className="text-sm text-foreground">Secure payment options</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;



