'use client'

import { useState } from 'react'

import { TournamentHeader } from './Basic/TournamentHeader'
import { TournamentSteps } from './Basic/TournamentSteps'
import { TournamentPreview } from './Basic/TournamentPreview'
import { BasicInfoStep } from './Basic/BasicInfoStep'
import { ParticipationStep } from './Basic/ParticipationStep'
import { RequirementsStep } from './Basic/RequirementsStep'
import { MediaStep } from './Basic/MediaStep'

export interface TournamentData {
  title: string
  game: string
  startDate: string
  startTime: string
  registerDate: string
  registerTime: string
  locationType: 'online' | 'physical' | 'hybrid'
  locationDetails: string
  participationType: 'team' | 'solo'
  teamMembers: number
  substitutes: number
  maxEnrollment: number
  bracketType: string
  scoreReporting: string
  countryRestriction: string
  requireGameAccount: boolean
  requireDiscord: boolean
  backgroundImage: string | null
  thumbnailImage: string | null
}

const initialData: TournamentData = {
  title: '',
  game: '',
  startDate: '',
  startTime: '06:00PM',
  registerDate: '',
  registerTime: '06:00PM',
  locationType: 'online',
  locationDetails: '',
  participationType: 'team',
  teamMembers: 2,
  substitutes: 2,
  maxEnrollment: 16,
  bracketType: 'Single Elimination',
  scoreReporting: 'Self reporting by players',
  countryRestriction: 'Global (No Restriction)',
  requireGameAccount: true,
  requireDiscord: true,
  backgroundImage: null,
  thumbnailImage: null,
}

export const TournamentCreator = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [tournamentData, setTournamentData] = useState<TournamentData>(initialData)

  const steps = ['Basic Info', 'Participation', 'Requirements', 'Media']

  const updateTournamentData = (updates: Partial<TournamentData>) => {
    setTournamentData(prev => ({ ...prev, ...updates }))
  }

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            data={tournamentData}
            updateData={updateTournamentData}
            onNext={goToNextStep}
          />
        )
      case 1:
        return (
          <ParticipationStep
            data={tournamentData}
            updateData={updateTournamentData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 2:
        return (
          <RequirementsStep
            data={tournamentData}
            updateData={updateTournamentData}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
          />
        )
      case 3:
        return (
          <MediaStep
            data={tournamentData}
            updateData={updateTournamentData}
            onBack={goToPreviousStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-defendrBlack text-white">
      <div className="container mx-auto px-4 py-8">
        <TournamentHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Form Panel */}
          <div className="lg:col-span-2">
            <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-white">Create Tournament</h2>
                <TournamentSteps
                  currentStep={currentStep}
                  steps={steps}
                  onStepClick={setCurrentStep}
                />
              </div>

              {renderCurrentStep()}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <TournamentPreview data={tournamentData} />
          </div>
        </div>
      </div>
    </div>
  )
}
