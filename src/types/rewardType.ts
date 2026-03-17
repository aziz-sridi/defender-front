export type RewardType = 'redPoints' | 'badge' | 'item' | 'chest'
export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type RewardSource = 'quest' | 'tournament' | 'achievement' | 'dailyLogin'

export interface RewardCondition {
  type?: string
  value?: string
}

export interface Reward {
  _id: string
  type?: RewardType
  name?: string
  description?: string
  value?: number
  rarity?: RewardRarity
  isStackable?: boolean
  source?: RewardSource
  conditions?: RewardCondition[]
  relatedXP?: string
  relatedQuest?: string
  createdAt: string
  updatedAt: string
}
