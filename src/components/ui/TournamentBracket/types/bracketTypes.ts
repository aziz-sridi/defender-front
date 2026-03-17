/**
 * Internal Bracket Types
 * Types used for rendering and displaying bracket data
 */

import type { ParticipantWithScore } from './apiTypes'
import type { BracketType } from '@/types/tournamentType'

export type BracketShow = 'WINNER_BRACKET' | 'LOSER_BRACKET' | 'BOTH'

export type Match = {
  id: string
  round: number
  position: number
  participantA: ParticipantWithScore | null
  participantB: ParticipantWithScore | null
  winner?: string
  previousMatchA?: string
  previousMatchB?: string
  createdAt: string
}

export type Bracket = {
  rounds: {
    round: number
    matches: Match[]
  }[]
}

export type LineData = {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  teamIds: string[]
  elbowOffset?: number
  strokeWidth?: number
}

export interface StaffMemberLike {
  user: string | { _id?: string; id?: string } | null | undefined
  role?: string
}

export type ManageableTournamentInput = {
  bracket?: string
  looserBracket?: string
  BracketType?: BracketType
  staff?: StaffMemberLike[]
  name?: string
  participants?: unknown[]
}
