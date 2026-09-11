'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

const EnhancedHeader = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const { itemCount, toggleCart } = useCart();

  const navigationItems: NavigationItem[] = [
    { label: 'Home', path: '/', icon: 'HomeIcon' },
    { label: 'Products', path: '/products', icon: 'ShoppingBagIcon' },
    { label: 'Cart', path: '/shopping-cart', icon: 'ShoppingCartIcon' },
    { label: 'Checkout', path: '/checkout-process', icon: 'CreditCardIcon' },
  ];

  // Add My Account only if authenticated
  if (user) {
    navigationItems.push({ label: 'My Account', path: '/dashboard', icon: 'UserCircleIcon' });
  }

  const isActivePath = (path: string) => pathname === path;

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
      <div className="mx-auto w-full px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-smooth hover:opacity-80"
            onClick={closeMobileMenu}
          >
            <img
              src="/assets/images/logo.png"
              alt="Decor Vault Logo"
              width="40"
              height="40"
              className="transition-smooth"
            />
            <span className="font-heading text-xl font-semibold text-foreground">
              Decor Vault
            </span>
          </Link>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-md border border-border bg-background px-4 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Icon
                name="MagnifyingGlassIcon"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {/* Right Section - Navigation, Cart, User Menu */}
          <div className="flex items-center space-x-3">
            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-1 md:flex">
              {navigationItems.map((item) => (
                <Link
                  key={`desktop-${item.path}`}
                  href={item.path}
                  className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-smooth hover:bg-muted ${isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground'
                    }`}
                >
                  <Icon name={item.icon as any} size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Search Button */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-smooth hover:bg-muted md:hidden"
              aria-label="Search products"
            >
              <Icon name="MagnifyingGlassIcon" size={20} />
            </button>

            {/* Login Link for Guests */}
            {!user && (
              <Link
                href="/login"
                className="text-sm font-medium text-foreground hover:text-primary transition-smooth px-2"
              >
                Login
              </Link>
            )}

            {/* Cart Button with Count */}
            <button
              onClick={toggleCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-smooth hover:bg-muted"
              aria-label="Shopping cart"
            >
              <Icon name="ShoppingCartIcon" size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Menu - Only if logged in */}
            {user && (
              <div className="relative">
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
                          {`Welcome, ${user?.fullName}`}
                        </p>
                        <p className="caption text-muted-foreground">
                          Manage your account
                        </p>
                      </div>
                      <div className="border-t border-border">
                        <Link
                          href="/dashboard"
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
                          className="w-full rounded-md bg-destructive text-white px-4 py-2 text-sm font-medium transition-smooth hover:scale-[0.97]"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
          <nav className="fixed left-0 top-16 z-[300] h-[calc(100vh-4rem)] w-64 overflow-y-auto bg-card shadow-elevation-4 md:hidden">
            <div className="space-y-1 p-4">
              {navigationItems.map((item) => (
                <Link
                  key={`mobile-${item.path}`}
                  href={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium transition-smooth ${isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                    }`}
                >
                  <Icon name={item.icon as any} size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default EnhancedHeader;



