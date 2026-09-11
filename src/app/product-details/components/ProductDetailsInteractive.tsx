'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetAdminProductsQuery } from '@/store/api/productsApi';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import BulkPricingCalculator from './BulkPricingCalculator';
import RelatedProducts from './RelatedProducts';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  colorVariant?: string;
}

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

interface Specification {
  label: string;
  value: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  alt: string;
  price: number;
  originalPrice?: number;
  rating: number;
  category: string;
}

interface PricingTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
  discount: number;
}

const ProductDetailsInteractive = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const { data: productsData, isLoading } = useGetAdminProductsQuery();
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [currentImages, setCurrentImages] = useState<ProductImage[]>([]);
  const [allVariantImages, setAllVariantImages] = useState<ProductImage[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    setIsHydrated(true);
    if (productId && productsData?.data) {
      const foundProduct = productsData.data.find((p: any) => p.id.toString() === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        let images = [];
        if (Array.isArray(foundProduct.product_images)) {
          images = foundProduct.product_images;
        } else if (typeof foundProduct.product_images === 'string') {
          try {
            images = JSON.parse(foundProduct.product_images);
          } catch (e) {
            console.warn('Failed to parse product images:', e);
            images = [];
          }
        }
        const productImages = images.map((url: string, index: number) => ({
          id: (index + 1).toString(),
          url,
          alt: foundProduct.description || foundProduct.name,
        }));
        setCurrentImages(productImages);
        
        // Create variants from database variants data
        let dbVariants = [];
        if (Array.isArray(foundProduct.variants)) {
          dbVariants = foundProduct.variants;
        } else if (typeof foundProduct.variants === 'string') {
          try {
            dbVariants = JSON.parse(foundProduct.variants);
          } catch (e) {
            console.warn('Failed to parse variants:', e);
            dbVariants = [];
          }
        }
        
        const variants = dbVariants.map((dbVariant: any) => ({
          id: dbVariant.variantId,
          size: dbVariant.size,
          color: dbVariant.color.name,
          colorHex: dbVariant.color.code,
          capacity: foundProduct.weight ? `${foundProduct.weight}kg` : 'N/A',
          price: dbVariant.price,
          originalPrice: Number(foundProduct.price),
          stock: dbVariant.stock,
          minOrderQty: 1,
        }));
        
        setProductVariants(variants);
        if (variants.length > 0) {
          setSelectedVariant(variants[0]);
        }
      }
    }
  }, [isHydrated, productId, productsData]);



  const specifications: Specification[] = product ? [
    { label: 'Material', value: product.materials || 'N/A' },
    { label: 'Brand', value: product.brand || 'N/A' },
    { label: 'Weight', value: product.weight ? `${product.weight}kg` : 'N/A' },
    { label: 'Warranty', value: product.warranty || 'N/A' },
    { label: 'Category', value: product.category || 'N/A' },
    { label: 'Sizes', value: (() => {
      try {
        return JSON.parse(product.sizes || '[]').join(', ') || 'N/A';
      } catch (e) {
        return 'N/A';
      }
    })() },
    { label: 'Care Instructions', value: product.care_instructions || 'N/A' },
    { label: 'Additional Info', value: product.additional_info || 'N/A' },
    { label: 'Stock Quantity', value: product.stock_quantity?.toString() || 'N/A' },
  ] : [];

  const careInstructions: string[] = product ? [
    product.care_instructions || 'No care instructions available',
    product.additional_info || 'No additional information available',
  ].filter(Boolean) : [];

  const warrantyInfo = product?.warranty ? `This product comes with ${product.warranty} warranty. ${product.additional_info || ''}` : 'No warranty information available.';

  const reviews: Review[] = [
    {
      id: 'r1',
      userName: 'Priya Sharma',
      rating: 5,
      date: '15 August 2026',
      comment: `Absolutely love this home decor piece! The quality is exceptional and it looks stunning in my living room. The packaging was secure and delivery was prompt. Highly recommend!`,
      verified: true,
    },
    {
      id: 'r2',
      userName: 'Rajesh Kumar',
      rating: 4,
      date: '10 August 2026',
      comment: `Beautiful product! The design is elegant and the finish is premium. Great value for money. Will definitely purchase more from DecorVault.`,
      verified: true,
    },
    {
      id: 'r3',
      userName: 'Anita Desai',
      rating: 5,
      date: '05 August 2026',
      comment: `Perfect addition to my home decor collection! The craftsmanship is excellent and it looks exactly as shown in pictures. Very happy with my purchase.`,
      verified: true,
    },
    {
      id: 'r4',
      userName: 'Vikram Singh',
      rating: 5,
      date: '28 July 2026',
      comment: `Outstanding quality! I've been ordering from DecorVault for months now and the quality never disappoints. This is now my go-to for home decor.`,
      verified: true,
    },
  ];

  const relatedProducts: RelatedProduct[] = [
    {
      id: 'rp1',
      name: 'Modern Wall Clock - Gold Finish',
      image: '/assets/images/products/clocks/clock-1.jpg',
      alt: 'Elegant modern wall clock with gold metal frame',
      price: 999,
      originalPrice: 1299,
      rating: 4.6,
      category: 'Clocks',
    },
    {
      id: 'rp2',
      name: 'Luxury Gift Hamper - Premium Edition',
      image: '/assets/images/products/gifts/gift-1.jpg',
      alt: 'Premium gift hamper with luxury items',
      price: 1999,
      originalPrice: 2499,
      rating: 4.4,
      category: 'Gift Items',
    },
    {
      id: 'rp3',
      name: 'Modern Ceramic Vase - Set of 2',
      image: '/assets/images/products/vases/vase-1.jpg',
      alt: 'Elegant modern ceramic vases with matte finish',
      price: 999,
      originalPrice: 1299,
      rating: 4.7,
      category: 'Vases',
    },
    {
      id: 'rp4',
      name: 'Premium Snake Plant - Sansevieria',
      image: '/assets/images/products/plants/plant-1.jpg',
      alt: 'Beautiful snake plant in ceramic pot',
      price: 449,
      originalPrice: 599,
      rating: 4.5,
      category: 'Indoor Plants',
    },
  ];

  const pricingTiers: PricingTier[] = [
    { minQty: 10, maxQty: 49, pricePerUnit: 249, discount: 0 },
    { minQty: 50, maxQty: 99, pricePerUnit: 229, discount: 8 },
    { minQty: 100, maxQty: 249, pricePerUnit: 209, discount: 16 },
    { minQty: 250, maxQty: null, pricePerUnit: 189, discount: 24 },
  ];

  useEffect(() => {
    if (isHydrated && productVariants.length > 0) {
      const firstVariant = productVariants[0];
      if (firstVariant) {
        setSelectedVariant(firstVariant);
      }
      
      // Get all variant images
      let dbVariants = [];
      if (Array.isArray(product?.variants)) {
        dbVariants = product.variants;
      } else if (typeof product?.variants === 'string') {
        try {
          dbVariants = JSON.parse(product.variants);
        } catch (e) {
          console.warn('Failed to parse variants for images:', e);
          dbVariants = [];
        }
      }
      const allImages: ProductImage[] = [];
      
      dbVariants.forEach((v: any, variantIndex: number) => {
        if (v.images && v.images.length > 0) {
          v.images.forEach((url: string, imageIndex: number) => {
            allImages.push({
              id: `variant-${variantIndex}-${imageIndex}`,
              url,
              alt: `${product?.name} - ${v.color?.name || 'Color'} ${v.size}`,
              colorVariant: v.color?.name || 'Default',
            });
          });
        }
      });
      
      if (allImages.length === 0) {
        let images = [];
        if (Array.isArray(product?.product_images)) {
          images = product.product_images;
        } else if (typeof product?.product_images === 'string') {
          try {
            images = JSON.parse(product.product_images);
          } catch (e) {
            console.warn('Failed to parse product images for fallback:', e);
            images = [];
          }
        }
        const defaultImages = images.map((url: string, index: number) => ({
          id: (index + 1).toString(),
          url,
          alt: product?.description || product?.name,
        }));
        setCurrentImages(defaultImages);
        setAllVariantImages(defaultImages);
      } else {
        if (allImages.length > 0) {
          setCurrentImages([allImages[0]!]);
        }
        setAllVariantImages(allImages);
      }
    }
  }, [isHydrated, productVariants, product]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    
    // Find variant-specific images from the product's variants data
    let productVariants: Array<{ size?: string; color?: { code?: string }; images?: unknown[] }> = [];
    if (Array.isArray(product.variants)) {
      productVariants = product.variants;
    } else if (typeof product.variants === 'string') {
      try {
        const parsedVariants = JSON.parse(product.variants);
        productVariants = Array.isArray(parsedVariants) ? parsedVariants : [];
      } catch (e) {
        console.warn('Failed to parse variants for variant change:', e);
        productVariants = [];
      }
    }
    const matchingVariant = productVariants.find((v: any) => 
      v.color?.code === variant.colorHex && v.size === variant.size
    );

    const variantImages = (Array.isArray(matchingVariant?.images) ? matchingVariant.images : [])
      .filter((url): url is string => typeof url === 'string')
      .map((url: string, index: number) => ({
        id: `variant-${index + 1}`,
        url,
        alt: `${product.name} - ${variant.color} ${variant.size}`,
        colorVariant: variant.color,
      }));

    if (variantImages.length > 0) {
      // Use variant-specific images
      setCurrentImages(variantImages);
    } else {
      // Fallback to default product images
      let images: unknown[] = [];
      if (Array.isArray(product.product_images)) {
        images = product.product_images;
      } else if (typeof product.product_images === 'string') {
        try {
          const parsedImages = JSON.parse(product.product_images);
          images = Array.isArray(parsedImages) ? parsedImages : [];
        } catch (e) {
          console.warn('Failed to parse product images for fallback:', e);
          images = [];
        }
      }
      const defaultImages = images
        .filter((url): url is string => typeof url === 'string')
        .map((url: string, index: number) => ({
        id: (index + 1).toString(),
        url,
        alt: product.description || product.name,
      }));
      setCurrentImages(defaultImages);
    }
  };

  const handleAddToCart = (_quantity: number) => {
    if (!isHydrated) return;
    alert(`Added ${_quantity} items to cart!`);
  };

  const handleBuyNow = (_quantity: number) => {
    if (!isHydrated) return;
    router.push('/checkout-process');
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="text-center text-[#7A7A7A]">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="text-center text-[#7A7A7A]">Product not found</div>
      </div>
    );
  }

  if (!isHydrated || !selectedVariant) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-square animate-pulse rounded-xl bg-[#F0EDEA]" />
          <div className="space-y-6">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-[#F0EDEA]" />
            <div className="h-6 w-1/2 animate-pulse rounded-lg bg-[#F0EDEA]" />
            <div className="h-16 w-2/3 animate-pulse rounded-lg bg-[#F0EDEA]" />
            <div className="space-y-3">
              <div className="h-12 w-full animate-pulse rounded-lg bg-[#F0EDEA]" />
              <div className="h-12 w-full animate-pulse rounded-lg bg-[#F0EDEA]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="space-y-16">
        {/* Main Product Section */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <ProductImageGallery
              images={currentImages}
              allVariantImages={allVariantImages}
              productName={product.name}
            />
          </div>
          <div className="order-1 lg:order-2">
            <ProductInfo
              productName={product.name}
              category={product.category}
              rating={4.7}
              reviewCount={1247}
              variants={productVariants}
              selectedVariant={selectedVariant}
              currentImage={currentImages[0]?.url || ''}
              onVariantChange={handleVariantChange}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              packingStandard={product.packing_standard}
            />
          </div>
        </div>

        {/* Bulk Pricing Calculator */}
        <div className="rounded-xl bg-gradient-to-r from-[#F5F0EB] to-[#FAFAFA] p-8 border border-[#E8E4E0]">
          <BulkPricingCalculator
            pricingTiers={pricingTiers}
            basePrice={selectedVariant.price}
          />
        </div>

        {/* Product Details Tabs */}
        <div className="rounded-xl border border-[#E8E4E0] bg-white shadow-sm">
          <ProductTabs
            productId={Number(product.id)}
            specifications={specifications}
            careInstructions={careInstructions}
            warrantyInfo={warrantyInfo}
            reviews={reviews}
            relatedProducts={relatedProducts}
          />
        </div>

        {/* Related Products */}
        <div>
          <RelatedProducts slug={product.slug} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsInteractive;