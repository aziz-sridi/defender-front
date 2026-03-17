export interface PartnerContact {
  _id: string
  firstName: string
  lastName: string
  email: string
  ticket: string
  message: string
  additionalDetails?: string
  newsletterConsent: boolean
  createdAt: string
}
