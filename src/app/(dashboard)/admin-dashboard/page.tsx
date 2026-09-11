'use client';

import { useGetAdminAnalyticsQuery } from '@/store/api/ordersApi';
import Breadcrumb from '@/components/common/Breadcrumb';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
  BarChart, Bar,
} from 'recharts';
import Icon from '@/components/ui/AppIcon';

const COLORS = ['#8B5E3C', '#D4AF37', '#E8B4B8', '#9CAF88', '#6A8CAF'];

export default function RevenuePage() {
  const { data, isLoading, isError, error } = useGetAdminAnalyticsQuery();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <Breadcrumb />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-espresso">Admin Overview</h1>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
            <p className="text-mocha-grey">Loading revenue data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex-1 p-6">
        <Breadcrumb />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-espresso">Admin Overview</h1>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
            <p className="text-red-600">Failed to load revenue data. Please try again later.</p>
            <p className="text-sm text-mocha-grey mt-2">{(error as any)?.data?.message || 'Unknown error'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const analyticsData = data?.data;
  const kpis = analyticsData?.kpis || {
    totalRevenue: 0,
    totalOrders: 0,
    conversionRate: 0,
    avgOrderValue: 0,
  };
  const monthlySalesData = analyticsData?.monthlySalesData || [];
  const categoryData = analyticsData?.categoryData || [];
  const trafficSourceData = analyticsData?.trafficSourceData || [];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Stats cards data
  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue),
      icon: 'CurrencyDollarIcon',
      color: 'green'
    },
    {
      label: 'Total Orders',
      value: kpis.totalOrders.toString(),
      icon: 'ShoppingBagIcon',
      color: 'blue'
    },
    {
      label: 'Conversion Rate',
      value: `${kpis.conversionRate}%`,
      icon: 'ChartBarIcon',
      color: 'purple'
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(kpis.avgOrderValue),
      icon: 'CreditCardIcon',
      color: 'orange'
    },
  ];

  // Prepare data for orders vs refunds chart
  const ordersVsRefundsData = monthlySalesData.map((item: any) => ({
    name: item.month,
    orders: item.orders || 0,
    refunds: item.refunds || 0,
  }));

  // Prepare revenue data for line chart
  const revenueChartData = monthlySalesData.map((item: any) => ({
    name: item.month,
    revenue: item.revenue || 0,
  }));

  return (
    <div className="flex-1 p-6">
      <Breadcrumb />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-espresso font-heading">Admin Overview</h1>
            <p className="text-mocha-grey mt-1">Welcome back, Admin! Here's what's happening today.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-2xl shadow-elevation-1 border border-border flex items-center space-x-4 hover:shadow-elevation-2 transition-all duration-200 hover:transform hover:scale-[1.02]"
            >
              <div className={`p-4 rounded-xl bg-${stat.color}-100 text-${stat.color}-600`}>
                <Icon name={stat.icon as any} size={24} />
              </div>
              <div>
                <p className="text-sm text-mocha-grey font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-espresso font-heading">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Revenue Trend - Line Chart */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-espresso mb-4">Revenue Trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => value === 0 ? '0' : value >= 1000 ? `${value / 1000}K` : value}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelStyle={{ color: '#1A1A2E' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#D4AF37"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#D4AF37' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Category - Pie Chart */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-espresso mb-4">Sales by Category</h2>
              <div className="h-80">
                {categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-mocha-grey">No category data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelStyle={{ color: '#1A1A2E' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Traffic Sources - Area Chart */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-espresso mb-4">Order Status Distribution</h2>
              <div className="h-80">
                {trafficSourceData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-mocha-grey">No order status data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficSourceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="source" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip labelStyle={{ color: '#1A1A2E' }} />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        stroke="#8B5E3C"
                        fill="#8B5E3C"
                        fillOpacity={0.35}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Orders vs Refunds - Bar Chart */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-espresso mb-4">Monthly Orders vs Refunds</h2>
              <div className="h-80">
                {ordersVsRefundsData.length === 0 || ordersVsRefundsData.every((d: any) => d.orders === 0 && d.refunds === 0) ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-mocha-grey">No order data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersVsRefundsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip labelStyle={{ color: '#1A1A2E' }} />
                      <Legend />
                      <Bar dataKey="orders" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="refunds" fill="#E8B4B8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}