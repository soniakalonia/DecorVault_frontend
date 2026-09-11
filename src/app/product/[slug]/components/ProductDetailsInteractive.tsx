'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addItem, setItem } from '@/store/slices/cart';
import { useAddToCartMutation } from '@/store/api/cartApi';
import { toast } from 'react-toastify';
import { useGetProductBySlugQuery } from '@/store/api/productsApi';
import ProductImageGallery from '../../../product-details/components/ProductImageGallery';
import ProductInfo from '../../../product-details/components/ProductInfo';
import ProductTabs from '../../../product-details/components/ProductTabs';
import RelatedProducts from '../../../product-details/components/RelatedProducts';
import LoginPromptModal from '@/components/common/LoginPromptModal';

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

const ProductDetailsInteractive = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const slug = params.slug as string;
  const { data: productData, isLoading } = useGetProductBySlugQuery(slug);
  const [addToCartApi] = useAddToCartMutation();
  const [isAdding, setIsAdding] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [currentImages, setCurrentImages] = useState<ProductImage[]>([]);
  const [allVariantImages, setAllVariantImages] = useState<ProductImage[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  };

  useEffect(() => {
    setIsHydrated(true);
    if (slug && productData?.data) {
      const foundProduct = productData.data;
      if (foundProduct) {
        setProduct(foundProduct);
        let images: any[] = [];
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

        let dbVariants: any[] = [];
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
        } else {
          const defaultVariant: ProductVariant = {
            id: 'default',
            size: foundProduct.sizes?.[0] || 'Standard',
            color: foundProduct.colors?.[0] || 'Default',
            colorHex: '#000000',
            capacity: foundProduct.weight ? `${foundProduct.weight}kg` : 'N/A',
            price: Number(foundProduct.discount_price || foundProduct.price),
            originalPrice: Number(foundProduct.price),
            stock: foundProduct.stock_quantity || 0,
            minOrderQty: 1,
          };
          setSelectedVariant(defaultVariant);
          setProductVariants([defaultVariant]);
        }
      }
    }
  }, [isHydrated, slug, productData]);

  const specifications: Specification[] = product ? [
    { label: 'Material', value: product.materials || 'N/A' },
    { label: 'Brand', value: product.brand || 'N/A' },
    { label: 'Weight', value: product.weight ? `${product.weight}kg` : 'N/A' },
    { label: 'Warranty', value: product.warranty || 'N/A' },
    { label: 'Category', value: product.category || 'N/A' },
    {
      label: 'Sizes', value: (() => {
        try {
          return JSON.parse(product.sizes || '[]').join(', ') || 'N/A';
        } catch (e) {
          return 'N/A';
        }
      })()
    },
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
      comment: `Absolutely love this candle! The lavender fragrance is so soothing and calming. Perfect for my meditation space. The packaging was beautiful and it arrived in perfect condition. Will definitely order more!`,
      verified: true,
    },
    {
      id: 'r2',
      userName: 'Rajesh Kumar',
      rating: 4,
      date: '10 August 2026',
      comment: `Beautiful wall clock! The design is elegant and the silent movement is exactly what I needed for my bedroom. The gold finish looks premium. Would recommend to anyone looking for quality decor.`,
      verified: true,
    },
    {
      id: 'r3',
      userName: 'Anita Desai',
      rating: 5,
      date: '05 August 2026',
      comment: `The photo frame set is gorgeous! Perfect for my family wall. Excellent quality and the gold finish adds such elegance. Great value for money.`,
      verified: true,
    },
    {
      id: 'r4',
      userName: 'Vikram Singh',
      rating: 5,
      date: '28 July 2026',
      comment: `The gift hamper was a huge success at my sister's wedding! Everything from the candle to the chocolates was premium quality. Beautiful packaging and fast delivery. Highly recommend!`,
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

  useEffect(() => {
    if (isHydrated && productVariants.length > 0) {
      const firstVariant = productVariants[0];
      if (firstVariant) {
        setSelectedVariant(firstVariant);
      }

      let dbVariants: any[] = [];
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

      const variantImages: ProductImage[] = [];

      dbVariants.forEach((v: any, variantIndex: number) => {
        if (v.images && v.images.length > 0) {
          v.images.forEach((url: string, imageIndex: number) => {
            variantImages.push({
              id: `variant-${variantIndex}-${imageIndex}`,
              url,
              alt: `${product?.name} - ${v.color?.name || 'Color'} ${v.size}`,
              colorVariant: v.color?.name || 'Default',
            });
          });
        }
      });

      let productImages: any[] = [];
      if (Array.isArray(product?.product_images)) {
        productImages = product.product_images;
      } else if (typeof product?.product_images === 'string') {
        try {
          productImages = JSON.parse(product.product_images);
        } catch (e) {
          console.warn('Failed to parse product images:', e);
          productImages = [];
        }
      }

      const defaultImages = productImages.map((url: string, index: number) => ({
        id: `product-${index + 1}`,
        url,
        alt: product?.description || product?.name,
      }));

      const combinedImages = [...defaultImages, ...variantImages];

      if (combinedImages.length === 0) {
        setCurrentImages([]);
        setAllVariantImages([]);
      } else {
        setCurrentImages(combinedImages);
        setAllVariantImages(combinedImages);
      }
    }
  }, [isHydrated, productVariants, product]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);

    let variantData: any[] = [];
    if (Array.isArray(product.variants)) {
      variantData = product.variants;
    } else if (typeof product.variants === 'string') {
      try {
        variantData = JSON.parse(product.variants);
      } catch (e) {
        variantData = [];
      }
    }

    const matchingVariant = variantData.find((v: any) =>
      v.color?.code === variant.colorHex && v.size === variant.size
    );

    if (matchingVariant?.images?.length > 0) {
      const variantImages = matchingVariant.images.map((url: string, index: number) => ({
        id: `variant-${index + 1}`,
        url,
        alt: `${product.name} - ${variant.color} ${variant.size}`,
        colorVariant: variant.color,
      }));
      setCurrentImages(variantImages);
    }
  };

  const handleAddToCart = async (quantity: number) => {
    if (!product || !selectedVariant || isAdding) {
      toast.error('Please select a product variant');
      return;
    }

    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    setIsAdding(true);
    try {
      await addToCartApi({
        product_id: product.id,
        variant_id: selectedVariant.id !== 'default' ? selectedVariant.id : null,
        quantity,
      }).unwrap();

      const variantLabel = selectedVariant.id !== 'default'
        ? `${selectedVariant.color || ''} - ${selectedVariant.size || ''}`
        : undefined;

      dispatch(addItem({
        id: selectedVariant.id !== 'default' ? selectedVariant.id : product.id.toString(),
        productId: product.id.toString(),
        variantId: selectedVariant.id !== 'default' ? selectedVariant.id : undefined,
        name: product.name,
        price: selectedVariant.price,
        image: currentImages[0]?.url || '',
        quantity,
        variant: variantLabel,
      }));

      toast.success(`Added ${quantity} item(s) to cart!`, {
        autoClose: 350,
      });
    } catch (error: any) {
      console.error('Add to cart failed:', error);
      
      if (error?.status === 401 || error?.data?.message?.includes('Unauthorized') || error?.status === 403) {
        setShowLoginModal(true);
      } else if (error?.status === 400) {
        toast.error(error?.data?.message || 'Invalid request. Please try again.');
      } else if (error?.message?.includes('NetworkError') || error?.message?.includes('Failed to fetch')) {
        toast.error('Network error. Please check your connection.');
      } else {
        const variantLabel = selectedVariant.id !== 'default'
          ? `${selectedVariant.color || ''} - ${selectedVariant.size || ''}`
          : undefined;

        dispatch(addItem({
          id: selectedVariant.id !== 'default' ? selectedVariant.id : product.id.toString(),
          productId: product.id.toString(),
          variantId: selectedVariant.id !== 'default' ? selectedVariant.id : undefined,
          name: product.name,
          price: selectedVariant.price,
          image: currentImages[0]?.url || '',
          quantity,
          variant: variantLabel,
        }));
        toast.info('Item saved locally. Will sync when you login.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async (quantity: number) => {
    if (!product || !selectedVariant || isAdding) {
      toast.error('Please select a product variant');
      return;
    }

    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    const itemId = selectedVariant.id !== 'default' ? selectedVariant.id : product.id.toString();

    setIsAdding(true);
    try {
      await addToCartApi({
        product_id: product.id,
        variant_id: selectedVariant.id !== 'default' ? selectedVariant.id : null,
        quantity,
        replaceQuantity: true
      }).unwrap();

      const variantLabel = selectedVariant.id !== 'default'
        ? `${selectedVariant.color || ''} - ${selectedVariant.size || ''}`
        : undefined;

      dispatch(setItem({
        id: itemId,
        productId: product.id.toString(),
        variantId: selectedVariant.id !== 'default' ? selectedVariant.id : undefined,
        name: product.name,
        price: selectedVariant.price,
        image: currentImages[0]?.url || '',
        quantity,
        variant: variantLabel,
      }));
      
      router.push('/checkout-process');
    } catch (error: any) {
      console.error('Buy Now failed to sync:', error);
      
      if (error?.status === 401 || error?.data?.message?.includes('Unauthorized') || error?.status === 403) {
        setShowLoginModal(true);
        return;
      }

      const variantLabel = selectedVariant.id !== 'default'
        ? `${selectedVariant.color || ''} - ${selectedVariant.size || ''}`
        : undefined;

      dispatch(setItem({
        id: itemId,
        productId: product.id.toString(),
        variantId: selectedVariant.id !== 'default' ? selectedVariant.id : undefined,
        name: product.name,
        price: selectedVariant.price,
        image: currentImages[0]?.url || '',
        quantity,
        variant: variantLabel,
      }));
      
      toast.info('Item saved locally. Proceeding to checkout.');
      router.push('/checkout-process');
    } finally {
      setIsAdding(false);
    }
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
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-[#F0EDEA]" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-[#F0EDEA]" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-[#F0EDEA]" />
            <div className="h-12 w-1/3 animate-pulse rounded bg-[#F0EDEA]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Main Product Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductImageGallery
          images={currentImages}
          allVariantImages={allVariantImages}
          productName={product.name}
        />
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

      {/* Product Details Tabs */}
      <ProductTabs
        productId={product.id}
        specifications={specifications}
        careInstructions={careInstructions}
        warrantyInfo={warrantyInfo}
        reviews={reviews}
        relatedProducts={relatedProducts}
      />

      {/* Related Products */}
      <RelatedProducts slug={slug} />

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please login to add items to your cart"
      />
    </div>
  );
};

export default ProductDetailsInteractive;