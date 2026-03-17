export type OrganizationRole = 'Founder' | 'Admin' | 'Bracket Manager' | 'Moderator'

export interface Organization {
  _id: string
  name: string
  country?: string
  createdBy: string
  releaseDay?: string
  logoImage?: string
  bannerImage?: string
  bio?: string
  badges: string[]
  socialMediaLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    discord?: string
    youtube?: string
    twitch?: string
    email?: string
  }
  staff: {
    user: string
    role: OrganizationRole
  }[]
  invitations: {
    user: string
    role: Exclude<OrganizationRole, 'Founder'>
  }[]
  tournaments: string[]
  followers: string[]
  nbFollowers: number
  subscription?: string
  website?: string
  email?: string
  phoneNumber?: string
  profileImage?: string
  address?: string
  achieved: boolean
  establishedDate?: string
  missionVision?: string
  memberCount?: number
  activeTournaments?: number
  socialMediaFollowers?: number
  public: boolean
  verified: boolean
  paymentHistory: string[]
  souls: number
  redPoints: number
  rating: number
}
