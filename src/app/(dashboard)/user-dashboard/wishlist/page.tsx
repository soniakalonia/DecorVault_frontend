'use client';

import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/store/api/wishlistApi';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function WishlistPage() {
  const router = useRouter();
  const { data: wishlistData, isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const wishlistItems = wishlistData?.data || [];

  const handleRemove = async (id: number) => {
    try {
      await removeFromWishlist(id).unwrap();
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading mb-4">My Wishlist</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading mb-4">My Wishlist</h1>
        <div className="bg-card p-12 rounded-lg shadow-elevation-1 border border-border text-center">
          <Icon name="HeartIcon" size={64} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">Your wishlist is empty</p>
          <p className="text-muted-foreground mb-6">Add items you love to your wishlist</p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
          >
            <span>Browse Products</span>
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground font-heading">My Wishlist</h1>
        <p className="text-sm text-muted-foreground">{wishlistItems.length} items</p>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {wishlistItems.map((item: any) => {
                let imageUrl = '/placeholder.png';
                try {
                  if (item.product_images) {
                    if (typeof item.product_images === 'string') {
                      if (item.product_images.startsWith('[') || item.product_images.startsWith('{')) {
                        const parsed = JSON.parse(item.product_images);
                        imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
                      } else {
                        imageUrl = item.product_images;
                      }
                    } else if (Array.isArray(item.product_images)) {
                      imageUrl = item.product_images[0];
                    }
                  }
                } catch (e) {
                  console.error('Image parse error:', e, item.product_images);
                }
                return (
                  <tr key={item.id} className="hover:bg-muted/50 transition-smooth">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                        />
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-primary">₹{item.discount_price || item.price}</p>
                        {item.discount_price && item.price > item.discount_price && (
                          <p className="text-sm text-muted-foreground line-through">₹{item.price}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                        In Stock
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => router.push(`/product/${item.slug}`)}
                          className="flex items-center space-x-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
                        >
                          <Icon name="EyeIcon" size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="flex items-center space-x-1 rounded-md bg-error px-3 py-1.5 text-sm font-medium text-white transition-smooth hover:scale-[0.98]"
                        >
                          <Icon name="TrashIcon" size={16} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
