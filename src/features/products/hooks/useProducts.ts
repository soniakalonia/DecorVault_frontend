import { useGetProductsQuery, useGetProductQuery, useGetCategoriesQuery } from '@/store/api/productsApi'

export const useProducts = (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
  return useGetProductsQuery(params || {})
}

export const useProduct = (id: string) => {
  return useGetProductQuery(id)
}

export const useCategories = () => {
  return useGetCategoriesQuery()
}