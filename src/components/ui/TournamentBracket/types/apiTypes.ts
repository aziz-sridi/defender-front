/**
 * API Data Types
 * Types corresponding to backend API responses for tournament brackets
 */

export type ApiUser = {
  _id: string
  nickname: string
  profileImage: string
  coverImage: string
}

export type ApiTeam = {
  _id: string
  name: string
  profileImage: string
}

export type ApiParticipant = {
  _id: string
  user?: ApiUser
  team?: ApiTeam
}

export type ParticipantWithScore = ApiParticipant & {
  score: number
}

export type ApiScore = {
  participant: string
  score: number
  _id: string
}

export type ApiMatch = {
  _id: string
  round: string
  bracket: string
  participantA: ApiParticipant | null
  participantB: ApiParticipant | null
  scores: ApiScore[]
  status: string
  winner?: string
  previousMatchA?: string
  previousMatchB?: string
  createdAt: string
  [key: string]: any
}

export type ApiRound = {
  _id: string
  bracket: string
  number: number
  matches: ApiMatch[]
  status: string
  sets: number
  isFinal: boolean
  [key: string]: any
}

export type ApiBracket = {
  _id?: string
  tournament?: string
  type?: string
  rounds: ApiRound[]
  status?: string
  [key: string]: any
}
