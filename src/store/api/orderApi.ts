import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Addresses', 'Orders', 'Activity'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders/create',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders', 'Activity'],
    }),
    getUserOrders: builder.query<any, void>({
      query: () => '/orders/user',
      providesTags: ['Orders'],
    }),
    getUserActivity: builder.query<any, void>({
      query: () => '/orders/user/activity',
      providesTags: ['Activity'],
    }),
    getRecommendedProducts: builder.query<any, void>({
      query: () => '/orders/user/recommended',
    }),
    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (_result, _error, orderId) => [{ type: 'Orders', id: orderId }],
    }),
    getUserAddresses: builder.query<any, void>({
      query: () => '/orders/addresses',
      providesTags: ['Addresses'],
    }),
    addAddress: builder.mutation({
      query: (addressData) => ({
        url: '/orders/addresses',
        method: 'POST',
        body: addressData,
      }),
      invalidatesTags: ['Addresses'],
    }),
    setDefaultAddress: builder.mutation({
      query: (addressId) => ({
        url: `/orders/addresses/${addressId}/default`,
        method: 'PUT',
      }),
      invalidatesTags: ['Addresses'],
    }),
  }),
});

export const { 
  useCreateOrderMutation, 
  useGetUserOrdersQuery,
  useGetUserActivityQuery,
  useGetRecommendedProductsQuery,
  useGetOrderByIdQuery,
  useGetUserAddressesQuery, 
  useAddAddressMutation,
  useSetDefaultAddressMutation
} = orderApi;
