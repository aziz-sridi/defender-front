'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FileText, Building2, Trophy, Check } from 'lucide-react'

import CreateTournamentModel from '@/components/organizations/CreateTournamentModel'
import InformationOrganize from '@/components/organizations/InformationOrganize'
import OrganizeModel from '@/components/organizations/OrganizeModel'
import OrganizationHub from '@/components/organizations/OrganizationHub'
import TournamentProvider from '@/components/organizations/TournamentProvider'
import Typo from '@/components/ui/Typo'
import Loader from '@/app/loading'

type OrganizationFlowStep = 'hub' | 'information' | 'organization' | 'tournament'

const FLOW_STEPS = [
  {
    id: 'information' as OrganizationFlowStep,
    label: 'Information',
    description: 'Terms & rules',
    icon: FileText,
  },
  {
    id: 'organization' as OrganizationFlowStep,
    label: 'Organisation',
    description: 'Setup details',
    icon: Building2,
  },
  {
    id: 'tournament' as OrganizationFlowStep,
    label: 'Tournament',
    description: 'Create event',
    icon: Trophy,
  },
]

const stepOrder: OrganizationFlowStep[] = ['information', 'organization', 'tournament']

interface StepIndicatorProps {
  currentStep: OrganizationFlowStep
  onStepClick: (step: OrganizationFlowStep) => void
  completedSteps: OrganizationFlowStep[]
}

const StepIndicator = ({ currentStep, onStepClick, completedSteps }: StepIndicatorProps) => (
  <div className="flex items-center justify-center mb-8 sm:mb-10 px-4">
    {FLOW_STEPS.map((s, i) => {
      const isActive = currentStep === s.id
      const isCompleted = completedSteps.includes(s.id)
      const Icon = s.icon
      return (
        <div key={s.id} className="flex items-center">
          <button
            type="button"
            onClick={() => {
              if (isCompleted) onStepClick(s.id)
            }}
            className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-defendrRed/15 border border-defendrRed/40'
                : isCompleted
                  ? 'cursor-pointer hover:bg-white/5'
                  : 'opacity-40 cursor-default'
            }`}
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-500/20 text-green-400'
                  : isActive
                    ? 'bg-defendrRed text-white shadow-lg shadow-red-900/40'
                    : 'bg-white/5 text-gray-500'
              }`}
            >
              {isCompleted ? <Check size={14} /> : <Icon size={14} />}
            </div>
            <div className="hidden sm:block text-left">
              <Typo
                as="p"
                className={`text-xs sm:text-sm font-bold leading-none ${
                  isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-500'
                }`}
                fontFamily="poppins"
              >
                {s.label}
              </Typo>
              <Typo as="p" className="text-xs text-gray-500 mt-0.5" fontFamily="poppins">
                {s.description}
              </Typo>
            </div>
          </button>
          {i < FLOW_STEPS.length - 1 && (
            <div
              className={`w-6 sm:w-12 h-[2px] mx-1 sm:mx-2 rounded-full transition-all duration-500 ${
                isCompleted ? 'bg-green-500/50' : 'bg-white/10'
              }`}
            />
          )}
        </div>
      )
    })}
  </div>
)

const MyOrganizationComponent = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OrganizationFlowStep>('hub')
  const [completedSteps, setCompletedSteps] = useState<OrganizationFlowStep[]>([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user?._id) {
      router.push('/login')
    }
  }, [session, status, router])

  const handleOrganizationSelect = (orgId: string) => {
    router.push(`/organization/${orgId}/Profile`)
  }

  const handleCreateOrganization = () => {
    setCurrentStep('information')
  }

  const advanceTo = (next: OrganizationFlowStep, current: OrganizationFlowStep) => {
    setCompletedSteps(prev => (prev.includes(current) ? prev : [...prev, current]))
    setCurrentStep(next)
  }

  const handleStepClick = (step: OrganizationFlowStep) => {
    setCurrentStep(step)
  }

  if (status === 'loading') return <Loader />

  // ── Hub: select or create ────────────────────────────────────────────
  if (currentStep === 'hub') {
    return (
      <div className="min-h-screen bg-defendrBg">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <OrganizationHub
            onOrganizationSelect={handleOrganizationSelect}
            onCreateOrganization={handleCreateOrganization}
          />
        </div>
      </div>
    )
  }

  // ── Creation flow ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-defendrBg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page header */}
        <div className="text-center mb-6 sm:mb-8">
          <Typo
            as="h1"
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            fontFamily="poppins"
          >
            Create Your Organisation
          </Typo>
          <Typo as="p" className="text-gray-400 text-sm sm:text-base" fontFamily="poppins">
            Set up your organisation in just a few steps
          </Typo>
        </div>

        {/* Step indicator */}
        <StepIndicator
          currentStep={currentStep}
          onStepClick={handleStepClick}
          completedSteps={completedSteps}
        />

        {/* Step content */}
        <div className="w-full">
          {currentStep === 'information' && (
            <InformationOrganize action={() => advanceTo('organization', 'information')} />
          )}

          {currentStep === 'organization' && (
            <OrganizeModel action={() => advanceTo('tournament', 'organization')} />
          )}

          {currentStep === 'tournament' && (
            <TournamentProvider>
              <CreateTournamentModel />
            </TournamentProvider>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrganizationComponent
