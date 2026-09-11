'use client';

import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGetAllOrdersQuery } from '@/store/api/ordersApi';
import { useGetInventoryStatsQuery, useGetLowStockProductsQuery } from '@/store/api/productsApi';
import { useGetAllUsersQuery } from '@/store/api/usersApi';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';

const AdminDashboardView = () => {
  const { user } = useAuth();
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery(undefined);
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: inventoryStatsData, isLoading: inventoryStatsLoading } = useGetInventoryStatsQuery();
  const { data: lowStockData, isLoading: lowStockLoading } = useGetLowStockProductsQuery({ threshold: 10 });

  const orders = ordersData?.orders || [];
  const users = usersData?.users || [];
  const inventoryStats = inventoryStatsData?.data || {};
  const lowStockProducts = lowStockData?.data || [];

  const totalSales = orders.reduce((sum: number, order: any) => sum + Number(order.total || 0), 0);
  const pendingOrders = orders.filter((order: any) => order.status === 'pending').length;
  const recentOrders = orders.slice(0, 4);
  const inventoryItems = lowStockProducts.slice(0, 3);

  const stats = [
    {
      label: 'Total Sales',
      value: ordersLoading ? '...' : `₹${Number(totalSales).toLocaleString('en-IN')}`,
      icon: 'CurrencyRupeeIcon',
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Orders',
      value: ordersLoading ? '...' : String(orders.length),
      icon: 'ShoppingBagIcon',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'New Customers',
      value: usersLoading ? '...' : String(users.length),
      icon: 'UsersIcon',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Pending Orders',
      value: ordersLoading ? '...' : String(pendingOrders),
      icon: 'ClockIcon',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-espresso font-heading">Admin Overview</h1>
          <p className="text-mocha-grey mt-1">
            Welcome back, {user?.fullName || 'Admin'}! Here's what's happening today.
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-elevation-2 hover:bg-secondary transition-all duration-200 flex items-center space-x-2 hover:shadow-elevation-3 transform hover:scale-105">
          <Icon name="PlusIcon" size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl shadow-elevation-1 border border-border flex items-center space-x-4 hover:shadow-elevation-2 transition-all duration-200 hover:transform hover:scale-[1.02]"
          >
            <div className={`p-4 rounded-xl ${stat.color}`}>
              <Icon name={stat.icon as any} size={24} />
            </div>
            <div>
              <p className="text-sm text-mocha-grey font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-espresso font-heading">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-8 rounded-2xl shadow-elevation-1 border border-border hover:shadow-elevation-2 transition-all duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-espresso font-heading">Recent Orders</h3>
            <button className="text-primary font-medium hover:underline text-sm hover:text-secondary transition-colors">
              View All
            </button>
          </div>
          <div className='overflow-x-auto sm:overflow-visible'>
            <div className="min-w-[430px] sm:min-w-0 space-y-4">
              {ordersLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-soft-linen rounded-xl hover:bg-opacity-80 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-border shadow-sm">
                        <Icon name="ShoppingBagIcon" size={20} className="text-mocha-grey" />
                      </div>
                      <div>
                        <h4 className="font-bold text-espresso">Loading...</h4>
                        <p className="text-xs text-mocha-grey font-medium">Please wait</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-espresso">...</p>
                      <span className="text-[10px] px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold uppercase tracking-wider">
                        Pending
                      </span>
                    </div>
                  </div>
                ))
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between  p-4 bg-soft-linen rounded-xl hover:bg-opacity-80 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-border shadow-sm">
                        <Icon name="ShoppingBagIcon" size={20} className="text-mocha-grey" />
                      </div>
                      <div>
                        <h4 className="font-bold text-espresso">Order #VMR-{String(order.id).padStart(3, '0')}</h4>
                        <p className="text-xs text-mocha-grey font-medium">{order.email || '-'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-espresso">₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'confirmed'
                              ? 'bg-purple-100 text-purple-700'
                              : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {order.status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-mocha-grey bg-soft-linen rounded-xl">No recent orders</div>
              )}
            </div></div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-elevation-1 border border-border hover:shadow-elevation-2 transition-all duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-espresso font-heading">Inventory Status</h3>
            <button className="text-primary font-medium hover:underline text-sm hover:text-secondary transition-colors">
              Manage
            </button>
          </div>
          <div className="space-y-6">
            {lowStockLoading || inventoryStatsLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-espresso">Loading...</span>
                    <span className="font-medium text-mocha-grey">...</span>
                  </div>
                  <div className="h-2 bg-soft-linen rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: '0%' }}></div>
                  </div>
                </div>
              ))
            ) : inventoryItems.length > 0 ? (
              inventoryItems.map((item: any) => {
                const stock = Number(item.stock_quantity || 0);
                const total = 10;
                const percent = Math.min((stock / total) * 100, 100);
                return (
                  <div key={item.id || item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-espresso">{item.name}</span>
                      <span className={`font-medium ${stock <= 3 ? 'text-red-500' : 'text-mocha-grey'}`}>
                        {stock} / {total} in stock
                      </span>
                    </div>
                    <div className="h-2 bg-soft-linen rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${stock <= 3 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-sm text-mocha-grey bg-soft-linen rounded-xl">
                {Number(inventoryStats.lowStockProducts || 0) === 0 ? 'No low stock products' : 'Inventory data unavailable'}
              </div>
            )}
          </div>
        </div>
      </div>
      <AnalyticsDashboard />

    </div>
  );
};

export default AdminDashboardView;
