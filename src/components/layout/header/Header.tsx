'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { memo, useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { config } from '@/config/env';

const navigationLinks = [
  { label: 'Home', path: '/', icon: 'HomeIcon' },
  { label: 'Products', path: '/products', icon: 'ShoppingBagIcon' },
];

const navigationLinksEnd = [
  { label: 'Blog', path: '/blog', icon: 'DocumentTextIcon' },
  { label: 'About Us', path: '/about', icon: 'InformationCircleIcon' },
  { label: 'Contact Us', path: '/contact', icon: 'PhoneIcon' },
];

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('container')) return 'ArchiveBoxIcon';
  if (n.includes('dustbin')) return 'TrashIcon';
  if (n.includes('mug')) return 'BeakerIcon';
  if (n.includes('bucket')) return 'ArchiveBoxIcon';
  if (n.includes('gamla')) return 'HomeIcon';
  return 'TagIcon';
};

const Header = memo(() => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/categories`);
        const data = await res.json();
        const activeCategories = (data.categories || []).filter((c: any) => c.status === 'active');
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchCategoryProducts = async (slug: string, categoryName: string) => {
    if (categoryProducts[slug]) return;
    try {
      const res = await fetch(`${config.apiUrl}/products`);
      const data = await res.json();
      const filtered = (data.data || []).filter((p: any) => {
        const productCategory = p.category?.toLowerCase() || '';
        const searchName = categoryName.toLowerCase();
        return productCategory.includes(searchName) && p.status === 'active';
      }).slice(0, 8);
      setCategoryProducts(prev => ({ ...prev, [slug]: filtered }));
    } catch (error) {
      console.error('Error fetching products:', error);
      setCategoryProducts(prev => ({ ...prev, [slug]: [] }));
    }
  };

  return (
    <div className="w-full bg-card border-b border-border hidden lg:block">
      <nav className="w-full">
        <div className="flex items-center justify-center space-x-1 py-2 px-1">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center space-x-1 sm:space-x-2 rounded-md px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'
                  }`}
              >
                <Icon name={link.icon as any} size={16} className="sm:size-5" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => {
                setHoveredCategory(category.slug);
                fetchCategoryProducts(category.slug, category.name);
              }}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                href={`/products/${category.slug}`}
                className="flex items-center space-x-1 sm:space-x-2 rounded-md px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap text-foreground"
              >
                <Icon name={getCategoryIcon(category.name) as any} size={16} className="sm:size-5" />
                <span className="hidden sm:inline">{category.name}</span>
              </Link>
              {hoveredCategory === category.slug && categoryProducts[category.slug] && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 pt-1">
                  <div className="rounded-md bg-popover shadow-lg border border-border p-4 min-w-[600px]">
                    <h3 className="text-sm font-semibold mb-3 text-center">{category.name} Products</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryProducts[category.slug].map((product: any) => {
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
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="flex items-center gap-3 p-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                          >
                            <Image
                              src={productImages[0] || '/placeholder.png'}
                              alt={product.name}
                              width={32}
                              height={32}
                              className="object-cover rounded flex-shrink-0"
                            />
                            <span className="text-xs flex-1">{product.name}</span>
                          </Link>
                        );
                      })}
                      {categoryProducts[category.slug].length === 0 && (
                        <p className="text-sm text-muted-foreground px-2 py-1 col-span-2 text-center">No products available</p>
                      )}
                    </div>
                    <Link
                      href={`/products/${category.slug}`}
                      className="block mt-3 pt-3 border-t text-xs text-primary hover:underline text-center"
                    >
                      View all {category.name} →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
          {navigationLinksEnd.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center space-x-1 sm:space-x-2 rounded-md px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'
                  }`}
              >
                <Icon name={link.icon as any} size={16} className="sm:size-5" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
