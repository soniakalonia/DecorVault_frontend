import { CartItem as StoreCartItem } from '@/store/slices/cart'

export type CartItem = StoreCartItem

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
  loading: boolean
}

export interface CartActions {
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
}



