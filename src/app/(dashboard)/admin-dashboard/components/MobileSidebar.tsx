'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/features/auth/hooks/useAuth';

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuGroups = [
    {
      groupName: 'OVERVIEW',
      items: [
        { title: 'Dashboard', icon: 'ChartBarIcon', href: '/admin-dashboard' },
        {
          title: 'Analytics',
          icon: 'PresentationChartLineIcon',
          href: '/admin-dashboard/analytics',
        },
      ],
    },
    {
      groupName: 'CUSTOMERS',
      items: [
        { title: 'Users', icon: 'UsersIcon', href: '/admin-dashboard/users' },
        { title: 'Inquiries', icon: 'ChatBubbleLeftRightIcon', href: '/admin-dashboard/inquiries' },
        { title: 'Notifications', icon: 'BellIcon', href: '/admin-dashboard/notifications' },
      ],
    },
    {
      groupName: 'PRODUCTS',
      items: [
        { title: 'Add Product', icon: 'PlusCircleIcon', href: '/admin-dashboard/addProduct' },
        { title: 'Products', icon: 'ArchiveBoxIcon', href: '/admin-dashboard/products' },
        { title: 'Inventory', icon: 'RectangleStackIcon', href: '/admin-dashboard/inventory' },
        { title: 'Categories', icon: 'TableCellsIcon', href: '/admin-dashboard/categories' },
        { title: 'Brands', icon: 'TagIcon', href: '/admin-dashboard/brands' },
      ],
    },
    {
      groupName: 'CONTENT',
      items: [
        { title: 'Blog', icon: 'DocumentTextIcon', href: '/admin-dashboard/blog' },
        { title: 'Content', icon: 'NewspaperIcon', href: '/admin-dashboard/content' },
      ],
    },
    {
      groupName: 'ORDERS & SALES',
      items: [
        { title: 'Orders', icon: 'ShoppingBagIcon', href: '/admin-dashboard/orders' },
        { title: 'Revenue', icon: 'CurrencyDollarIcon', href: '/admin-dashboard/revenue' },
        { title: 'Return', icon: 'ArrowUturnLeftIcon', href: '/admin-dashboard/return' },
        { title: 'Coupons', icon: 'TicketIcon', href: '/admin-dashboard/coupons' },
        { title: 'Subscribe', icon: 'CreditCardIcon', href: '/admin-dashboard/subscription' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-elevation-2 border border-border"
      >
        <Icon name="Bars3Icon" size={20} className="text-espresso" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-border shadow-elevation-3 z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="BuildingStorefrontIcon" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-espresso font-heading">Admin Panel</h2>
                <p className="text-xs text-mocha-grey font-medium">Decor Vault Management</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-soft-linen rounded-lg transition-colors"
            >
              <Icon name="XMarkIcon" size={20} className="text-mocha-grey" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
          <nav className="p-4 space-y-8">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                <h3 className="px-3 text-[10px] font-bold text-mocha-grey/70 tracking-widest uppercase">
                  {group.groupName}
                </h3>
                <div className="space-y-1">
                  {group.items.map(item => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 relative ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-elevation-2'
                            : 'text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
                        )}
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive ? 'bg-primary-foreground/20' : 'group-hover:bg-primary/10'
                          }`}
                        >
                          <Icon name={item.icon as any} size={16} />
                        </div>
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white">
          <button
            onClick={() => logout()}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-elevation-1 group"
          >
            <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-colors">
              <Icon name="ArrowLeftOnRectangleIcon" size={16} />
            </div>
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
