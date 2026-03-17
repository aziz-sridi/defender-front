'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Building, Users, Star, Trophy } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import {
  organizerImageSanitizer,
  organizationBannerSanitizer,
  DEFAULT_IMAGES,
} from '@/utils/imageUrlSanitizer'

interface Organization {
  _id: string
  name: string
  description?: string
  foundedYear?: number
  logo?: string
  logoImage?: string
  bannerImage?: string
  coverImage?: string
  staff?: any[]
  staffCount?: number
  memberCount?: number
  tournaments?: any[]
  tournamentCount?: number
  publishedTournamentCount?: number
  socialMediaFollowers?: number
  followers?: any[]
  nbFollowers?: number
  location?: string
  website?: string
  isVerified?: boolean
  createdAt?: string
  createdBy?: any
}

interface OrganizationCardProps {
  organization: Organization
  onViewOrganization: () => void
  onRequestToJoin: () => void
}

export default function OrganizationCard({
  organization,
  onViewOrganization,
  onRequestToJoin,
}: OrganizationCardProps) {
  const [imageError, setImageError] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const formatNumber = (num?: number) => {
    if (!num) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div
      className="w-full overflow-hidden rounded-xl bg-[#212529] border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer group"
      onClick={onViewOrganization}
    >
      {/* Banner */}
      <div className="relative w-full h-[120px] sm:h-[140px]">
        {!imageError ? (
          <Image
            fill
            unoptimized
            alt={organization.name}
            className="object-cover"
            src={organizationBannerSanitizer(
              organization.bannerImage || organization.coverImage || '',
              DEFAULT_IMAGES.ORGANIZATION_BANNER,
            )}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-[#2c3036] flex items-center justify-center">
            <Building className="h-10 w-10 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#212529] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative px-4 pb-4 -mt-8">
        {/* Logo + Name row */}
        <div className="flex items-end gap-3 mb-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#2c3036] border-2 border-[#212529] shrink-0 shadow-lg">
            {!logoError ? (
              <Image
                fill
                unoptimized
                alt={`${organization.name} logo`}
                className="object-cover"
                src={organizerImageSanitizer(
                  organization.logoImage || organization.logo || '',
                  DEFAULT_IMAGES.ORGANIZATION,
                )}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building className="h-6 w-6 text-gray-500" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pb-0.5">
            <Typo
              as="h3"
              className="font-poppins text-base font-bold truncate"
              color="white"
              fontVariant="h4"
            >
              {organization.name}
            </Typo>
            {organization.description && (
              <p className="text-gray-500 text-xs font-poppins truncate mt-0.5">
                {organization.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#1a1d20] rounded-lg px-2 py-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Star className="h-3 w-3 text-purple-400" />
              <span className="text-[11px] text-gray-500 font-poppins">Followers</span>
            </div>
            <span className="text-white text-sm font-bold font-poppins">
              {formatNumber(
                organization.nbFollowers ||
                  organization.followers?.length ||
                  organization.socialMediaFollowers ||
                  0,
              )}
            </span>
          </div>
          <div className="bg-[#1a1d20] rounded-lg px-2 py-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Users className="h-3 w-3 text-blue-400" />
              <span className="text-[11px] text-gray-500 font-poppins">Members</span>
            </div>
            <span className="text-white text-sm font-bold font-poppins">
              {formatNumber(
                organization.memberCount ||
                  organization.staff?.length ||
                  organization.staffCount ||
                  0,
              )}
            </span>
          </div>
          <div className="bg-[#1a1d20] rounded-lg px-2 py-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Trophy className="h-3 w-3 text-yellow-400" />
              <span className="text-[11px] text-gray-500 font-poppins">Tournaments</span>
            </div>
            <span className="text-white text-sm font-bold font-poppins">
              {formatNumber(
                organization.publishedTournamentCount ??
                  organization.tournamentCount ??
                  organization.tournaments?.length ??
                  0,
              )}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 bg-[#D62555] hover:bg-[#c01e4a] text-white text-xs font-semibold rounded-lg font-poppins transition-colors"
            onClick={e => {
              e.stopPropagation()
              onViewOrganization()
            }}
          >
            View
          </button>
          <button
            className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg font-poppins transition-colors border border-white/10"
            onClick={e => {
              e.stopPropagation()
              onRequestToJoin()
            }}
          >
            Request to Join
          </button>
        </div>
      </div>
    </div>
  )
}
