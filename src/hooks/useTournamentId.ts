import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Central hook to obtain the tournament id (tid) consistently.
 * Priority order (strict):
 * 1. URL ?tid (NEVER overridden if present)
 * 2. localStorage createdTournamentId
 * 3. Any legacy cached tournamentInfo.id
 *
 * Additionally we now namespace cached tournament info by id (tournamentInfo_<id>) elsewhere.
 * This hook only concerns itself with resolving the id and (optionally) normalising the URL.
 */
export function useTournamentId(options: { normalizeUrl?: boolean } = { normalizeUrl: true }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [tid, setTid] = useState<string | null>(null)

  useEffect(() => {
    // 1. URL param has absolute priority
    const urlTid = searchParams?.get('tid')
    if (urlTid) {
      setTid(urlTid)
      // persist for convenience (do not overwrite other ids indiscriminately)
      try {
        localStorage.setItem('createdTournamentId', urlTid)
      } catch {
        /* ignore */
      }
      return
    }

    // 2. Fallback to localStorage createdTournamentId if no URL param
    let found: string | null = null
    try {
      found = typeof window !== 'undefined' ? localStorage.getItem('createdTournamentId') : null
    } catch {
      /* ignore */
    }

    // 3. Fallback to legacy tournamentInfo (non-namespaced) if still nothing
    if (!found) {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('tournamentInfo') : null
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed?.id && typeof parsed.id === 'string') {
            found = parsed.id
          }
        }
      } catch {
        /* ignore */
      }
    }

    if (found) {
      setTid(found)
      if (options.normalizeUrl) {
        const url = `${pathname}?tid=${encodeURIComponent(found)}`
        router.replace(url)
      }
    } else {
      setTid(null)
    }
  }, [searchParams, router, pathname, options.normalizeUrl])

  return tid
}

export default useTournamentId
