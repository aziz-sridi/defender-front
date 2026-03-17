import { create } from 'zustand'

export interface ParticipantSettingsDraft {
  confirmationRequest: boolean
  scoreReporting: 'admins-only' | 'admins-players'
  limitBySkillLevel: boolean
  minSkillLevel: string
  maxSkillLevel: string
  requireSupporters: boolean
  requireVerifiedEmail: boolean
  acceptRules: boolean
  registrationFields: Record<string, boolean>
}

interface TournamentDraftState {
  bracketType?: string
  prizesAdded: number
  rules?: string
  streamingPlatforms: Array<{ platform: string; link: string }>
  participantSettings?: ParticipantSettingsDraft
  setBracketType: (t: string) => void
  setRules: (r: string) => void
  setPrizesCount: (c: number) => void
  setStreaming: (p: Array<{ platform: string; link: string }>) => void
  setParticipantSettings: (p: ParticipantSettingsDraft) => void
  reset: () => void
}

export const useTournamentDraftStore = create<TournamentDraftState>(set => ({
  prizesAdded: 0,
  streamingPlatforms: [],
  setBracketType: bracketType => set({ bracketType }),
  setRules: rules => set({ rules }),
  setPrizesCount: prizesAdded => set({ prizesAdded }),
  setStreaming: streamingPlatforms => set({ streamingPlatforms }),
  setParticipantSettings: participantSettings => set({ participantSettings }),
  reset: () =>
    set({
      bracketType: undefined,
      prizesAdded: 0,
      rules: undefined,
      streamingPlatforms: [],
      participantSettings: undefined,
    }),
}))

// Simple step validation helpers (can expand per business rules)
export const isBracketStepValid = () => !!useTournamentDraftStore.getState().bracketType
export const isPrizesStepValid = () => useTournamentDraftStore.getState().prizesAdded > 0
export const isRulesStepValid = () => {
  const r = useTournamentDraftStore.getState().rules
  return !!r && r.trim().length > 10
}
export const isStreamingStepValid = () =>
  useTournamentDraftStore.getState().streamingPlatforms.some(s => s.platform && s.link)
