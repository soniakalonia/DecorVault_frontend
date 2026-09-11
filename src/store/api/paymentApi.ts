import { baseApi } from './baseApi';
import {
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
  PaymentStatusResponse,
  PaymentHistoryResponse,
  RefundRequest,
  RefundResponse,
  WebhookLogsResponse,
  WebhookStatsResponse,
} from '@/types/payment';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate Razorpay payment
    initiatePayment: builder.mutation<PaymentInitiateResponse, PaymentInitiateRequest>({
      query: (data) => ({
        url: '/payments/initiate',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify Razorpay payment
    verifyPayment: builder.mutation<PaymentVerifyResponse, PaymentVerifyRequest>({
      query: (data) => ({
        url: '/payments/verify',
        method: 'POST',
        body: data,
      }),
    }),

    // Get payment status by order ID
    getPaymentStatus: builder.query<PaymentStatusResponse, number>({
      query: (orderId) => `/payments/status/${orderId}`,
      providesTags: ['Order'],
    }),

    // Get user payment history
    getPaymentHistory: builder.query<PaymentHistoryResponse, void>({
      query: () => '/payments/history',
      providesTags: ['Order'],
    }),

    // Refund payment (admin only)
    refundPayment: builder.mutation<RefundResponse, RefundRequest>({
      query: (data) => ({
        url: '/payments/refund',
        method: 'POST',
        body: data,
      }),
    }),

    // Get webhook logs (admin only)
    getWebhookLogs: builder.query<WebhookLogsResponse, { gateway?: string; limit?: number }>({
      query: (params) => ({
        url: '/webhooks/logs',
        params,
      }),
    }),

    // Get webhook stats (admin only)
    getWebhookStats: builder.query<WebhookStatsResponse, void>({
      query: () => '/webhooks/stats',
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentStatusQuery,
  useGetPaymentHistoryQuery,
  useRefundPaymentMutation,
  useGetWebhookLogsQuery,
  useGetWebhookStatsQuery,
} = paymentApi;