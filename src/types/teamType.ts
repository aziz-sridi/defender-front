export interface Team {
  // team information
  _id: string
  name: string
  description: string
  coverImage?: string
  profileImage?: string

  // social media
  facebook?: string
  twitter?: string
  discord?: string
  instagram?: string

  datecreation: string
  achieved?: boolean

  followers?: string[] // populated users
  likes?: string[]

  game: string // populated Game ID
  prizes?: string[] // populated Prize IDs

  bluePoints?: number
  wins?: number
  losses?: number

  lastPlayed?: string

  // ownership & roster
  teamowner: {
    user: string
    role: string // "owner"
  }[]

  teamroster?: {
    user: string
    role: string // "member"
    joinedAt?: string
  }[]

  invitations?: {
    user: string
    sentAt?: string
    status?: 'pending' | 'accepted' | 'declined'
    role?: string
  }[]

  requests?: {
    user: string
    sentAt?: string
  }[]

  archieved?: boolean

  // contact info
  phone?: number
  email?: string
  website?: string
  country?: string

  // added attributes
  isTeamPublic?: boolean
  isJoinRequestsAllowed?: boolean
  isTeamNotificationEnabled?: boolean

  createdAt?: string
  updatedAt?: string
}
