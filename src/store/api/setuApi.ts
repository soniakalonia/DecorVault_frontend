import { baseApi } from './baseApi';

export interface SetuInitiateRequest {
  orderId: number;
  amount: number;
  currency?: string;
}

export interface SetuInitiateResponse {
  success: boolean;
  data: {
    paymentId: number;
    sessionId: string;
    paymentLink: string;
    session: any;
  };
  message: string;
}

export interface SetuVerifyRequest {
  sessionId: string;
  orderId?: number;
}

export interface SetuVerifyResponse {
  success: boolean;
  data: {
    paymentId: number;
    orderId: number;
    session: any;
  };
  message: string;
}

export interface SetuStatusResponse {
  success: boolean;
  data: {
    payment: any;
    session: any;
    status: string;
  };
}

export const setuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate Setu payment
    initiateSetuPayment: builder.mutation<SetuInitiateResponse, SetuInitiateRequest>({
      query: (data) => ({
        url: '/payment/setu/initiate',
        method: 'POST',
        body: data,
      }),
    }),
    // Verify Setu payment (called after return from Setu)
    verifySetuPayment: builder.mutation<SetuVerifyResponse, SetuVerifyRequest>({
      query: (data) => ({
        url: '/payment/setu/verify',
        method: 'POST',
        body: data,
      }),
    }),
    // Get Setu payment status
    getSetuPaymentStatus: builder.query<SetuStatusResponse, number>({
      query: (orderId) => `/payment/setu/status/${orderId}`,
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  useInitiateSetuPaymentMutation,
  useVerifySetuPaymentMutation,
  useGetSetuPaymentStatusQuery,
} = setuApi;