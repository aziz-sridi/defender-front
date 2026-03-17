import { Game } from './gameType'

export type Sex = 'NOT_SPECIFIED' | 'MALE' | 'FEMALE' | 'OTHER'
export type Currency = 'USD' | 'EUR' | 'TND'

export interface Address {
  adress1?: string
  adress2?: string
  city?: string
  zip?: string
}

export interface NotificationSettings {
  social: boolean
  competitions: boolean
  news: boolean
}

export interface SocialMediaLinks {
  facebook?: string
  twitter?: string
  instagram?: string
  youtube?: string
  discord?: string
}

export interface BluePoints {
  gameId: string
  points: number
  wins: number
  losses: number
  lastPlayed: string
}

export interface GameProfile {
  gameId: string
  region?: string
  tag?: string
  username?: string
  platform?: string
}

export interface ConnectedAccounts {
  battleNet?: {
    battletag?: string
    region?: string
    accessToken?: string
  }
  //for the new riot games linking account
  Riotgames?: {
    riotid?: string
    tagline?: string
  }
  mobileLegends?: { game_id: string; zone_id: string }
  steam?: {
    steamId?: string
    username?: string
    profileUrl?: string
    avatar?: string
  }
  epicGames?: {
    displayName?: string
    userId?: string
    accessToken?: string
  }
  xbox?: {
    gamerTag?: string
    xuid?: string
    avatar?: string
    gamerScore?: number
  }
  psn?: {
    username?: string
    psnId?: string
    avatar?: string
  }
  origin?: { username?: string }
  //new link riot

  riot?: {
    puuid?: string
    gameName?: string
    tagLine?: string
    region?: string
    refresh_token?: string
    access_token?: string
  }
}

export interface UserInventory {
  masteryBoxes: string[]
  rewards: string[]
  quests: string[]
}

export interface XPLevel {
  level: number
  xp: number
}

export interface JoinedOrganization {
  organization: string
  role: 'Admin' | 'Bracket Manager' | 'Moderator'
}

export interface User {
  _id: string
  fullname?: string
  firstName?: string
  lastName?: string
  discordUsername?: string
  phone?: number
  accountId?: string
  nickname?: string
  isDefaultNickname?: boolean
  email: string
  password?: string
  sex: Sex
  datenaiss?: string
  user_bio?: string
  link_bio?: string
  achieved: boolean
  accessToken?: string
  activated: boolean
  verifmail: boolean
  otp?: string
  membershipPeriod?: string
  membershipLevel?: string
  organization?: string
  joinedOrganizations?: JoinedOrganization[]
  profileImage?: string
  coverImage?: string
  userInventory?: UserInventory
  xpLevel?: XPLevel
  stripeCustomId?: string
  balance: number
  roles: string[]
  teams: string[]
  gameProfiles: GameProfile[]
  connectedAcc?: ConnectedAccounts
  googleId?: string
  twitchId?: string
  discordId?: string
  facebookId?: string
  oauthEmail?: string
  provider?: string
  bluePoints: BluePoints[]
  redPoints: number
  souls: number
  currency: Currency
  country: string
  adress?: Address
  notificationSettings: NotificationSettings
  socialMediaLinks?: SocialMediaLinks
  favoriteGames: Game[]
  lastLogin?: string
  lastLoginIP?: string
  redeemed: string[]
  following: string[]
  followers: string[]
  createdAt: string
  updatedAt: string
}
