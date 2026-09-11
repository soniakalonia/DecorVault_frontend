import { useGetOrdersQuery, useGetOrderQuery, useCreateOrderMutation } from '@/store/api/ordersApi'

export const useOrders = () => {
  return useGetOrdersQuery()
}

export const useOrder = (id: string) => {
  return useGetOrderQuery(id)
}

export const useCreateOrder = () => {
  return useCreateOrderMutation()
}