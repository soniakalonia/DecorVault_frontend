'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useGetAdminAnalyticsQuery, useGetAllOrdersQuery } from '@/store/api/ordersApi';

const pieColors = ['#8B5E3C', '#E6B980', '#6A8CAF', '#A3B18A', '#D9C6A5', '#E57373', '#5C6BC0'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const formatCompact = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export default function AnalyticsDashboard() {
  const { data, isError } = useGetAdminAnalyticsQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery(undefined, {
    skip: !isError,
  });

  const fallbackOrders = (ordersData?.orders || []) as Array<Record<string, unknown>>;

  const buildFallbackAnalytics = () => {
    const now = new Date();
    const monthlyMap = new Map<string, { month: string; revenue: number; orders: number; refunds: number }>();
    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, {
        month: d.toLocaleString('en-US', { month: 'short' }),
        revenue: 0,
        orders: 0,
        refunds: 0,
      });
    }

    const categoryCount = new Map<string, number>();
    const statusCount = new Map<string, number>();

    let totalRevenue = 0;
    let nonCancelledTotal = 0;
    let delivered = 0;

    fallbackOrders.forEach((order) => {
      const status = String(order.status || 'unknown').toLowerCase();
      const total = Number(order.total || 0);
      const createdAtRaw = order.created_at || order.createdAt;
      const createdAt = createdAtRaw ? new Date(String(createdAtRaw)) : null;

      if (status !== 'cancelled') {
        totalRevenue += total;
        nonCancelledTotal += 1;
      }
      if (status === 'delivered') delivered += 1;

      if (createdAt && !Number.isNaN(createdAt.getTime())) {
        const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
        const current = monthlyMap.get(key);
        if (current) {
          current.orders += 1;
          if (status === 'cancelled') {
            current.refunds += 1;
          } else {
            current.revenue += total;
          }
        }
      }

      const rawProducts = String(order.product_names || '');
      rawProducts
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((name) => {
          categoryCount.set(name, (categoryCount.get(name) || 0) + 1);
        });

      statusCount.set(status, (statusCount.get(status) || 0) + 1);
    });

    const monthlySalesData = Array.from(monthlyMap.values());
    const categoryData = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
    const trafficSourceData = Array.from(statusCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([source, visitors]) => ({ source, visitors }));

    const totalOrders = fallbackOrders.length;
    const conversionRate = totalOrders > 0 ? (delivered / totalOrders) * 100 : 0;
    const avgOrderValue = nonCancelledTotal > 0 ? totalRevenue / nonCancelledTotal : 0;

    return {
      kpis: {
        totalRevenue,
        totalOrders,
        conversionRate,
        avgOrderValue,
      },
      monthlySalesData,
      categoryData,
      trafficSourceData,
    };
  };

  const fallbackAnalytics = buildFallbackAnalytics();
  const useFallback = isError;
  const analytics = useFallback ? fallbackAnalytics : data?.data;

  const monthlySalesData = analytics?.monthlySalesData || [];
  const categoryData = analytics?.categoryData || [];
  const trafficSourceData = analytics?.trafficSourceData || [];

  if (isError && !ordersData && !ordersLoading) {
    return (
      <div className="space-y-6 mt-4">
        <h1 className="text-3xl font-bold text-espresso">Analytics</h1>
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-red-600 font-medium">Unable to load analytics data.</p>
          <p className="text-sm text-mocha-grey mt-1">Please check backend API and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-espresso mb-4">Revenue Trend (Line)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => formatCompact(Number(value))} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8B5E3C" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-espresso mb-4">Sales by Category (Pie)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-espresso mb-4">Traffic Sources (Area)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficSourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="source" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="visitors" stroke="#A3B18A" fill="#A3B18A" fillOpacity={0.35} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-espresso mb-4">Orders vs Refunds (Bar)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#6A8CAF" radius={[6, 6, 0, 0]} />
                <Bar dataKey="refunds" fill="#E6B980" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
