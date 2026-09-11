import { baseApi } from '@/store/api/baseApi';
import type {
  LoginRequest,
  RegisterRequest,
  OTPRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  AuthResponse,
  User,
} from '@/features/auth/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getProfile: builder.query<{ user: User }, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<{ message: string; userId: string }, RegisterRequest>({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    updateProfile: builder.mutation<
      { message: string; user: User },
      { fullName: string; email: string; mobile: string; dateOfBirth?: string }
    >({
      query: data => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    verifyOTP: builder.mutation<AuthResponse, OTPRequest>({
      query: otpData => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),

    resendOTP: builder.mutation<{ message: string }, { emailOrMobile: string }>({
      query: data => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: data => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: data => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: data => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    sendLoginOTP: builder.mutation<{ message: string }, { emailOrMobile: string }>({
      query: data => ({
        url: '/auth/send-login-otp',
        method: 'POST',
        body: data,
      }),
    }),

    verifyLoginOTP: builder.mutation<AuthResponse, OTPRequest>({
      query: otpData => ({
        url: '/auth/verify-login-otp',
        method: 'POST',
        body: otpData,
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useSendLoginOTPMutation,
  useVerifyLoginOTPMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;
