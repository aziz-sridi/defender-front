export type GamePlatform = 'PC' | 'Playstation' | 'XBOX' | 'Nintendo Switch' | 'iOS' | 'Android'

export type GameAccountType =
  | 'Steam'
  | 'Epic'
  | 'Origin'
  | 'Uplay'
  | 'Riot'
  | 'Battle-Net'
  | 'GOG'
  | 'PSN'
  | 'XBOX'
  | 'MobileLegends'
  | 'konami'

export interface Game {
  _id: string
  name: string
  slug: string
  igdbId?: number
  igdbData?: Record<string, any>
  tournament?: string
  platforms?: GamePlatform[]
  requiredAccounts: GameAccountType[]
  requireGameTag: boolean
  genre?: string
  description?: string
}
