import { cookies } from 'next/headers'

import { getBracketById, getBracketByTournamentId } from '@/services/bracketService'
import { getTournamentById } from '@/services/tournamentService'
import TournamentBracket from '@/components/ui/TournamentBracket/TournamentBracket'
import type { BracketType } from '@/types/tournamentType'
import type { ManageableTournamentInput } from '@/components/ui/TournamentBracket/types'

type RawBracket = { _id: string; name?: string; rounds?: unknown[]; looserBracket?: string }

interface BracketData extends ManageableTournamentInput {
  bracket: string
  looserBracket: string
  name: string
  BracketType: BracketType
}

export const dynamic = 'force-dynamic'

const extractId = (val: unknown): string | undefined => {
  if (typeof val === 'string') {
    return val
  }
  if (val && typeof val === 'object') {
    const obj = val as Record<string, unknown>
    const anyId = (obj.$oid ?? obj._id ?? obj.id) as unknown
    if (typeof anyId === 'string') {
      return anyId
    }
  }
  return undefined
}

export default async function BracketViewPage(props: { searchParams?: Promise<{ tid?: string }> }) {
  // Prefer tid from query string, else cookie
  const cookieStore = await cookies()
  const sp = ((await props.searchParams) ?? {}) as { tid?: string }
  const queryTournamentId = sp.tid
  const cookieTournamentId = cookieStore.get('createdTournamentId')?.value
  const tournamentId = queryTournamentId || cookieTournamentId || ''

  let bracketData: BracketData = {
    bracket: '',
    looserBracket: '',
    name: 'Tournament Bracket',
    BracketType: 'SINGLE_ELIMINATION',
  }
  let error: string | null = null

  try {
    if (!tournamentId) {
      throw new Error('No tournament selected. Missing tid query parameter.')
    }

    // Helper to safely unwrap a bracket-shaped object
    const unwrapBracket = (val: unknown): RawBracket | null => {
      if (!val || typeof val !== 'object') {
        return null
      }
      const obj = val as Record<string, unknown>
      const inner =
        obj.bracket && typeof obj.bracket === 'object'
          ? (obj.bracket as Record<string, unknown>)
          : obj
      const id = inner._id as string | undefined
      if (typeof id === 'string') {
        return {
          _id: id,
          name: (inner.name as string | undefined) ?? undefined,
          rounds: (inner.rounds as unknown[] | undefined) ?? undefined,
          looserBracket: (inner.looserBracket as string | undefined) ?? undefined,
        }
      }
      return null
    }

    // First try: use brackets-by-tournament endpoint
    let mainBracket: RawBracket | null = null
    let loserBracket: RawBracket | null = null
    try {
      const bracketResponse: { brackets: unknown[] } = await getBracketByTournamentId(tournamentId)
      const list = Array.isArray(bracketResponse?.brackets) ? bracketResponse.brackets : []
      if (list.length > 0) {
        const main = unwrapBracket(list[0])
        const los = unwrapBracket(list[1])
        if (main) {
          mainBracket = main
        }
        if (los) {
          loserBracket = los
        }
      }
    } catch {
      // Ignore and fall back to fetching tournament then bracket by id
    }

    // Fallback: get tournament then its bracket ids
    if (!mainBracket) {
      const t = await getTournamentById(tournamentId)
      if (!t) {
        throw new Error('Tournament not found')
      }
      if (t.bracket) {
        const bracketId = extractId(t.bracket) || (typeof t.bracket === 'string' ? t.bracket : '')
        if (bracketId) {
          const res: unknown = await getBracketById(bracketId)
          const unwrapped =
            res && typeof res === 'object' && (res as Record<string, unknown>).bracket
              ? (res as Record<string, unknown>).bracket
              : res
          mainBracket = unwrapped as RawBracket
        }
      }
      if (t.looserBracket) {
        try {
          const loserId =
            extractId(t.looserBracket) ||
            (typeof t.looserBracket === 'string' ? t.looserBracket : '')
          if (loserId) {
            const resL: unknown = await getBracketById(loserId)
            const unwrappedL =
              resL && typeof resL === 'object' && (resL as Record<string, unknown>).bracket
                ? (resL as Record<string, unknown>).bracket
                : resL
            loserBracket = unwrappedL as RawBracket
          }
        } catch {
          // ignore
        }
      }
    }

    if (!mainBracket || !mainBracket._id) {
      throw new Error('No bracket found for this tournament')
    }

    bracketData = {
      bracket: mainBracket._id,
      looserBracket: loserBracket?._id || mainBracket.looserBracket || '',
      name: mainBracket.name || 'Tournament Bracket',
      BracketType: bracketData.BracketType,
    }

    // Fetch full tournament to extract staff for permission checks (Founder/Admin/Bracket Manager)
    try {
      const fullTournament: unknown = await getTournamentById(tournamentId)
      if (fullTournament && typeof fullTournament === 'object') {
        interface StaffMemberLikeLocal {
          user: string | { _id?: string; id?: string } | null | undefined
          role?: string
        }
        const ft = fullTournament as Record<string, unknown>
        const directStaff = Array.isArray(ft.staff) ? (ft.staff as StaffMemberLikeLocal[]) : []
        const createdBy = ft.createdBy as Record<string, unknown> | undefined
        const orgStaff =
          createdBy && Array.isArray((createdBy as Record<string, unknown>).staff)
            ? ((createdBy as Record<string, unknown>).staff as StaffMemberLikeLocal[])
            : []
        const mergedStaff: StaffMemberLikeLocal[] = [...directStaff, ...orgStaff]
        if (mergedStaff.length) {
          ;(bracketData as { staff?: StaffMemberLikeLocal[] }).staff = mergedStaff
        }
        if (typeof ft.BracketType === 'string') {
          bracketData.BracketType = ft.BracketType as BracketType
        }
        // Also pass participants for team modal lookup
        if (Array.isArray(ft.participants)) {
          ;(bracketData as { participants?: unknown[] }).participants = ft.participants
        }
      }
    } catch {
      // Silently ignore staff fetch issues – UI will just hide manage controls
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load bracket data'
  }

  // user name not required here

  return (
    <div className="h-screen bg-defendrBg text-white p-6">
      {error ? (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl font-poppins mb-4">Error Loading Bracket</div>
            <div className="text-white">{error}</div>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <TournamentBracket
            tournament={bracketData}
            bracketTypeOverride={bracketData.BracketType}
          />
        </div>
      )}
    </div>
  )
}
