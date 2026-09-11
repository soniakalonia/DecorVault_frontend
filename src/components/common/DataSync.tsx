'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { useGetCartQuery } from '@/store/api/cartApi'
import { useGetWishlistQuery } from '@/store/api/wishlistApi'
import { syncCart } from '@/store/slices/cart'
import { syncWishlist } from '@/store/slices/wishlist'

export default function DataSync() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated })
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated })

  useEffect(() => {
    if (cartData?.success && cartData.data) {
      const items = cartData.data.map((item: any) => {
        let images: any[] = []
        try {
          images = typeof item.product_images === 'string' ? JSON.parse(item.product_images) : item.product_images
        } catch (e) {
          images = []
        }
        return {
          id: item.product_id.toString(),
          name: item.name,
          price: item.discount_price || item.price,
          image: Array.isArray(images) ? images[0] || '' : '',
          quantity: item.quantity,
          variant: item.variant_id,
        }
      })
      dispatch(syncCart(items))
    }
  }, [cartData, dispatch])

  useEffect(() => {
    if (wishlistData?.success && wishlistData.data) {
      const items = wishlistData.data.map((item: any) => {
        let images: any[] = []
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
      dispatch(syncWishlist(items))
    }
  }, [wishlistData, dispatch])

  return null
}
