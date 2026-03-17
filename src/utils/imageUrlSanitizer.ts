import { Game } from '@/types/gameType'
import { BASE_URL } from '@/lib/api/constants'

// Default image paths constants
export const DEFAULT_IMAGES = {
  USER: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20logo/user.png',
  USER_BANNER:
    'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20covers/default%20user.jpg',
  TEAM: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20logo/team.png',
  TEAM_BANNER:
    'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20covers/default%20team.jpg',
  ORGANIZATION:
    'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20logo/org.png',
  ORGANIZATION_BANNER:
    'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20covers/default%20organization.jpg',
  TOURNAMENT:
    'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20covers/default%20tournamnet.jpg',
  FLAG: '/assets/images/default-flag.svg',
} as const

export const getGameImageUrl = (game: Game | any, fallback?: string): string => {
  const defaultFallback = fallback ?? ''

  if (!game?.igdbData) {
    return defaultFallback
  }

  const igdbData = Array.isArray(game.igdbData) ? game.igdbData[0] : game.igdbData

  if (!igdbData) {
    return defaultFallback
  }

  if (igdbData.cover?.image_id) {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${igdbData.cover.image_id}.jpg`
  }

  if (igdbData.cover?.url) {
    return `https:${igdbData.cover.url.replace('t_thumb', 't_cover_big')}`
  }

  // Debug log for missing covers
  if (game?.name) {
    console.warn(`[getGameImageUrl] Missing cover for game: ${game.name}`, { igdbData })
  }

  return defaultFallback
}

export const teamImageSanitizer = (url: string, fallback?: string): string => {
  return imageUrlSanitizer(url, 'team', fallback)
}

// Unified image sanitizer that handles all types
export const imageUrlSanitizer = (
  url: string,
  type: 'user' | 'team' | 'tournament' | 'organization' | 'general' = 'general',
  fallback?: string,
): string => {
  // Define type-specific configurations
  const typeConfig = {
    user: {
      fallback: DEFAULT_IMAGES.USER,
      baseUrl: `${BASE_URL}user/images/`,
      cloudflareUrl: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/migrated/user/',
      typeName: 'user',
    },
    team: {
      fallback: DEFAULT_IMAGES.TEAM,
      baseUrl: `${BASE_URL}team/images/`,
      cloudflareUrl: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/migrated/team/',
      typeName: 'team',
    },
    tournament: {
      fallback: DEFAULT_IMAGES.TOURNAMENT,
      baseUrl: `${BASE_URL}tournament/images/`,
      cloudflareUrl: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/migrated/tournament/',
      typeName: 'tournament',
    },
    organization: {
      fallback: DEFAULT_IMAGES.ORGANIZATION,
      baseUrl: `${BASE_URL}organization/images/`,
      cloudflareUrl: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/migrated/organization/',
      typeName: 'organizer',
    },
    general: {
      fallback: DEFAULT_IMAGES.USER,
      baseUrl: '',
      cloudflareUrl: 'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/migrated/general/',
      typeName: 'image',
    },
  }

  const config = typeConfig[type]
  const defaultFallback = fallback ?? config.fallback

  if (!url) {
    return defaultFallback
  }

  // Check for invalid filenames (containing spaces or double-quotes). Allow percent-encoded URLs and apostrophes.
  if (url.includes(' ') || url.includes('"')) {
    console.warn(`Invalid ${config.typeName} image filename detected:`, url)
    return defaultFallback
  }

  // If it's already a complete URL (http/https)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Fix double-prefixed URLs from the backend, e.g.:
    // "https://api-dev.defendr.gg/tournament/images/https://pub-...r2.dev/migrated/..."
    // Extract the inner (real) URL.
    const innerHttpIdx = url.indexOf('http', 8) // skip past the first "https://"
    if (innerHttpIdx > 0) {
      return url.substring(innerHttpIdx)
    }
    return url
  }

  // If it's already a relative path starting with /, return as is
  if (url.startsWith('/')) {
    return url
  }

  // For general type, just add leading slash
  if (type === 'general') {
    return `/${url}`
  }

  // For specific types with base URLs
  if (config.baseUrl) {
    // If it already contains the base URL, clean it up
    if (url.includes(config.baseUrl)) {
      const cleanUrl = url.replace(config.baseUrl, '')
      return config.baseUrl + cleanUrl
    }

    // If it's a relative path without leading slash, add the base URL
    if (!url.startsWith('/')) {
      return config.baseUrl + url
    }
  }

  return defaultFallback
}

export const userImageSanitizer = (url?: string, fallback?: string): string => {
  return imageUrlSanitizer(url || '', 'user', fallback ?? DEFAULT_IMAGES.USER)
}

export const tournamentImageSanitizer = (url?: string, fallback?: string): string => {
  return imageUrlSanitizer(url || '', 'tournament', fallback ?? DEFAULT_IMAGES.TOURNAMENT)
}

export const organizerImageSanitizer = (url?: string, fallback?: string): string => {
  return imageUrlSanitizer(url || '', 'organization', fallback ?? DEFAULT_IMAGES.ORGANIZATION)
}

// Banner-specific sanitizers
export const userBannerSanitizer = (url: string | undefined | null, fallback?: string): string =>
  imageUrlSanitizer(url || '', 'user', fallback ?? DEFAULT_IMAGES.USER_BANNER)

export const teamBannerSanitizer = (url: string | undefined | null, fallback?: string): string =>
  imageUrlSanitizer(url || '', 'team', fallback ?? DEFAULT_IMAGES.TEAM_BANNER)

export const organizationBannerSanitizer = (
  url: string | undefined | null,
  fallback?: string,
): string =>
  imageUrlSanitizer(url || '', 'organization', fallback ?? DEFAULT_IMAGES.ORGANIZATION_BANNER)
