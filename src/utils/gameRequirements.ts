import type { Game, GameAccountType } from '@/types/gameType'
import type { Tournament } from '@/types/tournamentType'

/**
 * Game-specific configuration for required accounts
 */
export const GAME_REQUIREMENTS: Record<string, GameAccountType[]> = {
  FC26: ['Origin'], // FC26 requires EA/Origin account
  FIFA: ['Origin'], // FIFA requires EA/Origin account
  'Apex Legends': ['Origin'], // Apex Legends requires EA/Origin account
  Valorant: ['Riot'], // Valorant requires Riot account
  'League of Legends': ['Riot'], // LoL requires Riot account
  CS2: ['Steam'], // Counter-Strike 2 requires Steam account
  'Dota 2': ['Steam'], // Dota 2 requires Steam account
  Fortnite: ['Epic'], // Fortnite requires Epic Games account
  'Rocket League': ['Epic'], // Rocket League requires Epic Games account
  'Overwatch 2': ['Battle-Net'], // Overwatch 2 requires Battle.net account
  'Call of Duty': ['Battle-Net'], // Call of Duty requires Battle.net account
  PUBG: ['Steam'], // PUBG requires Steam account
  'Rainbow Six Siege': ['Steam'], // R6 Siege requires Steam account
}

/**
 * Get required accounts for a specific game
 */
export const getRequiredAccountsForGame = (game: Game): GameAccountType[] => {
  // First check if the game has requiredAccounts defined
  if (game.requiredAccounts && game.requiredAccounts.length > 0) {
    return game.requiredAccounts
  }

  // Fallback to predefined requirements based on game name
  const gameName = game.name.toLowerCase()
  const gameSlug = game.slug?.toLowerCase()

  // Check by exact name match
  if (GAME_REQUIREMENTS[game.name]) {
    return GAME_REQUIREMENTS[game.name]
  }

  // Check by slug
  if (gameSlug && GAME_REQUIREMENTS[gameSlug]) {
    return GAME_REQUIREMENTS[gameSlug]
  }

  // Check by partial name match
  for (const [key, accounts] of Object.entries(GAME_REQUIREMENTS)) {
    if (gameName.includes(key.toLowerCase()) || key.toLowerCase().includes(gameName)) {
      return accounts
    }
  }

  return []
}

/**
 * Check if a tournament should require custom game identifiers
 */
export const shouldRequireCustomGameIdentifier = (game: Game): boolean => {
  const requiredAccounts = getRequiredAccountsForGame(game)
  return requiredAccounts.length > 0
}

/**
 * Get human-readable account type names
 */
export const getAccountTypeDisplayName = (accountType: GameAccountType): string => {
  const displayNames: Record<GameAccountType, string> = {
    Steam: 'Steam',
    Epic: 'Epic Games',
    Riot: 'Riot Games',
    XBOX: 'Xbox',
    PSN: 'PlayStation Network',
    'Battle-Net': 'Battle.net',
    Origin: 'EA/Origin',
    GOG: 'GOG',
    Uplay: 'Ubisoft Connect',
  }

  return displayNames[accountType] || accountType
}

/**
 * Get account connection instructions for each account type
 */
export const getAccountConnectionInstructions = (accountType: GameAccountType): string => {
  const instructions: Record<GameAccountType, string> = {
    Steam: 'Connect your Steam account to verify your Steam ID',
    Epic: 'Connect your Epic Games account to verify your Epic Games username',
    Riot: 'Connect your Riot Games account to verify your Riot ID',
    XBOX: 'Connect your Xbox account to verify your Gamertag',
    PSN: 'Connect your PlayStation Network account to verify your PSN username',
    'Battle-Net': 'Connect your Battle.net account to verify your BattleTag',
    Origin: 'Connect your EA/Origin account to verify your EA account ID',
    GOG: 'Connect your GOG account to verify your GOG username',
    Uplay: 'Connect your Ubisoft Connect account to verify your Ubisoft username',
  }

  return instructions[accountType] || `Connect your ${accountType} account`
}

/**
 * Validate tournament requirements configuration
 */
export const validateTournamentRequirements = (
  tournament: Tournament,
): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} => {
  const errors: string[] = []
  const warnings: string[] = []

  const jp = tournament.joinProcess

  // Check if requireCustomGameIdentifier is set but game has no required accounts
  if (jp.requireCustomGameIdentifier && !tournament.game?.requiredAccounts?.length) {
    const requiredAccounts = getRequiredAccountsForGame(tournament.game)
    if (requiredAccounts.length === 0) {
      warnings.push(`Game "${tournament.game?.name}" doesn't have any required accounts configured`)
    }
  }

  // Check if game has required accounts but requireCustomGameIdentifier is not set
  if (tournament.game?.requiredAccounts?.length && !jp.requireCustomGameIdentifier) {
    warnings.push(
      `Game "${tournament.game.name}" has required accounts but custom game identifier requirement is not enabled`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
