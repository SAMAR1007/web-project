// Shared type definitions used across components
export interface Product {
  id: number
  name: string
  price: number
  rating: number
  reviews: number
  image: string
  category: string
  inStock: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Order {
  id: string
  customerId: string
  products: Product[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  createdAt: Date
}
