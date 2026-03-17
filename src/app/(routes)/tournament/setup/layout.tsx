'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'

import TournamentLayout from '@/components/ui/TournamentSidebar'
import { SetupLayoutProvider } from '@/components/layout/SetupLayoutContext'
import type { User } from '@/types/userType'
import { getTournamentById } from '@/services/tournamentService'
import type { Tournament } from '@/types/tournamentType'
import { getMatchById } from '@/services/matchService'

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isSetupRoot = pathname === '/tournament/setup'

  const sUser = (session?.user as User | undefined) || undefined
  const userName = sUser?.nickname || sUser?.fullname || sUser?.email || 'User'

  const [allowed, setAllowed] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true) // Start as true
  const [tid, setTid] = useState<string | null>(null)

  // Combined effect to get tid and check permissions
  useEffect(() => {
    // Wait for session and searchParams to be ready
    if (!session || !searchParams) {
      return
    }

    if (isSetupRoot) {
      setLoading(false)
      return
    }

    const urlTid = searchParams.get('tid')
    const matchId = searchParams.get('matchId')

    if (urlTid) {
      setTid(urlTid)
      checkPermissions(urlTid)
      return
    }

    if (matchId) {
      setLoading(true)
      getMatchById(matchId)
        .then(res => {
          const match = res.match || res
          let tournamentId = null
          if (match?.tournament) {
            tournamentId =
              typeof match.tournament === 'string' ? match.tournament : match.tournament._id
          }
          if (!tournamentId && match?.bracket?.tournament) {
            tournamentId =
              typeof match.bracket.tournament === 'string'
                ? match.bracket.tournament
                : match.bracket.tournament._id
          }
          if (!tournamentId && match?.participantA?.tournament) {
            tournamentId =
              typeof match.participantA.tournament === 'string'
                ? match.participantA.tournament
                : match.participantA.tournament._id
          }
          if (tournamentId) {
            setTid(tournamentId)
            checkPermissions(tournamentId)
          } else {
            setAllowed(false)
            setLoading(false)
          }
        })
        .catch(() => {
          setAllowed(false)
          setLoading(false)
        })
      return
    }

    setAllowed(false)
    setLoading(false)
  }, [session, searchParams, pathname])

  // Separate function to check permissions (memoized for useEffect deps)
  const checkPermissions = React.useCallback(
    (tournamentId: string) => {
      if (!sUser?._id) {
        setAllowed(false)
        setLoading(false)
        return
      }

      setLoading(true)
      getTournamentById(tournamentId)
        .then((tournament: Tournament) => {
          const org = tournament.createdBy

          if (!org || !Array.isArray(org.staff)) {
            setAllowed(false)
            return
          }

          const isStaff = org.staff.some(staff => staff.user === sUser._id)
          setAllowed(isStaff)

          if (isStaff) {
            // Persist minimal org info for header
            try {
              const role = org.staff.find(st => st.user === sUser._id)?.role || ''
              const payload = {
                name: org.name,
                logoImage: org.logoImage || org.logo || org.bannerImage,
                role,
                id: org._id,
              }
              localStorage.setItem('defendr:currentSetupOrg', JSON.stringify(payload))
            } catch (err) {}
          }
        })
        .catch(err => {
          setAllowed(false)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [sUser],
  )

  if (loading && !isSetupRoot) {
    return <div className="p-8 text-center text-white">Checking permissions...</div>
  }

  if (!allowed && !isSetupRoot) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Forbidden: You are not a staff member of this organization.
      </div>
    )
  }

  return (
    <SetupLayoutProvider>
      {isSetupRoot ? (
        <>{children}</>
      ) : (
        <TournamentLayout userName={userName}>{children}</TournamentLayout>
      )}
    </SetupLayoutProvider>
  )
}
