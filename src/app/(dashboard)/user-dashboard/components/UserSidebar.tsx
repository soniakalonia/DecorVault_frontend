'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGetUserUnreadCountQuery } from '@/store/api/userNotificationApi';

const UserSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { data: unreadData } = useGetUserUnreadCountQuery();

  const menuGroups = [
    {
      groupName: 'DASHBOARD',
      items: [
        { title: 'Dashboard', icon: 'ChartBarIcon', href: '/user-dashboard' },
      ],
    },
    {
      groupName: 'MY ORDERS',
      items: [
        { title: 'All Orders', icon: 'ShoppingBagIcon', href: '/user-dashboard/orders' },
        { title: 'Bulk Inquiries', icon: 'ChatBubbleLeftRightIcon', href: '/user-dashboard/bulk-inquiries' },
      ],
    },
    {
      groupName: 'ACCOUNT SETTINGS',
      items: [
        { title: 'Profile Information', icon: 'UserIcon', href: '/user-dashboard/profile' },
        { title: 'GST Information', icon: 'DocumentTextIcon', href: '/user-dashboard/gst-info' },
        { title: 'Manage Addresses', icon: 'MapPinIcon', href: '/user-dashboard/addresses' },
      ],
    },
    {
      groupName: 'PAYMENTS',
      items: [
        { title: 'Saved Cards', icon: 'CreditCardIcon', href: '/user-dashboard/saved-cards' },
      ],
    },
    {
      groupName: 'MY STUFF',
      items: [
        { title: 'My Coupons', icon: 'TicketIcon', href: '/user-dashboard/coupons' },
        { title: 'My Reviews & Ratings', icon: 'StarIcon', href: '/user-dashboard/reviews' },
        { title: 'All Notifications', icon: 'BellIcon', href: '/user-dashboard/notifications', badge: unreadData?.count },
        { title: 'My Wishlist', icon: 'HeartIcon', href: '/user-dashboard/wishlist' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 shadow-elevation-1 hidden lg:block flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="UserCircleIcon" size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-espresso font-heading">My Account</h2>
            <p className="text-xs text-mocha-grey font-medium">Decor Vault</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
        <nav className="p-3 space-y-6">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
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
                      <span className="text-sm font-medium flex-1">{item.title}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
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

export default UserSidebar;
