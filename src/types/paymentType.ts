export interface Payment {
  _id: string
  user: string
  paymentRef?: string
  amount: number
  currency: string
  description: string
  paymentMethod?: string
  customerIPAddress?: string
  provider?: string
  success: boolean
  createdAt: string
  reason?: string
  souls: number
  tournament?: string
  link?: string
  webhook?: string
  successUrl?: string
  failUrl?: string
}
