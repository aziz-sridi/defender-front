import { Team } from './teamType'
import { User } from './userType'

export type ParticipantStatus = 'Registered' | 'Rejected' | 'Pending'
export type TeamRole = 'Captain' | 'Member'
export type ParticipantType = 'Solo' | 'Team'
export type PlayerType = 'MAIN' | 'SUBSTITUTE'
export type InviteStatus = 'PENDING' | 'CONFIRMATION_NOT_COMPLETED' | 'ACCEPTED' | 'REJECTED'

export interface PerformanceData {
  wins: number
  losses: number
  matchesPlayed: number
}

export interface InvitedMember {
  user: User | string
  playerType: PlayerType
  status: InviteStatus
  isFreeAgent: boolean
}

export interface RejectedInvite {
  user: string
  playerType: PlayerType
  isFreeAgent: boolean
}

export interface PaymentInfo {
  user: string
  paymentRef?: string
  payment?: string
  hasPaid: boolean
}

export interface Participant {
  _id: string
  tournament: string
  user?: User
  team?: Team
  teamMembers: string[]
  invitedMembers: InvitedMember[]
  rejectedInvites: RejectedInvite[]
  pendingMembers: string[]
  mainMembers: string[]
  substituteMembers: string[]
  wantedFreeAgents: string[]
  remainingFreeAgentSlots: number
  amount?: number
  paymentRef?: string
  payment?: string
  paymentInfos: PaymentInfo[]
  participationDate: string
  performanceData: PerformanceData
  status: ParticipantStatus
  paymentInfo?: string
  contactEmail?: string
  teamRole?: TeamRole
  comments?: string
  participantType: ParticipantType
  checkin: boolean
}
