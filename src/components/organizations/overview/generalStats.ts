import type { Organization } from '@/types/organizationType'
import type { Tournament } from '@/types/tournamentType'

export interface GeneralStats {
  organizedTournaments: number
  totalParticipants: number
  totalPrizeMoney: string | number
}

export function getGeneralStats(
  organization: Organization,
  tournaments: Tournament[],
): GeneralStats {
  let organizedTournaments = 0
  if (Array.isArray(tournaments) && tournaments.length > 0) {
    organizedTournaments = tournaments.length
  } else if (Array.isArray(organization?.tournaments)) {
    organizedTournaments = organization.tournaments.length
  }
  let totalParticipants = 0
  if (Array.isArray(tournaments) && tournaments.length > 0) {
    totalParticipants = tournaments.reduce(
      (acc, t) => acc + (Array.isArray(t.participants) ? t.participants.length : 0),
      0,
    )
  }

  let totalPrizeMoney: string | number = '0'
  if (organization && 'totalPrizeMoney' in organization) {
    const v = (organization as unknown as { totalPrizeMoney?: unknown }).totalPrizeMoney
    totalPrizeMoney = typeof v === 'string' || typeof v === 'number' ? v : String(v ?? '0')
  } else if (organization && 'stats' in (organization as unknown as Record<string, unknown>)) {
    const stats = (organization as unknown as { stats?: { prizeMoney?: unknown } }).stats
    const v = stats?.prizeMoney
    totalPrizeMoney = typeof v === 'string' || typeof v === 'number' ? v : String(v ?? '0')
  }

  return {
    organizedTournaments,
    totalParticipants,
    totalPrizeMoney,
  }
}
