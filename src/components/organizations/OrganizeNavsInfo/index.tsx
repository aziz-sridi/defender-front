'use client'

import { useContext, useState } from 'react'
import { Check, LayoutList, Phone, Settings, ShieldCheck } from 'lucide-react'

import { OrganizationContext } from '@/components/context/OrganizationContext'
import OrganizeBasics from '@/components/organizations/Organisation/OrganizeBasics'
import OrganizeContact from '@/components/organizations/Organisation/OrganizeContact'
import OrganizeStuff from '@/components/organizations/Organisation/OrganizeStuff'
import OrganizeVerification from '@/components/organizations/Organisation/OrganizeVerification'
import Typo from '@/components/ui/Typo'
import { DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

const ORG_STEPS = [
  { id: 0, label: 'Basics', description: 'Name, logo & banner', icon: LayoutList },
  { id: 1, label: 'Contact', description: 'Socials & links', icon: Phone },
  { id: 2, label: 'Settings', description: 'Staff & permissions', icon: Settings },
]

const BUSINESS_STEPS = [
  ...ORG_STEPS,
  { id: 3, label: 'Verification', description: 'ID & wallet', icon: ShieldCheck },
]

interface OrganizeNavsInfoProps {
  action: () => void
}

const OrganizeNavsInfo = ({ action }: OrganizeNavsInfoProps) => {
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState<number[]>([])
  const { organizationData } = useContext(OrganizationContext)

  const steps = organizationData?.type === 'business' ? BUSINESS_STEPS : ORG_STEPS

  const goToNextStep = () => {
    if (!completed.includes(step)) setCompleted(prev => [...prev, step])
    if (step < steps.length - 1) setStep(prev => prev + 1)
    else action?.()
  }

  const goToPrevStep = () => {
    if (step > 0) setStep(prev => prev - 1)
  }

  const renderContent = () => {
    switch (step) {
      case 0:
        return <OrganizeBasics onNext={goToNextStep} />
      case 1:
        return <OrganizeContact onNext={goToNextStep} onBack={goToPrevStep} />
      case 2:
        return <OrganizeStuff onNext={goToNextStep} onBack={goToPrevStep} />
      case 3:
        if (organizationData?.type === 'business')
          return <OrganizeVerification onNext={goToNextStep} />
        return null
      default:
        return null
    }
  }

  // Safe image sources
  const bannerSrc =
    organizationData?.bannerImage && typeof organizationData.bannerImage === 'string'
      ? organizationData.bannerImage
      : DEFAULT_IMAGES.ORGANIZATION_BANNER

  const logoSrc =
    organizationData?.logoImage && typeof organizationData.logoImage === 'string'
      ? organizationData.logoImage
      : DEFAULT_IMAGES.ORGANIZATION

  return (
    <section className="w-full">
      <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-6">
        {/* ── Main form panel ── */}
        <div className="bg-[#111114] border border-white/[0.07] rounded-2xl overflow-hidden">
          {renderContent()}
        </div>

        {/* ── Right sidebar (desktop only) ── */}
        <div className="hidden lg:flex flex-col gap-4">
          {/* Live preview card */}
          <div className="bg-[#111114] border border-white/[0.07] rounded-2xl overflow-hidden">
            {/* Banner */}
            <div
              className="h-24 bg-cover bg-center bg-gray-800"
              style={{ backgroundImage: `url(${bannerSrc})` }}
            />

            {/* Logo + Info */}
            <div className="px-4 pb-4 -mt-6 relative">
              <div className="w-12 h-12 rounded-xl border-2 border-[#111114] overflow-hidden bg-gray-800 mb-3 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoSrc} alt="Org logo preview" className="w-full h-full object-cover" />
              </div>

              <Typo
                as="p"
                className={`font-bold text-sm leading-tight ${organizationData?.name ? 'text-white' : 'text-gray-600'}`}
                fontFamily="poppins"
              >
                {organizationData?.name || 'Organisation Name'}
              </Typo>

              {organizationData?.description && (
                <Typo
                  as="p"
                  className="text-[11px] text-gray-400 mt-1.5 leading-relaxed line-clamp-3"
                  fontFamily="poppins"
                >
                  {organizationData.description}
                </Typo>
              )}

              {/* Social preview dots */}
              {(organizationData?.discord ||
                organizationData?.twitter ||
                organizationData?.instagram) && (
                <div className="flex gap-2 mt-3">
                  {organizationData?.discord && (
                    <div className="w-6 h-6 rounded-md bg-[#5865F2]/20 flex items-center justify-center">
                      <svg className="w-3 h-3 fill-[#5865F2]" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                      </svg>
                    </div>
                  )}
                  {organizationData?.twitter && (
                    <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                      <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                  )}
                  {organizationData?.instagram && (
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 fill-pink-400" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* Staff count preview */}
              {Array.isArray(organizationData?.staff) && organizationData.staff.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                  <div className="flex -space-x-2">
                    {organizationData.staff.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full bg-defendrRed/30 border border-[#111114]"
                      />
                    ))}
                  </div>
                  <Typo as="p" className="text-[11px] text-gray-500" fontFamily="poppins">
                    {organizationData.staff.length} staff member
                    {organizationData.staff.length > 1 ? 's' : ''}
                  </Typo>
                </div>
              )}
            </div>

            {/* Preview label */}
            <div className="px-4 py-2 border-t border-white/[0.05] bg-white/[0.02]">
              <Typo
                as="p"
                className="text-[10px] uppercase tracking-widest text-gray-600 text-center"
                fontFamily="poppins"
              >
                Live Preview
              </Typo>
            </div>
          </div>

          {/* Progress sidebar */}
          <div className="bg-[#111114] border border-white/[0.07] rounded-2xl p-5 space-y-3">
            <Typo
              as="p"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
              fontFamily="poppins"
            >
              Progress
            </Typo>
            {steps.map(s => {
              const Icon = s.icon
              const isDone = completed.includes(s.id)
              const isActive = step === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={!isActive && !isDone}
                  onClick={() => {
                    if (isDone) setStep(s.id)
                  }}
                  className={`w-full flex items-center gap-3 text-left rounded-xl p-2 transition-colors ${isDone ? 'hover:bg-white/[0.03] cursor-pointer' : 'cursor-default'}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDone ? 'bg-green-500/20' : isActive ? 'bg-defendrRed/20' : 'bg-white/5'
                    }`}
                  >
                    {isDone ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Icon size={14} className={isActive ? 'text-defendrRed' : 'text-gray-600'} />
                    )}
                  </div>
                  <div>
                    <Typo
                      as="span"
                      className={`text-xs font-semibold block ${isDone ? 'text-green-400' : isActive ? 'text-white' : 'text-gray-600'}`}
                      fontFamily="poppins"
                    >
                      {s.label}
                    </Typo>
                    <Typo as="span" className="text-[10px] text-gray-600" fontFamily="poppins">
                      {s.description}
                    </Typo>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrganizeNavsInfo
