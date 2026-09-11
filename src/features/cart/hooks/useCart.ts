import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux'
import { addItem, removeItem, updateQuantity, toggleCart } from '@/store/slices/cart'
import type { CartItem } from '../types'

export const useCart = () => {
  const cart = useAppSelector(state => state.cart)
  const dispatch = useAppDispatch()

  const handleAddItem = (item: CartItem) => {
    dispatch(addItem(item))
  }

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id))
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }))
  }

  const handleToggleCart = () => {
    dispatch(toggleCart())
  }
  return {
    ...cart,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    toggleCart: handleToggleCart,
  }
}



