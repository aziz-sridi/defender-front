'use client'
import type { BracketType, Tournament } from '@/types/tournamentType'
import React, { useMemo } from 'react'
import type { ManageableTournamentInput, StaffMemberLike } from './types'
import { useSession } from 'next-auth/react'
import EliminationBracket from './EliminationBracket'

type TournamentBracketProps = {
  tournament: Tournament | ManageableTournamentInput
  bracketTypeOverride?: BracketType
}

const TournamentBracket = ({ tournament, bracketTypeOverride }: TournamentBracketProps) => {
  const { data: session } = useSession()
  const bracketType = (bracketTypeOverride ||
    tournament.BracketType ||
    'SINGLE_ELIMINATION') as BracketType
  const canManage = useMemo(() => {
    type SessionUser = {
      _id?: string
      id?: string
      userId?: string
      userID?: string
    }
    const sessionUser = (session?.user || {}) as SessionUser
    const sessionUserId =
      sessionUser._id || sessionUser.id || sessionUser.userId || sessionUser.userID || ''
    if (!sessionUserId) {
      return false
    }
    const staffList: StaffMemberLike[] = Array.isArray(tournament.staff)
      ? (tournament.staff as StaffMemberLike[])
      : []
    if (!staffList.length) {
      return false
    }
    const allowed = new Set(['founder', 'admin', 'bracket manager', 'moderator'])
    return staffList.some(member => {
      if (!member) {
        return false
      }
      const rawUser = member.user as { _id?: string; id?: string } | string | null | undefined
      const staffUserId =
        typeof rawUser === 'string'
          ? rawUser
          : rawUser?._id || (rawUser as { id?: string })?.id || undefined
      if (!staffUserId) {
        return false
      }
      const role = (member.role || '').toLowerCase().trim()
      return staffUserId === sessionUserId && allowed.has(role)
    })
  }, [session?.user, tournament.staff])

  return (
    <>
      {['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION'].includes(bracketType) ? (
        <EliminationBracket
          tournament={tournament}
          canManage={canManage}
          bracketType={bracketType}
        />
      ) : (
        <h1>Unsupported Bracket Type</h1>
      )}
    </>
  )
}

export default TournamentBracket
