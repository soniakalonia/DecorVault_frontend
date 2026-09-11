'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import ProductCard from '@/components/ui/ProductCard';
import { useGetRelatedProductsQuery } from '@/store/api/productsApi';

interface RelatedProductsProps {
  slug: string;
}

const RelatedProducts = ({ slug }: RelatedProductsProps) => {
  const { data, isLoading } = useGetRelatedProductsQuery(slug);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!data?.data || data.data.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Related Products
        </h2>
        <Link
          href="/products"
          className="flex items-center space-x-1 text-sm font-medium text-primary transition-smooth hover:underline"
        >
          <span>View All</span>
          <Icon name="ArrowRightIcon" size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data.data.map((product: any) => {
          const discount = product.price && product.discount_price
            ? Math.round(((product.price - product.discount_price) / product.price) * 100)
            : 0;

          let productImages: string[] = [];
          if (Array.isArray(product.product_images)) {
            productImages = product.product_images;
          } else if (typeof product.product_images === 'string') {
            try {
              productImages = JSON.parse(product.product_images);
            } catch (e) {
              productImages = [];
            }
          }

          return (
            <ProductCard
              key={product.id}
              id={product.id.toString()}
              slug={product.slug}
              name={product.name}
              category={product.category}
              price={Number(product.discount_price || product.price)}
              originalPrice={Number(product.price)}
              image={productImages[0] || ''}
              alt={product.description || product.name}
              rating={4.5}
              discount={discount}
              showThumbnails={false}
              animationDelay={0}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;