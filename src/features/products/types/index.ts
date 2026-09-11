export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
  rating?: number
  reviews?: number
}

export interface ProductFilters {
  category?: string
  priceRange?: [number, number]
  inStock?: boolean
  rating?: number
  search?: string
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating'
  direction: 'asc' | 'desc'
}