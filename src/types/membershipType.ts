export interface MembershipBenefits {
  participateFree: boolean
  freeBracketRound: boolean
  standardPrizeWinnings: boolean
  watchStreams: boolean
  bonusPoints: number
  weeklyPoints: number
  maxTournaments: number
  prizeWinnings: boolean
  extraBoxes: number
  exclusiveContent: string
  canStreamTournaments: boolean
  maxTeamsPerTournament: number
  price: number
}

export interface MembershipLevel {
  _id: string
  name: string
  benefits: MembershipBenefits
  activationDate: string
  expressionDate?: string
}
