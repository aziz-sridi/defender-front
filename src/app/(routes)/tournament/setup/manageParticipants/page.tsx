'use client'

import { useEffect, useState } from 'react'

import ManageParticipants from '@/components/ui/ManageParticipants'
import useTournamentDetails from '@/hooks/useTournamentDetails'
import { GameMode } from '@/types/tournamentType'

export default function ManageParticipantsPage() {
  const { tournament, tournamentId } = useTournamentDetails()
  const tournamentMode = (tournament?.gameMode as GameMode) || 'Solo'
  return (
    <div className="h-screen bg-defendrBg">
      <ManageParticipants
        participationType={tournamentMode}
        tournamentId={tournamentId ?? undefined}
      />
    </div>
  )
}
