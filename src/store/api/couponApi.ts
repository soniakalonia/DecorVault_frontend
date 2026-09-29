import { baseApi } from './baseApi'

/* ---------------------------------- Types ---------------------------------- */

export type CouponType = 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y'
export type CouponStatus = 'active' | 'inactive' | 'expired'
export type CouponApplicableTo = 'all' | 'categories' | 'products' | 'brands'

export interface Coupon {
  id: number
  code: string
  name: string
  description?: string | null
  type: CouponType
  value: number
  minimum_amount: number
  maximum_discount?: number | null
  usage_limit?: number | null
  used_count: number
  user_limit: number
  applicable_to: CouponApplicableTo
  applicable_ids?: number[] | null
  start_date: string
  end_date: string
  status: CouponStatus
  current_status?: CouponStatus
  created_at: string
  updated_at?: string
}

export interface CouponFormData {
  code: string
  name: string
  description?: string | undefined
  type: CouponType
  value: number
  minimum_amount?: number | undefined
  maximum_discount?: number | undefined
  usage_limit?: number | undefined
  user_limit?: number | undefined
  applicable_to?: CouponApplicableTo | undefined
  applicable_ids?: number[] | undefined
  start_date: string
  end_date: string
  status?: CouponStatus | undefined
}

export interface CouponStats {
  totalCoupons: number
  activeCoupons: number
  expiredCoupons: number
  totalUsage: number
  totalDiscountGiven: number
}

export interface CouponsResponse {
  success: boolean
  message: string
  data: Coupon[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface SingleCouponResponse {
  success: boolean
  message: string
  data: Coupon
}

export interface CouponStatsResponse {
  success: boolean
  message: string
  data: CouponStats
}

export interface ValidateCouponPayload {
  code: string
  cart_total: number
  user_id?: number | string | null
}

export interface ValidateCouponResponse {
  success: boolean
  message: string
  data: {
    coupon_id: number
    code: string
    type: CouponType
    discount_amount: number
    coupon_details: Coupon
  }
}

export interface ApplyCouponPayload {
  coupon_id: number
  user_id: number
  order_id: string | number
  discount_amount: number
}

/* --------------------------------- API Slice -------------------------------- */

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ------------------------------ ADMIN ------------------------------ */

    getCoupons: builder.query<
      CouponsResponse,
      { status?: CouponStatus; type?: CouponType; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/admin/coupons',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Coupon' as const, id })),
              { type: 'Coupon' as const, id: 'LIST' },
            ]
          : [{ type: 'Coupon' as const, id: 'LIST' }],
    }),

    getCouponById: builder.query<SingleCouponResponse, number | string>({
      query: (id) => `/admin/coupon/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Coupon', id }],
    }),

    getCouponStats: builder.query<CouponStatsResponse, void>({
      query: () => '/admin/coupon/stats',
      providesTags: [{ type: 'Coupon', id: 'STATS' }],
    }),

    createCoupon: builder.mutation<SingleCouponResponse, CouponFormData>({
      query: (body) => ({
        url: '/admin/coupon',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Coupon', id: 'LIST' },
        { type: 'Coupon', id: 'STATS' },
      ],
    }),

    updateCoupon: builder.mutation<
      SingleCouponResponse,
      { id: number | string; data: Partial<CouponFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/coupon/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Coupon', id },
        { type: 'Coupon', id: 'LIST' },
        { type: 'Coupon', id: 'STATS' },
      ],
    }),

    deleteCoupon: builder.mutation<{ success: boolean; message: string }, number | string>({
      query: (id) => ({
        url: `/admin/coupon/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Coupon', id: 'LIST' },
        { type: 'Coupon', id: 'STATS' },
      ],
    }),

    /* ------------------------------ PUBLIC ----------------------------- */

    validateCoupon: builder.mutation<ValidateCouponResponse, ValidateCouponPayload>({
      query: (body) => ({
        url: '/coupon/validate',
        method: 'POST',
        body,
      }),
    }),

    applyCoupon: builder.mutation<{ success: boolean; message: string }, ApplyCouponPayload>({
      query: (body) => ({
        url: '/admin/coupon/apply',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Coupon', id: 'LIST' },
        { type: 'Coupon', id: 'STATS' },
      ],
    }),
  }),
})

/* --------------------------------- Exports --------------------------------- */

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useGetCouponStatsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
  useApplyCouponMutation,
} = couponApi