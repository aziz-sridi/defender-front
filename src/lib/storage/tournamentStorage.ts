// Utilities for per-tournament namespaced storage (front-only)
// - Drafts are kept in sessionStorage (per-tab)
// - Persistent info is kept in localStorage, namespaced by tournament id

type NamespaceKeyName =
  | 'info'
  | 'scheduleDraft'
  | 'participationDraft'
  | 'scheduleSavedFlag'
  | 'participationSavedFlag'

const NS_PREFIX = 'defendr:tournament'

const safeJsonParse = <T>(raw: string | null): T | null => {
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function getCurrentTournamentId(): string | null {
  try {
    const createdId = localStorage.getItem('createdTournamentId')
    if (createdId) {
      return createdId
    }
    const infoRaw = localStorage.getItem('tournamentInfo')
    if (infoRaw) {
      const info = safeJsonParse<{ id?: string }>(infoRaw)
      if (info?.id) {
        return String(info.id)
      }
    }
  } catch {
    // ignore
  }
  return null
}

export function nsKey(name: NamespaceKeyName, tid?: string | null): string {
  const idPart = tid || 'new'
  switch (name) {
    case 'info':
      return `${NS_PREFIX}:${idPart}:info`
    case 'scheduleDraft':
      return `${NS_PREFIX}:${idPart}:schedule:draft`
    case 'participationDraft':
      return `${NS_PREFIX}:${idPart}:participation:draft`
    case 'scheduleSavedFlag':
      return `${NS_PREFIX}:${idPart}:schedule:saved`
    case 'participationSavedFlag':
      return `${NS_PREFIX}:${idPart}:participation:saved`
    default:
      return `${NS_PREFIX}:${idPart}:misc`
  }
}

export function readSessionDraft<T>(
  name: Extract<NamespaceKeyName, 'scheduleDraft' | 'participationDraft'>,
  tid?: string | null,
): T | null {
  try {
    const raw = sessionStorage.getItem(nsKey(name, tid))
    return safeJsonParse<T>(raw)
  } catch {
    return null
  }
}

export function writeSessionDraft(
  name: Extract<NamespaceKeyName, 'scheduleDraft' | 'participationDraft'>,
  value: unknown,
  tid?: string | null,
) {
  try {
    sessionStorage.setItem(nsKey(name, tid), JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function readInfo<T = Record<string, unknown>>(tid?: string | null): T | null {
  try {
    const raw = localStorage.getItem(nsKey('info', tid))
    const parsed = safeJsonParse<T>(raw)
    if (parsed) {
      return parsed
    }
    // Fallback to legacy key for backward compatibility
    const legacyRaw = localStorage.getItem('tournamentInfo')
    return safeJsonParse<T>(legacyRaw)
  } catch {
    return null
  }
}

export function writeInfo(update: Record<string, unknown>, tid?: string | null, merge = true) {
  try {
    const k = nsKey('info', tid)
    const existing = merge ? readInfo<Record<string, unknown>>(tid) || {} : {}
    const next = { ...existing, ...update }
    localStorage.setItem(k, JSON.stringify(next))
    // Mirror to legacy key as well for other pages still reading it
    localStorage.setItem('tournamentInfo', JSON.stringify(next))
  } catch {
    // ignore
  }
}

export function markSaved(
  name: Extract<NamespaceKeyName, 'scheduleSavedFlag' | 'participationSavedFlag'>,
  tid?: string | null,
) {
  try {
    localStorage.setItem(nsKey(name, tid), 'true')
  } catch {
    // ignore
  }
}

export function readSaved(
  name: Extract<NamespaceKeyName, 'scheduleSavedFlag' | 'participationSavedFlag'>,
  tid?: string | null,
): boolean {
  try {
    return localStorage.getItem(nsKey(name, tid)) === 'true'
  } catch {
    return false
  }
}
