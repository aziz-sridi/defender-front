export type XpEvent = 'completed_mission' | 'won_tournament'

export interface XpHistoryEntry {
  event: XpEvent
  xpGained: number
  timestamp: number
}

export interface Xp {
  _id: string
  userId: string
  currentXP: number
  level: string
  xpRequiredForNextLevel: number
  streakCount: number
  history: XpHistoryEntry[]
  leaderboard: string
  createdAt: string
  updatedAt: string
}
