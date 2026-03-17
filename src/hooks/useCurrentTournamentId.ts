'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export function useCurrentTournamentId(): string | null {
  const params = useSearchParams()
  const paramTid = params.get('tid')
  const [tid, setTid] = useState<string | null>(null)

  useEffect(() => {
    // Priority 1: URL param
    if (paramTid) {
      setTid(paramTid)
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('createdTournamentId', paramTid)
        }
        if (typeof document !== 'undefined') {
          document.cookie = `createdTournamentId=${encodeURIComponent(paramTid)}; path=/; max-age=$
            {60 * 60 * 24 * 7}`
        }
      } catch {
        // ignore persistence errors
      }
      return
    }

    // Priority 2: cookie
    const cookieTid = getCookie('createdTournamentId')
    if (cookieTid) {
      setTid(cookieTid)
      return
    }

    // Priority 3: localStorage
    try {
      const lsTid =
        typeof localStorage !== 'undefined' ? localStorage.getItem('createdTournamentId') : null
      setTid(lsTid)
    } catch {
      setTid(null)
    }
  }, [paramTid])

  return useMemo(() => tid, [tid])
}
