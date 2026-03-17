export type PrizeType = 'RED_POINTS' | 'CASH' | 'VOUCHER' | 'OTHER'
export type PrizeRank = 1 | 2 | 3 | 4

export interface GiftCode {
  platform?: string
  code?: string
}

export interface Prize {
  _id: string
  tournament: string
  name?: string
  description?: string
  GIFT_CODE?: GiftCode
  type: PrizeType
  winner?: string
  value: number
  rank?: PrizeRank
  is_shared: boolean
  currency?: string
  redeemed: boolean
  sponsor?: string
}
