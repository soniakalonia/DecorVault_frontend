'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';

const Header = () => {
  const pathname = usePathname();
  const { items } = useCart();
  const { isAuthenticated, user, logout: authLogout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const userName = user?.fullName || user?.email || 'User';

  const isAdminPage = pathname?.startsWith('/admin-dashboard');
  const isUserPage = pathname?.startsWith('/user-dashboard');

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    authLogout();
    setIsUserMenuOpen(false);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/categories', label: 'Shop by Categories' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // Helper to compare paths robustly
  const isActiveLink = (href: string) => {
    if (!isMounted) return false;
    const normalize = (str: string) => str.replace(/\/$/, '') || '/';
    const current = normalize(pathname || '');
    const link = normalize(href);
    if (link === '/') return current === '/';
    return current === link || current.startsWith(link + '/');
  };

  // Admin Page
  if (isAdminPage) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-border h-16">
        <div className="container mx-auto px-4 flex items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-[#D4AF37]">
              <Image
                src="/assets/images/logo.png"
                alt="DecorVault"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-heading text-lg font-bold text-[#1A1A2E]">
              Decor<span className="text-[#D4AF37]">Vault</span>
            </span>
          </Link>
        </div>
      </header>
    );
  }

  // User Page
  if (isUserPage) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-border h-16">
        <div className="container mx-auto px-4 flex items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-[#D4AF37]">
              <Image
                src="/assets/images/logo.png"
                alt="DecorVault"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-heading text-lg font-bold text-[#1A1A2E]">
              Decor<span className="text-[#D4AF37]">Vault</span>
            </span>
          </Link>
        </div>
      </header>
    );
  }

  // Normal Pages
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm' 
        : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm flex-shrink-0 bg-white">
              <Image
                src="/assets/images/logo.png"
                alt="DecorVault"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <span className="font-heading text-lg font-bold text-[#1A1A2E] md:text-xl hidden sm:block">
              Decor<span className="text-[#D4AF37]">Vault</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-smooth hover:text-[#D4AF37] ${
                  isActiveLink(link.href) ? 'text-[#D4AF37]' : 'text-[#1A1A2E]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="px-3 py-1.5 text-sm border border-[#E8E4E0] rounded-full focus:outline-none focus:border-[#D4AF37] transition-colors w-40 lg:w-56"
              />
            </div>

            <Link 
              href="/wishlist" 
              className="p-2 rounded-full hover:bg-[#F0EDEA] transition-smooth"
              aria-label="Wishlist"
            >
              <Icon name="HeartIcon" size={20} className="text-[#1A1A2E]" />
            </Link>

            <Link 
              href="/cart" 
              className="relative p-2 rounded-full hover:bg-[#F0EDEA] transition-smooth"
              aria-label="Cart"
            >
              <Icon name="ShoppingBagIcon" size={20} className="text-[#1A1A2E]" />
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[#1A1A2E] text-xs font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {isMounted ? (
              isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-[#F0EDEA] transition-smooth"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1A1A2E] font-semibold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E8E4E0] py-1 z-50">
                      <Link 
                        href={user?.role === 'admin' ? '/admin-dashboard/profile' : '/user-dashboard/profile'}
                        className="block px-4 py-2 text-sm text-[#1A1A2E] hover:bg-[#F0EDEA] transition-smooth"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link 
                        href="/user-dashboard/orders" 
                        className="block px-4 py-2 text-sm text-[#1A1A2E] hover:bg-[#F0EDEA] transition-smooth"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-[#E74C3C] hover:bg-[#F0EDEA] transition-smooth"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A1A2E] border border-[#1A1A2E] rounded-full hover:bg-[#1A1A2E] hover:text-white transition-all duration-300"
                >
                  <Icon name="UserIcon" size={16} />
                  <span>Sign In</span>
                </Link>
              )
            ) : (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A1A2E] border border-[#1A1A2E] rounded-full">
                <Icon name="UserIcon" size={16} />
                <span>Sign In</span>
              </div>
            )}

            {!isAdminPage && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 lg:hidden rounded-md hover:bg-[#F0EDEA] transition-smooth"
                aria-label="Toggle menu"
              >
                <Icon name="Bars3Icon" size={24} className="text-[#1A1A2E]" />
              </button>
            )}
          </div>
        </div>

        {!isAdminPage && isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E4E0] py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm font-medium transition-smooth ${
                  isActiveLink(link.href) ? 'text-[#D4AF37]' : 'text-[#1A1A2E]'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#E8E4E0]">
              {isMounted && isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-[#E74C3C] transition-smooth"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block text-sm font-medium text-[#D4AF37] transition-smooth"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;