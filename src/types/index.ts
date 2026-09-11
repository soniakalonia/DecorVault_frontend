// Global type definitions
export interface User {
  id: string
  name: string
  email: string
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: string
}