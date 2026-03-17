export type LeaderboardType = 'global' | 'weekly' | 'tournament'

export interface LeaderboardRanking {
  user: string
  rank: number
  xp: number
  bluePoints: number
  redPoints: number
  tournamentWins: number
}

export interface Leaderboard {
  _id: string
  name: string
  type: LeaderboardType
  rankings: LeaderboardRanking[]
  createdAt: string
  updatedAt: string
}
