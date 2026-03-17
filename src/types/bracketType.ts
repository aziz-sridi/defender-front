export type BracketType =
  | 'LOSERS_BRACKET'
  | 'WINNERS_BRACKET'
  | 'ROUND_ROBIN_BRACKET'
  | 'FREE_FOR_ALL_BRACKET'
  | 'SWISS_BRACKET'

export type BracketStatus = 'Not Started' | 'Ongoing' | 'Completed'

export interface Bracket {
  _id: string
  tournament: string
  type: BracketType
  rounds: string[]
  currentRound?: string | null
  swissRound?: string | null
  winner?: string
  swiss_winners?: string[]
  participants: string[]
  status: BracketStatus
  createdBy: string
  createdAt: string
  consolationRound?: string | null
  finalRound?: string | null
}
