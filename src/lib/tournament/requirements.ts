import type { Tournament } from '@/types/tournamentType'
import type { User } from '@/types/userType'
import type { GameAccountType } from '@/types/gameType'

/**
 * Check if a user has Discord configured (either via OAuth or social links)
 */
export const hasDiscord = (user?: User): boolean => {
  if (!user) {
    return false
  }
  return Boolean(user.discordId || user.socialMediaLinks?.discord)
}

/**
 * Check if a user has a verified Riot account
 */
export const hasRiotAccount = (user?: User): boolean => {
  if (!user) {
    return false
  }
  const riot = user.connectedAcc?.riot
  return Boolean(riot?.gameName && riot?.tagLine)
}

/**
 * Check if a user has Steam connected
 */
export const hasSteamAccount = (user?: User): boolean => {
  if (!user) {
    return false
  }
  return Boolean(user.connectedAcc?.steam?.steamId)
}

/**
 * Check if a user has Epic Games connected
 */
export const hasEpicAccount = (user?: User): boolean => {
  if (!user) {
    return false
  }
  return Boolean(user.connectedAcc?.epicGames?.displayName)
}

/**
 * Check if a user has Xbox connected
 */
export const hasXboxAccount = (user?: User): boolean => {
  if (!user) {
    return false
  }
  return Boolean(user.connectedAcc?.xbox?.gamerTag)
}

/**
 * Check if a user has PSN connected
 */
export const hasPSNAccount = (user?: User): boolean => {
  if (!user) {
    return false
  }
  return Boolean(user.connectedAcc?.psn?.username)
}

/**
 * Check if a user has Battle.net connected
 */
export const hasBattleNetAccount = (user?: User): boolean => {
  if (!user) {
    return false
  }
  return Boolean(user.connectedAcc?.battleNet?.battletag)
}

/**
 * Check if a user has Origin/EA account connected
 */
export const hasOriginAccount = (user?: User): boolean => {
  if (!user) {
    return false
  }
  return Boolean(user.connectedAcc?.origin?.username)
}

/**
 * Check if a user has a game profile for the tournament's game
 */
export const hasGameProfile = (user?: User, gameId?: string): boolean => {
  if (!user || !gameId) {
    return false
  }
  return (user.gameProfiles || []).some(profile => profile.gameId === gameId)
}

/**
 * Check if a user has verified their email
 */
export const hasVerifiedEmail = (user?: User): boolean => {
  if (!user) {
    return false
  }
  return Boolean(user.verifmail)
}

/**
 * Calculate age from date of birth (datenaiss in YYYY-MM-DD format)
 */
export const calculateAge = (datenaiss?: string): number | null => {
  if (!datenaiss) {
    return null
  }
  const birthYear = Number(datenaiss.slice(0, 4))
  if (isNaN(birthYear)) {
    return null
  }
  return new Date().getFullYear() - birthYear
}

/**
 * Check if a user has age/birth date information
 */
export const hasAgeInfo = (user?: User): boolean => {
  if (!user) {
    return false
  }
  return Boolean(user.datenaiss)
}

/**
 * Check if user has the required account type for a specific game account type
 */
export const hasRequiredAccountType = (user?: User, accountType?: GameAccountType): boolean => {
  if (!user || !accountType) {
    return false
  }

  switch (accountType) {
    case 'Steam':
      return hasSteamAccount(user)
    case 'Epic':
      return hasEpicAccount(user)
    case 'Riot':
      return hasRiotAccount(user)
    case 'XBOX':
      return hasXboxAccount(user)
    case 'PSN':
      return hasPSNAccount(user)
    case 'Battle-Net':
      return hasBattleNetAccount(user)
    case 'Origin':
      return hasOriginAccount(user)
    case 'GOG':
      // Add GOG account checking if needed
      return false
    case 'Uplay':
      // Add Uplay account checking if needed
      return false
    default:
      return false
  }
}

/**
 * Check if user meets all required accounts for the tournament's game
 */
export const hasAllRequiredGameAccounts = (tournament: Tournament, user?: User): boolean => {
  if (!user || !tournament.game?.requiredAccounts) {
    return false
  }

  const requiredAccounts = tournament.game.requiredAccounts
  return requiredAccounts.every(accountType => hasRequiredAccountType(user, accountType))
}

/**
 * Check if user meets all tournament requirements
 */
export const meetsAllRequirements = (tournament: Tournament, user?: User): boolean => {
  if (!user) {
    return false
  }

  const jp = tournament.joinProcess
  const checks: boolean[] = []

  if (jp.requireVerifiedEmail) {
    checks.push(hasVerifiedEmail(user))
  }

  if (jp.requireAgeVerification) {
    checks.push(hasAgeInfo(user))
  }

  if (jp.requireDiscordUsername) {
    checks.push(hasDiscord(user))
  }

  if (jp.requireRiotId) {
    checks.push(hasRiotAccount(user))
  }

  if (jp.requireSteamId) {
    checks.push(hasSteamAccount(user))
  }

  if (jp.requireEpicGamesUsername) {
    checks.push(hasEpicAccount(user))
  }

  if (jp.requireGameAccount) {
    checks.push(hasGameProfile(user, tournament.game?._id))
  }

  // NEW: Check custom game identifier requirements
  if (jp.requireCustomGameIdentifier) {
    checks.push(hasAllRequiredGameAccounts(tournament, user))
  }

  return checks.length === 0 || checks.every(check => check === true)
}

/**
 * Get missing requirements for a user joining a tournament
 */
export const getMissingRequirements = (tournament: Tournament, user?: User): string[] => {
  if (!user) {
    return ['User not logged in']
  }

  const jp = tournament.joinProcess
  const missing: string[] = []

  if (jp.requireVerifiedEmail && !hasVerifiedEmail(user)) {
    missing.push('Verified email required')
  }

  if (jp.requireAgeVerification && !hasAgeInfo(user)) {
    missing.push('Age verification required')
  }

  if (jp.requireDiscordUsername && !hasDiscord(user)) {
    missing.push('Discord account required')
  }

  if (jp.requireRiotId && !hasRiotAccount(user)) {
    missing.push('Riot Games account required')
  }

  if (jp.requireSteamId && !hasSteamAccount(user)) {
    missing.push('Steam account required')
  }

  if (jp.requireEpicGamesUsername && !hasEpicAccount(user)) {
    missing.push('Epic Games account required')
  }

  if (jp.requireGameAccount && !hasGameProfile(user, tournament.game?._id)) {
    missing.push('Game profile required')
  }

  // NEW: Check missing game-specific accounts
  if (jp.requireCustomGameIdentifier && tournament.game?.requiredAccounts) {
    const missingAccounts = tournament.game.requiredAccounts.filter(
      accountType => !hasRequiredAccountType(user, accountType),
    )

    if (missingAccounts.length > 0) {
      missing.push(`Required game accounts: ${missingAccounts.join(', ')}`)
    }
  }

  return missing
}

/**
 * Check if the tournament has any extra requirements configured
 */
export const hasExtraRequirements = (tournament: Tournament): boolean => {
  const jp = tournament.joinProcess

  return Boolean(
    jp.requireVerifiedEmail ||
      jp.requireAgeVerification ||
      jp.requireGameAccount ||
      jp.requireDiscordUsername ||
      jp.requireEpicGamesUsername ||
      jp.requireSteamId ||
      jp.requireRiotId ||
      jp.requireRankRating ||
      jp.requireCustomGameIdentifier,
  )
}
