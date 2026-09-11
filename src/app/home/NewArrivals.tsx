'use client';

import Icon from '@/components/ui/AppIcon';
import ProductCard from '@/components/ui/ProductCard';
import { useGetProductsQuery } from '@/store/api/productsApi';

interface NewProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number | undefined;
  discount?: number | undefined;
  image: string;
  alt: string;
  launchDate: string;
  packingStandard?: string | undefined;
}

const NewArrivals = () => {
  const { data: productsData, isLoading } = useGetProductsQuery({});

  const newProducts: NewProduct[] = productsData?.data
    ?.filter((p: any) => p.is_new_arrival === 1 || p.is_new_arrival === true)
    .slice(0, 6)
    .map((product: any) => {
      const price = Number(product.discount_price) && Number(product.discount_price) < Number(product.price)
        ? Number(product.discount_price)
        : Number(product.price);

      const originalPrice = Number(product.discount_price) && Number(product.discount_price) < Number(product.price)
        ? Number(product.price)
        : undefined;

      const discount = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

      return {
        id: product.id.toString(),
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name: product.name,
        category: product.category,
        price,
        originalPrice,
        discount,
        image: (() => {
          let productImages: string[] = [];
          if (Array.isArray(product.product_images)) {
            productImages = product.product_images;
          } else if (typeof product.product_images === 'string') {
            try {
              const parsed = JSON.parse(product.product_images || '[]');
              productImages = Array.isArray(parsed) ? parsed : [];
            } catch {
              productImages = [];
            }
          }
          return productImages?.[0] || '/placeholder.jpg';
        })(),
        alt: product.description,
        launchDate: 'Jan 2025',
        packingStandard: product.packing_standard || undefined,
      };
    }) || [];

  if (isLoading) {
    return (
      <section className="bg-background py-4 sm:py-6">
        <div className="w-full px-2 sm:px-4">
          <div className="text-center">Loading new arrivals...</div>
        </div>
      </section>
    );
  }

  if (!newProducts.length) {
    return null;
  }

  return (
    <section className="bg-background py-4 sm:py-6">
      <div className="w-full px-2 sm:px-4">
        <div className="mb-4 text-center sm:mb-6" data-aos="fade-up">
          <div className="mb-1 flex items-center justify-center space-x-2 sm:mb-2 ">
            <Icon name="SparklesIcon" size={24} className="text-primary sm:size-8" variant="solid" />
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              New Arrivals
            </h2>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">
            Fresh additions to our collection
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {newProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              category={product.category}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              image={product.image}
              alt={product.alt}
              rating={4.5}
              showThumbnails={false}
              animationDelay={index * 100}
              packingStandard={product.packingStandard}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
