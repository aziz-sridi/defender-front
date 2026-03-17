'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import BracketTypeBox from '@/components/ui/BracketTypeBox'
import Typo from '@/components/ui/Typo'
import SwapSeedIcon from '@/components/ui/bracketIcons/SwapSeedIcon'
import RoundRobinIcon from '@/components/ui/bracketIcons/RoundRobinIcon'
import FreeForAllIcon from '@/components/ui/bracketIcons/FreeForAllIcon'
import DoubleEliminationIcon from '@/components/ui/bracketIcons/DoubleEliminationIcon'
import SingleEliminationIcon from '@/components/ui/bracketIcons/SingleEliminationIcon'
// Layout is applied by the route group's layout.tsx
import NextButton from '@/components/ui/NextButton'
import useTournamentDetails from '@/hooks/useTournamentDetails'
import { safeUpdateTournament } from '@/lib/tournament/updateHelpers'

export const dynamic = 'force-dynamic' // prevent prerender errors

export default function TournamentBracketPage() {
  const [selectedBracket, setSelectedBracket] = useState<string>('')
  const { tournament, tournamentId } = useTournamentDetails()
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const router = useRouter()
  const { data: session } = useSession()

  const bracketTypeMapping: { [key: string]: string } = {
    'single-elimination': 'SINGLE_ELIMINATION',
    'double-elimination': 'DOUBLE_ELIMINATION',
    'free-for-all': 'FREE_FOR_ALL',
    'round-robin': 'ROUND_ROBIN',
    'swap-seed': 'SWAP_SEED',
  }

  // On mount: try to hydrate from backend so existing tournaments highlight correct bracket type
  useEffect(() => {
    // Prefer server authoritative value
    if (!tournamentId) {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('selectedBracket') : ''
      if (saved) {
        setSelectedBracket(saved)
      }
      return
    }
    if (tournament) {
      const obj = tournament as Record<string, unknown>
      const bracketObj =
        obj.bracket && typeof obj.bracket === 'object'
          ? (obj.bracket as Record<string, unknown>)
          : {}
      const backendType: string | undefined =
        (obj.BracketType as string) || (obj.bracketType as string) || (bracketObj.type as string)
      if (backendType) {
        // Map backend type to internal id
        const map: Record<string, string> = {
          SINGLE_ELIMINATION: 'single-elimination',
          DOUBLE_ELIMINATION: 'double-elimination',
          FREE_FOR_ALL: 'free-for-all',
          ROUND_ROBIN: 'round-robin',
          SWISS: 'swap-seed',
          SWAP_SEED: 'swap-seed',
        }
        const internal = map[backendType as keyof typeof map]
        if (internal) {
          setSelectedBracket(internal)
          if (typeof window !== 'undefined') {
            localStorage.setItem('selectedBracket', internal)
            localStorage.setItem('bracketSavedToDatabase', 'true')
            window.dispatchEvent(
              new CustomEvent('defendr-setup-progress', {
                detail: { step: 'brackets', done: true },
              }),
            )
          }
          return
        }
      }
    }
    // fallback: use localStorage if backend missing
    const saved = typeof window !== 'undefined' ? localStorage.getItem('selectedBracket') : ''
    if (saved) {
      setSelectedBracket(saved)
    }
  }, [tournamentId, tournament])

  const handleBracketSelect = (bracketId: string) => {
    setSelectedBracket(bracketId)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedBracket', bracketId)
    }
  }

  const handleNext = async () => {
    if (!selectedBracket) {
      toast.error('Please select a bracket type first')
      return
    }

    if (!session?.accessToken) {
      toast.error('Authentication required. Please log in again.')
      return
    }

    if (!tournamentId) {
      toast.error(
        'No tournament found. Please create a tournament first by going back to the setup page.',
      )
      return
    }

    setIsUpdating(true)

    try {
      // If Single Elimination, open settings first without saving bracket yet
      const nextWithTid = (path: string) =>
        `${path}${tournamentId ? `?tid=${encodeURIComponent(tournamentId)}` : ''}`
      if (selectedBracket === 'single-elimination') {
        router.push(nextWithTid('/tournament/setup/singleElimination'))
        return
      }

      const bracketType = bracketTypeMapping[selectedBracket]
      await safeUpdateTournament(tournamentId, { BracketType: bracketType })
      toast.success(`Tournament updated with ${selectedBracket} bracket`)

      localStorage.setItem('bracketSavedToDatabase', 'true')
      // Notify sidebar instantly
      window.dispatchEvent(
        new CustomEvent('defendr-setup-progress', {
          detail: { step: 'brackets', done: true },
        }),
      )
      router.push(nextWithTid('/tournament/setup/participationSettings'))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating tournament:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to update tournament. Please try again.',
      )
    } finally {
      setIsUpdating(false)
    }
  }

  const bracketTypes = [
    { id: 'single-elimination', label: 'Single elimination', icon: <SingleEliminationIcon /> },
    { id: 'double-elimination', label: 'Double Elimination', icon: <DoubleEliminationIcon /> },
    { id: 'free-for-all', label: 'Free for all', icon: <FreeForAllIcon /> },
    { id: 'round-robin', label: 'Round Robin', icon: <RoundRobinIcon /> },
    { id: 'swap-seed', label: 'SWAP Seed', icon: <SwapSeedIcon /> },
  ]

  return (
    <div className="text-white max-w-6xl">
      <Typo as="h3" className="mb-6 font-bold text-3xl" fontFamily="poppins" fontVariant="h2">
        Tournament Bracket
      </Typo>

      <Typo
        as="p"
        className="mb-12 leading-relaxed max-w-4xl"
        color="grey"
        fontFamily="poppins"
        fontVariant="p3"
      >
        Choose the type of bracket, rules and regulations you would like to use for your
        tournament's, watch up your settings carefully and everything before starting the tournament
      </Typo>

      <div className="space-y-8">
        <div className="flex justify-center gap-6">
          {bracketTypes.slice(0, 4).map(bracket => (
            <BracketTypeBox
              key={bracket.id}
              icon={bracket.icon}
              id={bracket.id}
              isSelected={selectedBracket === bracket.id}
              label={bracket.label}
              onClick={handleBracketSelect}
            />
          ))}
        </div>

        {bracketTypes.length > 4 && (
          <div className="flex justify-center">
            <BracketTypeBox
              key={bracketTypes[bracketTypes.length - 1].id}
              icon={bracketTypes[bracketTypes.length - 1].icon}
              id={bracketTypes[bracketTypes.length - 1].id}
              isSelected={selectedBracket === bracketTypes[bracketTypes.length - 1].id}
              label={bracketTypes[bracketTypes.length - 1].label}
              onClick={handleBracketSelect}
            />
          </div>
        )}

        {selectedBracket && (
          <div className="flex justify-end mt-8">
            <NextButton
              className={isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
              onClick={handleNext}
            />
          </div>
        )}
      </div>
    </div>
  )
}
