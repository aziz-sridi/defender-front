'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { useTournamentId } from '@/hooks/useTournamentId'
import { safeUpdateTournament } from '@/lib/tournament/updateHelpers'

export default function SingleEliminationSettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const tid = useTournamentId()
  const _sp = useSearchParams()
  const [hasConsolationRound, setHasConsolationRound] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  useEffect(() => {
    // Try to hydrate from existing tournament
    const load = async () => {
      if (!tid) return
      try {
        const { getTournamentById } = await import('@/services/tournamentService')
        const t: any = await getTournamentById(tid)
        const val: boolean = Boolean(t?.tournamentFormat?.hasConsolationRound)
        setHasConsolationRound(val)
      } catch {
        // ignore
      }
    }
    void load()
  }, [tid])

  const handleSave = async () => {
    if (!session?.accessToken) {
      toast.error('Authentication required. Please log in again.')
      return
    }
    if (!tid) {
      toast.error('No tournament found')
      return
    }
    setSaving(true)
    try {
      // Persist both BracketType and the Single Elimination option in one call
      await safeUpdateTournament(tid, {
        BracketType: 'SINGLE_ELIMINATION',
        tournamentFormat: {
          hasConsolationRound,
        },
      })
      try {
        localStorage.setItem('bracketSavedToDatabase', 'true')
        window.dispatchEvent(
          new CustomEvent('defendr-setup-progress', {
            detail: { step: 'brackets', done: true },
          }),
        )
      } catch {
        // ignore
      }
      toast.success('Single elimination settings saved')
      const next = `/tournament/setup/participationSettings${tid ? `?tid=${encodeURIComponent(tid)}` : ''}`
      router.push(next)
    } catch (e) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl text-white">
      <Typo as="h3" className="mb-6 font-bold text-3xl" fontFamily="poppins" fontVariant="h2">
        SINGLE ELIMINATION SETTINGS
      </Typo>

      <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-6">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            checked={hasConsolationRound}
            className="w-5 h-5 accent-defendrRed"
            type="checkbox"
            onChange={e => setHasConsolationRound(e.target.checked)}
          />
          <span className="font-poppins">Has Third and Fourth Match</span>
        </label>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          className={saving ? 'opacity-50 cursor-not-allowed' : ''}
          label="Save"
          size="s"
          variant="contained-red"
          onClick={handleSave}
        />
      </div>
    </div>
  )
}
