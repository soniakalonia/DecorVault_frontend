import { baseApi } from './baseApi'

export interface Order {
  id: string
  userId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface AdminAnalyticsResponse {
  success: boolean
  data: {
    kpis: {
      totalRevenue: number
      totalOrders: number
      todayOrders: number
      paidOrders: number
      pendingPaymentOrders: number
      failedPaymentOrders: number
      conversionRate: number
      avgOrderValue: number
    }
    last7DaysRevenue: Array<{
      day: string
      date: string
      revenue: number
    }>
    categoryData: Array<{
      name: string
      value: number
    }>
    statusBreakdown: Array<{
      name: string
      value: number
    }>
    todayOrdersList: Array<{
      id: number
      customer: string
      total: number
      payment_status: string
      status: string
      created_at: string
    }>
  }
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => '/admin/orders',
      providesTags: ['Order'],
    }),
    getAdminAnalytics: builder.query<AdminAnalyticsResponse, void>({
      query: () => '/admin/analytics',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/admin/order/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/order/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useGetAllOrdersQuery,
  useGetAdminAnalyticsQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
} = ordersApi



