import { baseApi } from './baseApi'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
  rating?: number
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, { page?: number; limit?: number; category?: string; search?: string }>({
      query: (params = {}) => ({
        url: '/products',
        params: {
          page: 1,
          limit: 12,
          ...params,
        },
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    getProductBySlug: builder.query<any, string>({
      query: (slug) => `/product/slug/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Product', id: slug }],
    }),
    getRelatedProducts: builder.query<any, string>({
      query: (slug) => `/product/slug/${slug}/related`,
      providesTags: ['Product'],
    }),
    getCategories: builder.query<{ categories: any[] }, void>({
      query: () => '/categories',
      providesTags: ['Product'],
    }),
    getBrands: builder.query<{ brands: any[] }, void>({
      query: () => '/brands',
      providesTags: ['Product'],
    }),
    addAdminProduct: builder.mutation<any, any>({
      query: (productData) => ({
        url: '/admin/product',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    getAdminProducts: builder.query<any, void>({
      query: () => '/admin/products',
      providesTags: ['Product'],
    }),
    updateAdminProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/product/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteAdminProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    // Inventory endpoints
    getInventory: builder.query<any, void>({
      query: () => '/admin/inventory',
      providesTags: ['Inventory'],
    }),
    updateStock: builder.mutation<any, { id: string; stock_quantity: number; action: 'set' | 'add' | 'subtract' }>({
      query: ({ id, stock_quantity, action }) => ({
        url: `/admin/inventory/${id}/stock`,
        method: 'PUT',
        body: { stock_quantity, action },
      }),
      invalidatesTags: ['Inventory', 'Product'],
    }),
    getLowStockProducts: builder.query<any, { threshold?: number }>({
      query: (params = {}) => ({
        url: '/admin/inventory/low-stock',
        params,
      }),
      providesTags: ['Inventory'],
    }),
    getInventoryStats: builder.query<any, void>({
      query: () => '/admin/inventory/stats',
      providesTags: ['Inventory'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductBySlugQuery,
  useGetRelatedProductsQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useAddAdminProductMutation,
  useGetAdminProductsQuery,
  useUpdateAdminProductMutation,
  useDeleteAdminProductMutation,
  useGetInventoryQuery,
  useUpdateStockMutation,
  useGetLowStockProductsQuery,
  useGetInventoryStatsQuery,
} = productsApi



