'use client'

import { useContext } from 'react'
import { Check, Lock } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import { OrganizationContext } from '@/components/context/OrganizationContext'

interface CreateTournamentModelProps {
  action?: () => void
}

const OrganizeType: React.FC<CreateTournamentModelProps> = ({ action }) => {
  const { organizationData, setOrganizationData } = useContext(OrganizationContext)
  const selected = organizationData?.type || ''

  const select = (type: 'personal' | 'business') => {
    setOrganizationData(prev => ({ ...prev, type }))
  }

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Typo
            as="h2"
            className="text-xl sm:text-2xl font-bold text-white mb-1.5"
            fontFamily="poppins"
          >
            Organisation Type
          </Typo>
          <Typo as="p" className="text-gray-400 text-sm sm:text-base" fontFamily="poppins">
            Choose the type that best fits your gaming community.
          </Typo>
        </div>

        {/* Type rows */}
        <div className="space-y-3">
          {/* Personal — selectable */}
          <button
            type="button"
            onClick={() => select('personal')}
            className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 text-left group ${
              selected === 'personal'
                ? 'border-defendrRed/60 bg-defendrRed/[0.08]'
                : 'border-white/[0.07] bg-[#111114] hover:border-white/20 hover:bg-white/[0.03]'
            }`}
          >
            {/* Radio dot */}
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                selected === 'personal' ? 'border-defendrRed bg-defendrRed' : 'border-white/20'
              }`}
            >
              {selected === 'personal' && <Check size={12} className="text-white" />}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-sm sm:text-base font-poppins ${selected === 'personal' ? 'text-white' : 'text-gray-200'}`}
              >
                Personal Organisation
              </p>
              <p className="text-gray-500 text-xs sm:text-sm font-poppins mt-0.5">
                For individuals — create and manage tournaments, invite staff, upload branding
              </p>
            </div>

            {/* Selected badge */}
            {selected === 'personal' && (
              <span className="text-xs bg-defendrRed/20 text-defendrRed px-2.5 py-1 rounded-full font-poppins font-semibold flex-shrink-0">
                Selected
              </span>
            )}
          </button>

          {/* Business — disabled */}
          <div className="w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-white/[0.04] bg-white/[0.02] opacity-50 cursor-not-allowed">
            {/* Lock icon */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/10 flex items-center justify-center flex-shrink-0">
              <Lock size={10} className="text-gray-600" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base font-poppins text-gray-400">
                Business Organisation
              </p>
              <p className="text-gray-600 text-xs sm:text-sm font-poppins mt-0.5">
                Multi-brand orgs, advanced roles, analytics, payouts and automations
              </p>
            </div>

            <span className="text-xs bg-white/[0.06] text-gray-400 px-2.5 py-1 rounded-full font-poppins font-semibold flex-shrink-0">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Note */}
        <p className="text-gray-600 text-xs sm:text-sm font-poppins mt-4">
          You can upgrade to Business once it becomes available.
        </p>

        {/* Continue */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            disabled={selected !== 'personal'}
            onClick={action}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base font-poppins transition-all duration-200 ${
              selected === 'personal'
                ? 'bg-defendrRed text-white hover:bg-red-600 shadow-lg shadow-red-900/30 hover:scale-[1.02]'
                : 'bg-white/[0.05] text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue with Personal
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default OrganizeType
