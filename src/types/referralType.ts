export interface Referral {
  _id: string
  referrerId: string
  refereeId?: string
  code: string
  used: boolean
}
