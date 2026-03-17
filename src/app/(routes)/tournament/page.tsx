'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import GameBrowser from '@/components/ui/GameBrowser'
import OrganizationSelector from '@/components/tournament/OrganizationSelector'
import { Game } from '@/types/gameType'

type TournamentCreationStep = 'organization' | 'game'

export default function TournamentPage() {
  const { data: sessionData, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<TournamentCreationStep>('organization')
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('')

  useEffect(() => {
    if (status === 'loading') {
      return
    }
    const userOrg = sessionData?.user?.organization
    if (!userOrg) {
      //router.push('/organization')
    }
  }, [sessionData, status, router])

  const handleOrganizationSelect = (organizationId: string) => {
    setSelectedOrganizationId(organizationId)
    // Store organization ID in localStorage for later use
    try {
      localStorage.setItem('selectedOrganizationId', organizationId)
    } catch {}
    setCurrentStep('game')
  }

  const handleGameSelect = (game: Game) => {
    try {
      localStorage.setItem('selectedGame', JSON.stringify(game))
    } catch {}
    // Navigate to setup with organization ID
    router.push(`/tournament/setup?orgId=${selectedOrganizationId}`)
  }

  const handleBackToOrganization = () => {
    setCurrentStep('organization')
  }

  if (currentStep === 'organization') {
    return <OrganizationSelector onOrganizationSelect={handleOrganizationSelect} />
  }

  return (
    <div className="min-h-screen bg-defendrBg">
      {/* Mobile Message */}
      <div className="lg:hidden flex items-center justify-center min-h-screen p-6">
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center gap-4 mb-4">
            <svg
              className="w-8 h-8 text-blue-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h2 className="text-blue-400 font-poppins font-semibold text-xl mb-2">
                Get Computer View for Better Experience
              </h2>
              <p className="text-blue-300 font-poppins text-sm leading-relaxed">
                Tournament creation is optimized for desktop experience. Please use a computer for
                the best tournament setup experience.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-800/20 rounded-lg">
            <p className="text-blue-200 font-poppins text-xs">
              💡 <strong>Tip:</strong> Switch to desktop view to access all tournament creation
              features including game selection, bracket setup, and participant management.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6 py-4">
          <div className="mb-6">
            <button
              onClick={handleBackToOrganization}
              className="flex items-center gap-2 text-defendrLightGrey hover:text-defendrRed transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Organization Selection
            </button>
          </div>
        </div>
        <GameBrowser showDone columns={7} title="Select A GAME" onDone={handleGameSelect} />
      </div>
    </div>
  )
}
