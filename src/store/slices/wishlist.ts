import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { wishlistApi } from '../api/wishlistApi'

interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  variant?: string
}

interface WishlistState {
  items: WishlistItem[]
}

const initialState: WishlistState = {
  items: []
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(item => item.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    toggleWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
      const index = state.items.findIndex(item => item.productId === action.payload.productId)
      if (index >= 0) {
        state.items.splice(index, 1)
      } else {
        state.items.push(action.payload)
      }
    },
    syncWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      wishlistApi.endpoints.getWishlist.matchFulfilled,
      (state, { payload }) => {
        if (payload.success && payload.data) {
          state.items = payload.data.map((item: any) => {
            let images = []
            try {
              images = typeof item.product_images === 'string' ? JSON.parse(item.product_images) : item.product_images
            } catch (e) {
              images = []
            }
            return {
              id: item.id.toString(),
              productId: item.product_id.toString(),
              name: item.name,
              price: item.discount_price || item.price,
              image: Array.isArray(images) ? images[0] || '' : '',
              variant: item.variant_id,
            }
          })
        }
      }
    )
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlistItem, syncWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
