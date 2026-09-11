'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuGroups = [
    {
      groupName: 'DASHBOARD',
      items: [
        { title: 'Dashboard', icon: 'ChartBarIcon', href: '/admin-dashboard' },
        { title: 'Profile', icon: 'UserIcon', href: '/admin-dashboard/profile' },
      ],
    },
    {
      groupName: 'CUSTOMERS',
      items: [
        { title: 'Users', icon: 'UsersIcon', href: '/admin-dashboard/users' },
        { title: 'Inquiries', icon: 'ChatBubbleLeftRightIcon', href: '/admin-dashboard/inquiries' },
        { title: 'Contact Us', icon: 'EnvelopeIcon', href: '/admin-dashboard/contact' },
        { title: 'Notifications', icon: 'BellIcon', href: '/admin-dashboard/notifications' },
      ],
    },
    {
      groupName: 'PRODUCTS',
      items: [
        { title: 'Add Product', icon: 'PlusCircleIcon', href: '/admin-dashboard/addProduct' },
        ...(user?.role === 'admin' ? [
          { title: 'Bulk Upload', icon: 'CloudArrowUpIcon', href: '/admin-dashboard/bulk-upload' }
        ] : []),
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

  // If user is not admin, redirect or show limited view
  if (user?.role !== 'admin') {
    return (
      <aside className="w-64 bg-white border-r border-border h-[calc(100vh-64px)] sticky top-16 shadow-elevation-1 hidden lg:block flex-shrink-0">
        <div className="p-6 text-center">
          <p className="text-red-600">Access Denied. Admin only.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-border h-[calc(100vh-64px)] sticky top-16 shadow-elevation-1 hidden lg:block flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="BuildingStorefrontIcon" size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-espresso font-heading">Admin Panel</h2>
            <p className="text-xs text-mocha-grey font-medium">Decor Vault</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="h-[calc(100vh-220px)] overflow-y-auto scrollbar-hide">
        <nav className="p-3 space-y-6 pb-4">
          {menuGroups.map((group) => (
            <div key={group.groupName} className="space-y-2">
              <h3 className="px-2 text-[10px] font-bold text-mocha-grey/70 tracking-widest uppercase">
                {group.groupName}
              </h3>
              <div className="space-y-1">
                {group.items.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 relative ${isActive
                        ? 'bg-primary text-primary-foreground shadow-elevation-1'
                        : 'text-mocha-grey hover:bg-soft-linen hover:text-espresso hover:shadow-elevation-1'
                        }`}
                    >
                      {isActive && (
                        <div className="absolute -left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full" />
                      )}
                      <div
                        className={`p-1 rounded-md transition-colors ${isActive ? 'bg-primary-foreground/20' : 'group-hover:bg-primary/10'
                          }`}
                      >
                        <Icon name={item.icon as any} size={14} />
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
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border bg-white">
        <button
          onClick={() => logout()}
          className="flex items-center space-x-2 w-full px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-elevation-1 group"
        >
          <div className="p-1 rounded-md group-hover:bg-red-100 transition-colors">
            <Icon name="ArrowLeftOnRectangleIcon" size={14} />
          </div>
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;