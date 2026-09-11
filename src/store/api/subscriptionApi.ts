import { baseApi } from '@/store/api/baseApi';

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/subscribe',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubscribeMutation } = subscriptionApi;