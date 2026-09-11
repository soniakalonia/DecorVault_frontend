'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGetProductsQuery } from '@/store/api/productsApi';
import type { RootState } from '@/store/store';

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const cartItemCount = useSelector((state: RootState) => state.cart.itemCount);
  const wishlistItemCount = useSelector((state: RootState) => state.wishlist.items.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const { data: productsData } = useGetProductsQuery({ limit: 1000 });

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !productsData?.data) return [];
    const q = searchQuery.toLowerCase();
    return productsData.data
      .filter((p: any) =>
        p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery, productsData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-card shadow-elevation-2 transition-smooth">
      <div className="mx-auto w-full">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo - DecorVault */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-smooth hover:opacity-80"
            onClick={closeMobileMenu}
          >
            {/* Gold Diamond with DV */}
            <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[#1A1A2E] font-heading text-sm font-bold">DV</span>
            </div>
            <span className="hidden sm:block font-heading text-xl font-bold text-[#1A1A2E]">
              Decor<span className="text-[#D4AF37]">Vault</span>
            </span>
          </Link>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form
              className="relative w-full max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setShowDropdown(false);
                  router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(e.target.value.trim().length > 0);
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                placeholder="Search products..."
                className="w-full rounded-md border border-border bg-background px-4 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Icon
                name="MagnifyingGlassIcon"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-[200] mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
                  {searchResults.map((product: any) => {
                    let img = '';
                    try {
                      const imgs = typeof product.product_images === 'string' ? JSON.parse(product.product_images) : product.product_images;
                      img = Array.isArray(imgs) ? imgs[0] : '';
                    } catch { img = ''; }
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onMouseDown={() => {
                          setSearchQuery(product.name);
                          setShowDropdown(false);
                          router.push(`/product/${product.slug}`);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
                      >
                        {img && (
                          <Image src={img} alt={product.name} width={32} height={32} className="rounded object-cover flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <span className="ml-auto text-xs font-semibold text-primary">
                          ₹{product.discount_price || product.price}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    type="submit"
                    className="w-full border-t border-border px-4 py-2 text-center text-xs text-primary hover:bg-muted"
                  >
                    See all results for "{searchQuery}"
                  </button>
                </div>
              )}
              {showDropdown && searchQuery.trim().length > 0 && searchResults.length === 0 && (
                <div className="absolute left-0 right-0 top-full z-[200] mt-1 rounded-md border border-border bg-popover px-4 py-3 text-sm text-muted-foreground shadow-lg">
                  No products found
                </div>
              )}
            </form>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center space-x-3">
            {/* Login Link for Guests - Only show after hydration */}
            {isHydrated && !user && (
              <Link
                href="/auth/login"
                className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-smooth px-2"
              >
                Login
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden md:flex relative h-10 w-10 items-center justify-center rounded-md text-foreground transition-smooth hover:bg-muted"
              aria-label="Wishlist"
            >
              <Icon name="HeartIcon" size={20} />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href={isHydrated && user ? '/shopping-cart' : '/auth/login'}
              className="hidden md:flex relative h-10 w-10 items-center justify-center rounded-md text-foreground transition-smooth hover:bg-muted"
              aria-label="Shopping cart"
            >
              <Icon name="ShoppingCartIcon" size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Search Button */}
            <button
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-smooth hover:bg-muted"
              aria-label="Search products"
            >
              <Icon name="MagnifyingGlassIcon" size={20} />
            </button>

            {/* User Menu - Only for Logged In Users */}
            {isHydrated && user && (
              <div className="relative hidden md:block">
                <button
                  onClick={toggleUserMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-smooth hover:bg-muted"
                  aria-label="User menu"
                >
                  <Icon name="UserCircleIcon" size={24} />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[150]"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-[200] mt-2 w-56 rounded-md bg-popover shadow-elevation-3 transition-smooth">
                      <div className="p-4">
                        <p className="text-sm font-medium text-popover-foreground">
                          {`Hi, ${user.fullName?.split(' ')[0] || 'User'}`}
                        </p>
                        <p className="caption text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="border-t border-border">
                        <Link
                          href={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-popover-foreground transition-smooth hover:bg-muted"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Icon name="UserIcon" size={18} />
                          <span>My Dashboard</span>
                        </Link>
                        <Link
                          href="/order-tracking"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-popover-foreground transition-smooth hover:bg-muted"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Icon name="TruckIcon" size={18} />
                          <span>Track Orders</span>
                        </Link>
                      </div>
                      <div className="border-t border-border p-3">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full rounded-md bg-error text-white px-4 py-2 text-sm font-medium transition-smooth hover:scale-[0.97]"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Login Button - Only for guests */}
            {isHydrated && !user && (
              <Link
                href="/auth/login"
                className="md:hidden text-sm font-medium text-foreground hover:text-primary transition-smooth px-2"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-smooth hover:bg-muted md:hidden"
              aria-label="Toggle menu"
            >
              <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[250] bg-black/50 md:hidden"
            onClick={closeMobileMenu}
          />
          <nav className="fixed left-0 top-0 z-[300] h-screen w-56 overflow-y-auto bg-card shadow-elevation-4 md:hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-heading text-lg font-bold text-[#1A1A2E]">
                Decor<span className="text-[#D4AF37]">Vault</span>
              </span>
              <button onClick={closeMobileMenu} className="flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-muted">
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>
            <div className="space-y-1 p-3">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                <Icon name="HomeIcon" size={20} />
                <span>Home</span>
              </Link>
              <Link href="/products" onClick={closeMobileMenu} className="flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                <Icon name="ShoppingBagIcon" size={20} />
                <span>Products</span>
              </Link>
              <Link href="/blog" onClick={closeMobileMenu} className="flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                <Icon name="DocumentTextIcon" size={20} />
                <span>Blog</span>
              </Link>
              <Link href="/about" onClick={closeMobileMenu} className="flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                <Icon name="InformationCircleIcon" size={20} />
                <span>About Us</span>
              </Link>
              <Link href="/contact" onClick={closeMobileMenu} className="flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                <Icon name="PhoneIcon" size={20} />
                <span>Contact Us</span>
              </Link>
              <Link href="/shopping-cart" onClick={closeMobileMenu} className="flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                <Icon name="ShoppingCartIcon" size={20} />
                <span>Cart</span>
              </Link>
              <Link href="/wishlist" onClick={closeMobileMenu} className="flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                <Icon name="HeartIcon" size={20} />
                <span>Wishlist</span>
              </Link>
              {isHydrated && user && (
                <Link href={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} onClick={closeMobileMenu} className="flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                  <Icon name="UserIcon" size={20} />
                  <span>Dashboard</span>
                </Link>
              )}
              <Link href="/order-tracking" onClick={closeMobileMenu} className="flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
                <Icon name="TruckIcon" size={20} />
                <span>Track Orders</span>
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Navbar;