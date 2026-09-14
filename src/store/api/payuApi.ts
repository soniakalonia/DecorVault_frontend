import { baseApi } from './baseApi';

export interface PayUInitiateRequest {
  orderId: number;
  amount: number;
  currency?: string;
  productInfo?: string | undefined;
}

export interface PayUFormFields {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
  service_provider: string;
}

export interface PayUInitiateResponse {
  success: boolean;
  data: {
    paymentId: number;
    txnid: string;
    payuForm: {
      action: string;
      method: string;
      fields: PayUFormFields;
    };
  };
  message: string;
}

export interface PayUVerifyRequest {
  txnid?: string;
  mihpayid?: string;
  status?: string;
  amount?: string;
  hash?: string;
  [key: string]: any;
}

export interface PayUVerifyResponse {
  success: boolean;
  data: {
    paymentId: number;
    orderId: number;
    mihpayid: string;
    status: string;
  };
  message: string;
}

export interface PayUStatusResponse {
  success: boolean;
  data: {
    payment: any;
    payuTransactions: any[];
    status: string;
  };
}

// ─── DEV ONLY: Simulate success/failure ───
export interface PayUSimulateRequest {
  orderId?: number;
  txnid?: string;
  status: 'success' | 'failure';
}

export interface PayUSimulateResponse {
  success: boolean;
  message: string;
  data: {
    paymentId?: number;
    orderId: number;
    txnid: string;
    mihpayid: string;
    status: 'success' | 'failure';
    redirectUrl: string;
  };
}

export const payuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate PayU payment — returns hidden form data to auto-submit
    initiatePayUPayment: builder.mutation<PayUInitiateResponse, PayUInitiateRequest>({
      query: (data) => ({
        url: '/payment/payu/initiate',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify PayU payment (called on success/failure page after redirect)
    verifyPayUPayment: builder.mutation<PayUVerifyResponse, PayUVerifyRequest>({
      query: (data) => ({
        url: '/payment/payu/verify',
        method: 'POST',
        body: data,
      }),
    }),

    // Get PayU payment status by order ID
    getPayUPaymentStatus: builder.query<PayUStatusResponse, number>({
      query: (orderId) => `/payment/payu/status/${orderId}`,
      providesTags: ['Payment'],
    }),

    // ─── DEV ONLY: Simulate success/failure (TEST mode only) ───
    simulatePayUPayment: builder.mutation<PayUSimulateResponse, PayUSimulateRequest>({
      query: (data) => ({
        url: '/payment/payu/dev-simulate',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useInitiatePayUPaymentMutation,
  useVerifyPayUPaymentMutation,
  useGetPayUPaymentStatusQuery,
  useSimulatePayUPaymentMutation,
} = payuApi;