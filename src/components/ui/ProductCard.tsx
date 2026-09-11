'use client';

import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/store/api/wishlistApi';
import { toggleWishlistItem } from '@/store/slices/wishlist';
import type { RootState } from '@/store/store';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: string;
  price: number;
  originalPrice?: number | undefined;
  image: string;
  alt: string;
  rating: number;
  discount?: number | undefined;
  showThumbnails?: boolean | undefined;
  animationDelay?: number | undefined;
  packingStandard?: string | undefined;
}

const ProductCard = ({
  id,
  slug,
  name,
  brand,
  category,
  price,
  originalPrice,
  image,
  alt,
  rating,
  discount = 0,
  showThumbnails = true,
  animationDelay: _animationDelay = 0,
  packingStandard
}: ProductCardProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const wishlistItem = wishlistItems.find(item => item.productId === id);
  const isInWishlist = !!wishlistItem;

  // ✅ Fallback image if image is empty or null
  const fallbackImage = '/assets/images/placeholder.png';
  const productImage = image && image !== '' && image !== 'null' && image !== 'undefined' 
    ? image 
    : fallbackImage;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      if (isInWishlist && wishlistItem) {
        await removeFromWishlist(wishlistItem.id).unwrap();
        dispatch(toggleWishlistItem({ id, productId: id, name, price, image: productImage }));
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist({ product_id: id }).unwrap();
        dispatch(toggleWishlistItem({ id, productId: id, name, price, image: productImage }));
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link href={`/product/${slug}`} className="block">
      <div className="group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        
        {/* Top Left: Discount */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-[#D4AF37] px-2.5 py-0.5 text-[10px] font-semibold text-[#1A1A2E]">
            {discount}% OFF
          </span>
        )}

        {/* Image - Full width with fixed aspect ratio 1:1 */}
        <div className="relative w-full overflow-hidden rounded-t-xl bg-gray-100" style={{ aspectRatio: '1/1' }}>
          <AppImage
            src={productImage}
            alt={alt || name}
            className="h-full w-full rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* ✅ Wishlist Icon - Shows on Hover only */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:bg-gray-100"
          >
            <Icon 
              name="HeartIcon" 
              size={16} 
              className={isInWishlist ? 'text-red-500 fill-red-500' : 'text-[#1A1A2E]'} 
            />
          </button>
        </div>

        {/* Content with padding */}
        <div className="p-3">
          {/* Brand Name */}
          {brand && (
            <p className="text-[10px] uppercase tracking-wide text-[#D4AF37] font-semibold">
              {brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="mb-1 line-clamp-2 text-sm font-medium text-foreground group-hover:text-[#D4AF37] transition-colors">
            {name}
          </h3>

          {/* Category (Optional - show if no brand) */}
          {!brand && (
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {category}
            </p>
          )}

          {/* Rating */}
          <div className="mb-1 flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name="StarIcon"
                size={12}
                variant={i < Math.floor(rating) ? 'solid' : 'outline'}
                className={i < Math.floor(rating) ? 'text-[#D4AF37]' : 'text-muted-foreground'}
              />
            ))}
            <span className="text-[11px] text-muted-foreground">
              ({rating.toFixed(1)})
            </span>
          </div>

          {/* Packing Standard */}
          {packingStandard && (
            <p className="mb-1 text-[10px] font-medium text-[#D4AF37]">
              Pack of {packingStandard}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-semibold text-primary">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;