'use client';

import { useGetAdminAnalyticsQuery } from '@/store/api/ordersApi';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

export default function AdminOverviewPage() {
  const { data, isLoading, isError, error } = useGetAdminAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <Breadcrumb />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-espresso font-heading">Admin Overview</h1>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
            <p className="text-mocha-grey">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-6">
        <Breadcrumb />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-espresso font-heading">Admin Overview</h1>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
            <p className="text-red-600">Failed to load dashboard data.</p>
            <p className="text-sm text-mocha-grey mt-2">
              {(error as any)?.data?.message || 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const analyticsData = data?.data;
  const kpis = analyticsData?.kpis || {
    totalRevenue: 0,
    totalOrders: 0,
    todayOrders: 0,
    paidOrders: 0,
    pendingPaymentOrders: 0,
    failedPaymentOrders: 0,
    conversionRate: 0,
    avgOrderValue: 0,
  };
  const last7DaysRevenue = analyticsData?.last7DaysRevenue || [];
  const categoryData = analyticsData?.categoryData || [];
  const statusBreakdown = analyticsData?.statusBreakdown || [];
  const todayOrdersList = analyticsData?.todayOrdersList || [];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue),
      icon: 'CurrencyDollarIcon',
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Orders',
      value: kpis.totalOrders.toString(),
      icon: 'ShoppingBagIcon',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: "Today's Orders",
      value: kpis.todayOrders.toString(),
      icon: 'ClockIcon',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(kpis.avgOrderValue),
      icon: 'CreditCardIcon',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const hasTodayOrders = todayOrdersList.length > 0;

  const statusColorFor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'paid') return 'bg-green-100 text-green-700';
    if (s === 'failed') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const formatTime = (raw: string) => {
    try {
      const d = new Date(raw);
      return d.toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="flex-1 p-6">
      <Breadcrumb />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-espresso font-heading">
              Admin Overview
            </h1>
            <p className="text-mocha-grey mt-1">
              Welcome back, Admin! Here's what's happening today.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
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
                <p className="text-sm text-mocha-grey font-medium">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-espresso font-heading">
                  {stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1: Revenue Trend + Recent Orders */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue Trend (Line, last 7 days) */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-espresso mb-4">
              Revenue Trend (Last 7 Days)
            </h2>
            <div className="h-80">
              {last7DaysRevenue.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-mocha-grey">No revenue data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last7DaysRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) =>
                        value === 0
                          ? '0'
                          : value >= 1000
                            ? `${value / 1000}K`
                            : value
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelStyle={{ color: '#1A1A2E' }}
                    />
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
              )}
            </div>
          </div>

          {/* Recent Orders (Today) */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-espresso mb-4">
              Recent Orders (Today)
            </h2>
            <div className="overflow-x-auto">
              {hasTodayOrders ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold text-mocha-grey uppercase tracking-wider">
                      <th className="px-3 py-2">Order ID</th>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Payment</th>
                      <th className="px-3 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayOrdersList.map((order: any) => (
                      <tr
                        key={order.id}
                        className="border-b border-border/60 hover:bg-soft-linen transition-colors"
                      >
                        <td className="px-3 py-3 font-medium text-espresso">
                          ORD-{String(order.id).padStart(3, '0')}
                        </td>
                        <td className="px-3 py-3 text-mocha-grey">
                          {order.customer}
                        </td>
                        <td className="px-3 py-3 font-semibold text-espresso">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${statusColorFor(
                              order.payment_status
                            )}`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-mocha-grey text-xs">
                          {formatTime(order.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center py-16 text-center">
                  <div>
                    <Icon
                      name="InboxIcon"
                      size={40}
                      className="text-mocha-grey/40 mx-auto mb-3"
                    />
                    <p className="text-mocha-grey">No orders today</p>
                    <p className="text-xs text-mocha-grey/70 mt-1">
                      New orders will appear here as they come in
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Charts Row 2: Sales by Category + Order Status */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Sales by Category */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-espresso mb-4">
              Sales by Category
            </h2>
            <div className="h-80">
              {categoryData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-mocha-grey">No category data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      fontSize={12}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) =>
                        value === 0
                          ? '0'
                          : value >= 1000
                            ? `${value / 1000}K`
                            : value
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelStyle={{ color: '#1A1A2E' }}
                    />
                    <Bar dataKey="value" fill="#8B5E3C" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-espresso mb-4">
              Order Status Distribution
            </h2>
            <div className="h-80">
              {statusBreakdown.every((s: any) => s.value === 0) ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-mocha-grey">No order data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown.filter((s: any) => s.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={90}
                      dataKey="value"
                    >
                      {statusBreakdown
                        .filter((s: any) => s.value > 0)
                        .map((entry: any) => (
                          <Cell
                            key={`status-${entry.name}`}
                            fill="#8B5E3C"
                          />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}