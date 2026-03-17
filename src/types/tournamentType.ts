import { Game } from './gameType'
import { Organization } from './organizationType'
import { Participant } from './participantType'
import { Prize } from './prizeType'
import { User } from './userType'

export type GameMode = 'Team' | 'Solo'
export type TournamentType = 'Free' | 'Paid'
export type BracketType =
  | 'SINGLE_ELIMINATION'
  | 'DOUBLE_ELIMINATION'
  | 'ROUND_ROBIN'
  | 'SWISS'
  | 'FREE_FOR_ALL'
  | 'UNDEFINED'
export type StageType = 'SINGLE_STAGE' | 'TWO_STAGE'
export type MatchScoreReporting = 'Admins' | 'AdminsAndPlayers'

export interface StreamingPlatform {
  platform?: string
  link?: string
}

export interface RequestToJoin {
  user: User
  message: string
}

export interface CommunicationSettings {
  discordLink?: string
  contactDetails?: string
  communicationPreferences?: string
}

export interface GameSettings {
  region?: string
  server?: string
  map?: string
  format?: string
  FFA_maxPlayers?: number
  FFA_lastRound?: number
  teamSize: 2 | 3 | 4 | 5 | 6
}

export interface TournamentFormat {
  checkInEnabled: boolean
  hasConsolationRound: boolean
  matchScoreReporting: MatchScoreReporting
}

export interface JoinProcess {
  limitedBySkillLevel: boolean
  requireVerifiedEmail: boolean
  requireSubscription: boolean
  allowSouls: boolean
  inHouseQueue: boolean
  maxFreeAgents: number
  entryFee: number
  perTeamPurchasing: boolean
  numberOfParticipants?: number
  numberOfSubstitutes: number
  linkGameRequired: boolean
  requireRankRating: boolean
  requireCustomGameIdentifier: boolean
  requireGameAccount: boolean
  // Extended requirement flags (added for pre-join verification step)
  requireDiscordUsername: boolean
  requireEpicGamesUsername: boolean
  requireSteamId: boolean
  requireRiotId: boolean
  requiredPhoneNumber: boolean
  requireAgeVerification: boolean
  requiredCountry: boolean
  requiredFacebookLink: boolean
  requiredInstagramLink: boolean
  requiredFullname: boolean
}

export interface StructureProcess {
  signUpOpening?: string
  signUpClosing?: string
  checkInPeriod?: string
  // New registration window fields
  registrationStartDate?: string
  registrationEndDate?: string
}

export interface ManagementSettings {
  emailParticipants: boolean
  participantList?: string
  autoSeedBrackets: boolean
}

export interface Tournament {
  _id: string
  createdBy: Organization // Organization
  name: string
  description: string
  startDate: string
  startTime?: string
  autoStart: boolean
  started: boolean
  isClosed: boolean
  coverImage: string
  achieved: boolean
  communication?: CommunicationSettings
  winner?: string
  participants: Participant[]
  freeAgents: string[]
  requestsToJoin: RequestToJoin[]
  rules?: string
  staff: any
  game: Game
  reviews?: string[]
  rating: number
  gameMode: GameMode
  gameSettings?: GameSettings
  tournamentType: TournamentType
  maxParticipants: number
  tournamentFormat: TournamentFormat
  BracketType: BracketType
  stage_type: StageType
  bracket?: string
  looserBracket?: string
  swissBrackets: string[]
  streaming?: StreamingPlatform[]
  joinProcess: JoinProcess
  prizes?: Prize[]
  publishing: boolean
  structureProcess?: StructureProcess
  management?: ManagementSettings
  createdAt: string
  updatedAt: string
}
