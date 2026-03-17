export type TicketStatus = 'open' | 'in_progress' | 'resolved'

export interface Ticket {
  _id: string
  requester: string
  staffAssigned?: string
  status: TicketStatus
  message: string
  createdAt: string
  updatedAt: string
  matchId?: string
  tournamentId?: string
  organizationId?: string
}
