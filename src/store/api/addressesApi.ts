import { baseApi } from './baseApi'

interface Address {
  id: number
  user_id: number
  name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pincode: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export const addressesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserAddresses: builder.query<{ success: boolean; addresses: Address[] }, void>({
      query: () => '/orders/addresses',
    }),
  }),
})

export const { useGetUserAddressesQuery } = addressesApi
