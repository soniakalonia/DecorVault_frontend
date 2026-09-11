import { baseApi } from './baseApi'

interface BulkOrder {
  id: number
  name: string
  email: string
  phone: string
  message: string
  product_name: string
  status: 'pending' | 'contacted' | 'quoted' | 'completed' | 'cancelled'
  created_at: string
}

export const bulkOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBulkOrders: builder.query<{ success: boolean; data: BulkOrder[] }, void>({
      query: () => '/bulk-orders',
    }),
  }),
})

export const { useGetBulkOrdersQuery } = bulkOrdersApi
