import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface RecommendedProductProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
}

const RecommendedProduct = ({
  id,
  name,
  price,
  originalPrice,
  image,
  alt,
  rating,
  reviewCount,
}: RecommendedProductProps) => {
  return (
    <Link
      href={`/product-details?id=${id}`}
      className="group block rounded-lg border border-border bg-card p-3 shadow-elevation-1 transition-smooth hover:shadow-elevation-2"
    >
      <div className="relative mb-2 overflow-hidden rounded-md bg-muted">
        <AppImage
          src={image}
          alt={alt}
          className="h-32 w-full object-cover transition-smooth group-hover:scale-105"
        />
      </div>

      <h4 className="mb-2 text-sm font-medium text-card-foreground transition-smooth group-hover:text-primary line-clamp-2">
        {name}
      </h4>

      <div className="mb-2 flex items-center space-x-1">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="StarIcon"
              size={14}
              variant={i < Math.floor(rating) ? 'solid' : 'outline'}
              className={i < Math.floor(rating) ? 'text-warning' : 'text-muted-foreground'}
            />
          ))}
        </div>
        <span className="caption text-muted-foreground">({reviewCount})</span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="data-text text-base font-semibold text-primary">
          ₹{price.toLocaleString('en-IN')}
        </span>
        {originalPrice && (
          <span className="data-text text-xs text-muted-foreground line-through">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        )}
      </div>
    </Link>
  );
};

export default RecommendedProduct;
