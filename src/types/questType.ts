export type QuestType = 'mission' | 'weekly' | 'daily' | 'seasonal' | 'event'
export type QuestDifficulty = 'easy' | 'medium' | 'hard'
export type QuestStatus = 'active' | 'expired' | 'completed'
export type QuestMode = 'solo' | 'team'

export interface QuestCondition {
  action?: string
  value?: number
  gameId?: string
  mode?: QuestMode
}

export interface SpecialRequirement {
  type?: string
  value?: string
}

export interface Quest {
  _id: string
  title: string
  description?: string
  type?: QuestType
  difficulty?: QuestDifficulty
  xpReward?: number
  bluePointsReward?: number
  redPointsReward?: number
  status?: QuestStatus
  maxAttempts?: number
  conditions?: QuestCondition[]
  cooldownPeriod?: number
  isHidden?: boolean
  specialRequirements?: SpecialRequirement[]
  rewards?: string[]
  createdAt: string
  updatedAt: string
}
