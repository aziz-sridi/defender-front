export interface MembershipPeriod {
  _id: string
  user: string
  membershipLevel: string
  activationDate: string
  expirationDate?: string
  expired: boolean
}
