'use client'

import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, ChevronRight, LayoutDashboard } from 'lucide-react'

import { OrganizationContext } from '@/components/context/OrganizationContext'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface OrganizeSuccessProps {
  action: () => void
}

const OrganizeSuccess = ({ action }: OrganizeSuccessProps) => {
  const { organizationData } = useContext(OrganizationContext)
  const router = useRouter()
  const isBusiness = organizationData?.type === 'business'
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleOrganizeTournament = () => {
    action()
  }

  const handleMaybeLater = () => {
    router.push('/')
  }

  // Safe images from context
  const bannerSrc =
    mounted && organizationData?.bannerImage && typeof organizationData.bannerImage === 'string'
      ? organizationData.bannerImage
      : DEFAULT_IMAGES.ORGANIZATION_BANNER

  const logoSrc =
    mounted && organizationData?.logoImage && typeof organizationData.logoImage === 'string'
      ? organizationData.logoImage
      : DEFAULT_IMAGES.ORGANIZATION

  return (
    <div className="w-full flex items-center justify-center p-4 py-8 sm:py-16">
      <div className="w-full max-w-xl animate-fade-in-up">
        {/* Success Card */}
        <div className="bg-[#111114] border border-white/[0.07] rounded-3xl overflow-hidden shadow-2xl shadow-black/80">
          {/* Top Banner section */}
          <div className="relative">
            <div
              className="h-32 sm:h-40 w-full bg-cover bg-center bg-gray-900 border-b border-white/[0.05]"
              style={{ backgroundImage: `url(${bannerSrc})` }}
            >
              {/* Overlay gradient so text/icons pop */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111114] to-transparent" />
            </div>

            {/* Success icon badge floating top right */}
            <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md">
              <CheckCircle2 size={16} className="text-green-400" />
              <Typo as="span" className="text-xs font-semibold font-poppins text-green-400">
                Created
              </Typo>
            </div>

            {/* Business logic badge */}
            {isBusiness && (
              <div className="absolute top-4 left-4 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md">
                <Typo as="span" className="text-xs font-semibold font-poppins text-yellow-500">
                  Verification Pending
                </Typo>
              </div>
            )}
          </div>

          {/* Org Info overlapping banner */}
          <div className="px-6 pb-8 -mt-12 text-center relative z-10 flex flex-col items-center">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl border-4 border-[#111114] overflow-hidden bg-gray-800 shadow-xl shadow-black/50 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="Organisation logo" className="w-full h-full object-cover" />
            </div>

            <Typo as="h1" className="text-3xl font-bold text-white mb-2" fontFamily="poppins">
              {organizationData?.name || 'Your Organisation'}
            </Typo>

            <Typo as="p" className="text-gray-400 text-sm font-poppins max-w-sm mb-6">
              Your organisation has been created successfully and is ready to host amazing
              tournaments.
            </Typo>

            {/* Action Buttons inside Card */}
            <div className="w-full flex justify-center mt-2 px-4 sm:px-8">
              <Button
                label="Organize Tournament"
                variant="contained-red"
                size="m"
                className="w-full text-base py-4 font-semibold shadow-lg shadow-defendrRed/20 hover:scale-[1.02] transition-transform duration-300"
                icon={<ChevronRight size={18} />}
                iconOrientation="right"
                onClick={handleOrganizeTournament}
              />
            </div>

            {/* Hub Redirect */}
            <div className="w-full flex justify-center mt-3 px-4 sm:px-8">
              <Button
                label="Return to Dashboard"
                variant="outlined-grey"
                size="m"
                className="w-full text-sm py-4 hover:border-white/20 hover:bg-white/5 transition-all"
                icon={<LayoutDashboard size={16} className="text-gray-400" />}
                iconOrientation="left"
                onClick={handleMaybeLater}
              />
            </div>
          </div>

          {/* Footer of the card */}
          <div className="bg-white/[0.02] border-t border-white/[0.05] px-6 py-4 flex justify-center items-center">
            <Typo
              as="p"
              className="text-xs text-gray-500 text-center flex gap-2 items-center"
              fontFamily="poppins"
            >
              Next step: Set up your first competitive event
            </Typo>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizeSuccess
