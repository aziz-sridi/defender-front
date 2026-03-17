export type MatchStatus = 'Not Started' | 'Ongoing' | 'Completed' | 'Ready'

export interface MatchScore {
  participant: string
  score: number
}

export interface FFAParticipant {
  participant: string
  score: number
  rank: number
  screenshot?: string
}

export interface MatchScreenshot {
  imageUrl?: string
  setNumber: number
  uploadedBy?: string
  validated: boolean
}

export interface Match {
  _id: string
  round: string
  bracket: string

  participantA?: string
  participantB?: string

  previousMatchA?: string
  previousMatchB?: string

  FFA_Participants: FFAParticipant[]

  flipCoin?: {
    heads?: string
    tail?: string
  }

  blueSide?: string
  redSide?: string

  scores: MatchScore[]

  screenshots: MatchScreenshot[]

  winner?: string

  status: MatchStatus
  startTime?: string
  endTime?: string
  createdAt: string

  isConsolationMatch: boolean
  areReady: number

  messages: string[]
}
