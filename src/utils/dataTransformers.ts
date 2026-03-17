import type { Team } from '@/types/teamType'

export interface TransformedTeam {
  id: string
  username: string
  memberSince: string
  game: string
  followers: number
  profileImageUrl: string
  coverImageUrl: string
  location: string
  founded: string
  website: string
  winrate: string
  tournamentsWon: number
  totalPrizeMoney: number
  currentStreak: number
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    email?: string
  }
  description: string
  wins: number
  losses: number
  bluePoints: number
}

export interface TransformedMember {
  id: string
  username: string
  fullName: string
  matches: number
  winRate: number
  isOwner: boolean
  profileImageUrl: string
}

export interface TransformedGame {
  id: string
  name: string
  logo: string
  slug: string
}

export interface TransformedTournament {
  id: string
  name: string
  description: string
  startDate: string
  coverImage: string
  placement?: number
  placementText?: string
  matchesPlayed?: number
  matchesWon?: number
  roundsWon?: number
  roundsLost?: number
  teamsCount?: number
}

export const transformTeam = (team: Team): TransformedTeam => {
  const totalMatches = (team.wins ?? 0) + (team.losses ?? 0)
  const winrate = totalMatches > 0 ? (((team.wins ?? 0) / totalMatches) * 100).toFixed(1) : '0.0'

  return {
    id: (team as any)._id ?? '', // fallback if _id is not present
    username: team.name ?? '',
    memberSince: team.datecreation
      ? `Member since ${new Date(team.datecreation).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}`
      : 'Member since N/A',
    game: typeof team.game === 'string' ? team.game : ((team.game as any)?.name ?? 'Unknown Game'),
    followers: (team as any).followers?.length ?? 0,
    profileImageUrl: team.profileImage
      ? team.profileImage.startsWith('http')
        ? team.profileImage
        : `/images/${team.profileImage}`
      : '/images/default-profile.png',
    coverImageUrl: team.coverImage
      ? team.coverImage.startsWith('http')
        ? team.coverImage
        : `/images/${team.coverImage}`
      : '/images/default-cover.png',
    location: team.country ?? 'Unknown',
    founded: team.datecreation ? new Date(team.datecreation).toLocaleDateString() : 'N/A',
    website: team.website ?? 'N/A',
    winrate: `${winrate}%`,
    tournamentsWon: (team as any).tournamentsWon ?? 0,
    totalPrizeMoney: (team as any).totalPrizeMoney ?? 0,
    currentStreak: (team as any).currentStreak ?? 0,
    socialLinks: {
      facebook: team.facebook,
      twitter: team.twitter,
      instagram: team.instagram,
      email: team.email,
    },
    description: team.description ?? '',
    wins: team.wins ?? 0,
    losses: team.losses ?? 0,
    bluePoints: team.bluePoints ?? 0,
  }
}

/* export const transformMember = (
  apiUser: ApiUser,
  teamId: string,
  teamOwners: string[],
): TransformedMember => {
  // Find game-specific stats
  const gameStats = apiUser.bluePoints?.[0] || { wins: 0, losses: 0 }
  const totalMatches = gameStats.wins + gameStats.losses
  const winRate = totalMatches > 0 ? (gameStats.wins / totalMatches) * 100 : 0

  return {
    id: apiUser._id,
    username: apiUser.nickname || apiUser.fullname || 'Unknown',
    fullName: apiUser.fullname || 'N/A',
    matches: totalMatches,
    winRate: Number(winRate.toFixed(1)),
    isOwner: teamOwners.includes(apiUser._id),
    profileImageUrl: apiUser.profileImage.startsWith('http')
      ? apiUser.profileImage
      : `/images/${apiUser.profileImage}`,
  }
} */

/* export const transformGame = (apiGame: ApiGame): TransformedGame => {
  // Generate logo URL based on slug or use default
  const logoUrl = apiGame.igdbData?.cover?.url || `/images/games/${apiGame.slug}.png`

  return {
    id: apiGame._id,
    name: apiGame.name,
    logo: logoUrl,
    slug: apiGame.slug,
  }
}

export const transformTournament = (apiTournament: ApiTournament): TransformedTournament => {
  return {
    id: apiTournament._id,
    name: apiTournament.name,
    description: apiTournament.description,
    startDate: apiTournament.startDate,
    coverImage: apiTournament.coverImage.startsWith('http')
      ? apiTournament.coverImage
      : `/images/${apiTournament.coverImage}`,
    teamsCount: apiTournament.participants?.length || 0,
  }
}
 */
