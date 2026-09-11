'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeHeader from './WelcomeHeader';
import QuickActionCard from './QuickActionCard';
import OrderHistoryItem from './OrderHistoryItem';
import WishlistItem from './WishlistItem';
import AddressCard from './AddressCard';
import RecommendedProduct from './RecommendedProduct';
import ActivityFeedItem from './ActivityFeedItem';
import ProfileSection from './ProfileSection';
import Icon from '@/components/ui/AppIcon';
import AdminSidebar from '../../admin-dashboard/components/AdminSidebar';
import AdminDashboardView from '../../admin-dashboard/components/AdminDashboardView';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGetProfileQuery } from '@/store/api/authApi';
import { useGetUserOrdersQuery, useGetUserActivityQuery, useGetRecommendedProductsQuery, useGetUserAddressesQuery } from '@/store/api/orderApi';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/store/api/wishlistApi';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

const DashboardInteractive = () => {
  const router = useRouter();
  const { user: localUser, isAuthenticated } = useAuth();

  // Check if token exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const isLoggedIn = !!token && isAuthenticated;

  // Profile
  const { data: profileDataResponse, isLoading: profileLoading } = useGetProfileQuery(undefined, {
    skip: !isLoggedIn,
    refetchOnMountOrArgChange: true,
  });

  // Orders
  const { data: ordersData, isLoading: ordersLoading } = useGetUserOrdersQuery(undefined, {
    skip: !isLoggedIn,
  });

  // Wishlist
  const { data: wishlistData, isLoading: wishlistLoading } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn,
  });

  // Addresses
  const { data: addressesData, isLoading: addressesLoading } = useGetUserAddressesQuery(undefined, {
    skip: !isLoggedIn,
  });

  // Activity
  const { data: activityData, isLoading: activityLoading } = useGetUserActivityQuery(undefined, {
    skip: !isLoggedIn,
  });

  // Recommended Products - FIXED: Add error handling
  const {
    data: recommendedData,
    isLoading: recommendedLoading,
    error: recommendedError
  } = useGetRecommendedProductsQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>(
    'orders'
  );
  const [mounted, setMounted] = useState(false);

  const user = profileDataResponse?.user || localUser;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Log error if any
  useEffect(() => {
    if (recommendedError) {
    }
  }, [recommendedError]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (profileLoading || ordersLoading || wishlistLoading || addressesLoading || activityLoading || recommendedLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex gap-8 items-start">
        <AdminSidebar />
        <div className="flex-1">
          <AdminDashboardView />
        </div>
      </div>
    );
  }

  const userData = {
    name: user?.fullName || 'User',
    accountStatus: 'Premium Member',
    loyaltyPoints: 2450,
  };

  const orders = (ordersData?.orders || []).map((order: any) => {
    const images = order.product_images ? order.product_images.split('|||') : [];
    const names = order.product_names ? order.product_names.split(', ') : [];

    return {
      orderId: `ORD-${String(order.id).padStart(3, '0')}`,
      orderDate: new Date(order.created_at).toLocaleDateString('en-GB'),
      status: order.status === 'delivered' ? 'Delivered' : order.status === 'pending' ? 'Pending' : 'In Transit',
      statusColor: order.status === 'delivered' ? 'bg-success/10 text-success' : order.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent',
      totalAmount: order.total,
      products: names.map((name: string, idx: number) => ({
        id: String(idx),
        name,
        quantity: 1,
        image: images[idx] ? JSON.parse(images[idx])[0] : '',
        alt: name,
      })),
      trackingNumber: `TRK2026PM${order.id}`,
    };
  });

  const wishlistProducts = (wishlistData?.data || []).map((item: any) => ({
    id: String(item.id),
    name: item.name || '',
    price: item.discount_price || item.price || 0,
    originalPrice: item.price,
    image: item.product_images ? (typeof item.product_images === 'string' && item.product_images.startsWith('[') ? JSON.parse(item.product_images)[0] : item.product_images) : '',
    alt: item.name || '',
    inStock: true,
    category: 'General',
  }));

  const quickStats = {
    totalOrders: orders.length,
    activeOrders: orders.filter((o: any) => o.status === 'In Transit').length,
    wishlistItems: wishlistProducts.length,
  };

  const addresses = (addressesData?.addresses || []).map((addr: any) => ({
    id: String(addr.id),
    name: addr.name,
    addressLine1: addr.address_line1,
    addressLine2: addr.address_line2,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    phone: addr.phone,
    isDefault: Boolean(addr.is_default),
  }));

  // Recommended products - Only use if no error and data exists
  const recommendedProducts = (!recommendedError && recommendedData?.products)
    ? (recommendedData.products || []).map((product: any) => ({
      id: String(product.id),
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.product_images ? JSON.parse(product.product_images)[0] : '',
      alt: product.name,
      rating: 4.5,
      reviewCount: 0,
    }))
    : [];

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`;
  };

  const recentActivities = (activityData?.activities || []).map((activity: any) => ({
    id: String(activity.timestamp),
    icon: activity.icon,
    iconColor: activity.iconColor,
    title: activity.title,
    description: activity.description,
    timestamp: getTimeAgo(activity.timestamp),
  }));

  const profileData: ProfileData = {
    name: user?.fullName || 'User',
    email: user?.email || '',
    phone: user?.mobile || '',
    dateOfBirth: '15/08/1985',
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = (_productId: string) => {
    router.push('/shopping-cart');
  };

  const handleEditAddress = (_addressId: string) => {
    // Edit address logic
  };

  const handleDeleteAddress = (_addressId: string) => {
    // Delete address logic
  };

  const handleSetDefaultAddress = (_addressId: string) => {
    // Set default address logic
  };

  const handleSaveProfile = (_data: ProfileData) => {
    // Save profile logic
  };

  const tabs = [
    { id: 'orders' as const, label: 'Order History', icon: 'ShoppingBagIcon' },
    { id: 'wishlist' as const, label: 'Wishlist', icon: 'HeartIcon' },
    { id: 'addresses' as const, label: 'Addresses', icon: 'MapPinIcon' },
    { id: 'profile' as const, label: 'Profile', icon: 'UserIcon' },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <WelcomeHeader
        userName={userData.name}
        accountStatus={userData.accountStatus}
        loyaltyPoints={userData.loyaltyPoints}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <QuickActionCard
          title="Total Orders"
          value={quickStats.totalOrders}
          icon="ShoppingBagIcon"
          bgColor="bg-primary"
          textColor="text-primary-foreground"
          onClick={() => setActiveTab('orders')}
        />
        <QuickActionCard
          title="Active Orders"
          value={quickStats.activeOrders}
          icon="TruckIcon"
          bgColor="bg-accent"
          textColor="text-accent-foreground"
          onClick={() => router.push('/order-tracking')}
        />
        <QuickActionCard
          title="Wishlist Items"
          value={quickStats.wishlistItems}
          icon="HeartIcon"
          bgColor="bg-secondary"
          textColor="text-secondary-foreground"
          onClick={() => setActiveTab('wishlist')}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card shadow-elevation-1">
            <div className="border-b border-border">
              <div className="flex overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-1 items-center justify-center space-x-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-smooth ${activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <Icon name={tab.icon as any} size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-6">
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-xl font-semibold text-card-foreground">
                      Order History
                    </h2>
                    <button className="flex items-center space-x-1 text-sm text-primary transition-smooth hover:text-primary/80">
                      <Icon name="FunnelIcon" size={16} />
                      <span>Filter</span>
                    </button>
                  </div>
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <OrderHistoryItem key={order.orderId} {...order} />
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No orders yet</p>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-xl font-semibold text-card-foreground">
                      My Wishlist
                    </h2>
                    <p className="caption text-muted-foreground">{wishlistProducts.length} items</p>
                  </div>
                  {wishlistProducts.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {wishlistProducts.map(product => (
                        <WishlistItem
                          key={product.id}
                          {...product}
                          onRemove={() => handleRemoveFromWishlist(product.id)}
                          onAddToCart={() => handleAddToCart(product.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Wishlist is empty</p>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-xl font-semibold text-card-foreground">
                      Saved Addresses
                    </h2>
                    <button className="flex items-center space-x-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]">
                      <Icon name="PlusIcon" size={16} />
                      <span>Add New</span>
                    </button>
                  </div>
                  {addresses.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {addresses.map(address => (
                        <AddressCard
                          key={address.id}
                          {...address}
                          onEdit={() => handleEditAddress(address.id)}
                          onDelete={() => handleDeleteAddress(address.id)}
                          onSetDefault={() => handleSetDefaultAddress(address.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No addresses saved</p>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <ProfileSection profileData={profileData} onSave={handleSaveProfile} />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4 shadow-elevation-1">
            <h3 className="mb-4 font-heading text-lg font-semibold text-card-foreground">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map(activity => (
                  <ActivityFeedItem key={activity.id} {...activity} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No recent activity</p>
              )}
            </div>
          </div>

          {/* Recommended Section - Only show if no error and data exists */}
          {!recommendedError && recommendedProducts.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4 shadow-elevation-1">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold text-card-foreground">
                  Recommended for You
                </h3>
                <button
                  onClick={() => router.push('/products')}
                  className="text-sm text-primary transition-smooth hover:text-primary/80"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recommendedProducts.map(product => (
                  <RecommendedProduct key={product.id} {...product} />
                ))}
              </div>
            </div>
          )}

          {/* If error, show a simple message instead of error */}
          {recommendedError && (
            <div className="rounded-lg border border-border bg-card p-4 shadow-elevation-1">
              <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground">
                Recommended for You
              </h3>
              <p className="text-sm text-muted-foreground">
                Recommendations will appear here once you start shopping.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardInteractive;