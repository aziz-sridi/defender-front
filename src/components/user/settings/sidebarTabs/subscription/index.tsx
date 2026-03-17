'use client'

import { useState, useEffect } from 'react'
import {
  BadgeDollarSign,
  Crown,
  Trophy,
  Tv,
  Gift,
  DollarSign,
  Zap,
  Check,
  ChevronRight,
  Building2,
  Gamepad2,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import GiftSubscription from '@/components/user/settings/sidebarTabs/helpers/giftSubscription'
import { getOrganizationById } from '@/services/organizationService'

interface SubscriptionProps {
  membershipDetails: any
  user?: any
}

const SubscriptionTab = ({ membershipDetails, user }: SubscriptionProps) => {
  const [activeView, setActiveView] = useState<'platform' | 'organizer'>('platform')
  const [organization, setOrganization] = useState<any>(null)
  const [loadingOrg, setLoadingOrg] = useState(false)

  const level = membershipDetails?.membershipLevel
  const benefits = level?.benefits
  const planName = level?.name || 'Freemium'
  const isPremium = planName.toLowerCase() !== 'freemium'
  const price = benefits?.price ?? 0

  // Fetch organization when switching to organizer tab
  useEffect(() => {
    if (activeView === 'organizer' && user?.organization && !organization) {
      setLoadingOrg(true)
      getOrganizationById(user.organization)
        .then(org => setOrganization(org))
        .catch(() => setOrganization(null))
        .finally(() => setLoadingOrg(false))
    }
  }, [activeView, user?.organization, organization])

  // Build benefits list dynamically
  const benefitsList = [
    benefits?.participateFree && {
      icon: Trophy,
      label: 'Free Tournament Entry',
      description: 'Participate without entry fees',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    benefits?.freeBracketRound && {
      icon: Zap,
      label: 'Free Bracket Round',
      description: 'Access free bracket rounds',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    benefits?.maxTournaments > 0 && {
      icon: Crown,
      label: 'Tournament Limit',
      description: `Up to ${benefits.maxTournaments} tournament${benefits.maxTournaments > 1 ? 's' : ''} per month`,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    benefits?.watchStreams && {
      icon: Tv,
      label: 'Watch Streams',
      description: 'Access tournament streams',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    benefits?.standardPrizeWinnings && {
      icon: Gift,
      label: 'Standard Prizes',
      description: 'Eligible for prize winnings',
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
    },
    {
      icon: DollarSign,
      label: 'Membership Cost',
      description: price === 0 ? 'Free forever' : `$${price}/month`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
  ].filter(Boolean) as {
    icon: any
    label: string
    description: string
    color: string
    bg: string
  }[]

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#D62555]/15 rounded-xl flex items-center justify-center">
          <BadgeDollarSign className="w-4 h-4 text-[#D62555]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-poppins">Subscription</h2>
          <p className="text-xs text-gray-500 font-poppins">Manage your membership plan</p>
        </div>
      </div>

      {/* Platform / Organizer toggle */}
      <div className="flex gap-1 bg-[#2c3036] p-1 rounded-xl w-fit">
        {[
          { key: 'platform' as const, label: 'Platform', icon: Gamepad2 },
          { key: 'organizer' as const, label: 'Organizer', icon: Building2 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeView === key
                ? 'bg-[#D62555] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveView(key)}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── PLATFORM VIEW ─────────────────────────────────── */}
      {activeView === 'platform' && (
        <>
          {/* Current plan card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#212529] to-[#1a1d21] rounded-2xl border border-white/[0.06]">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#D62555]/10 rounded-full blur-3xl" />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1 font-poppins">
                    Current Plan
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-poppins mb-1">
                    {planName}
                  </h3>
                  <p className="text-sm text-gray-400 font-poppins mb-4">
                    {isPremium
                      ? 'You have access to premium features'
                      : 'Upgrade to unlock premium features'}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/[0.08]">
                    <span className="text-2xl font-black text-white">
                      {price === 0 ? 'FREE' : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-xs text-gray-500 font-poppins">/month</span>
                    )}
                  </div>
                </div>
                {!isPremium && (
                  <div className="shrink-0">
                    <Link
                      href="/pricing"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D62555] to-[#b81f47] hover:from-[#e02d60] hover:to-[#c92450] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-[#D62555]/20"
                    >
                      <Crown className="w-4 h-4" />
                      Upgrade Plan
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Benefits card */}
          <div className="bg-[#212529] rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white font-poppins">Your Benefits</h3>
              <p className="text-xs text-gray-500 font-poppins mt-0.5">
                {benefitsList.length} features included in your plan
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
              {benefitsList.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-5 bg-[#212529] hover:bg-white/[0.02] transition-colors"
                  >
                    <div
                      className={`w-9 h-9 ${benefit.bg} rounded-xl flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${benefit.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white font-poppins">
                        {benefit.label}
                      </p>
                      <p className="text-xs text-gray-500 font-poppins mt-0.5">
                        {benefit.description}
                      </p>
                    </div>
                    <Check className="w-4 h-4 text-green-400/60 shrink-0 mt-0.5 ml-auto" />
                  </div>
                )
              })}
            </div>
          </div>

          <GiftSubscription />
        </>
      )}

      {/* ── ORGANIZER VIEW ─────────────────────────────────── */}
      {activeView === 'organizer' && (
        <>
          {loadingOrg ? (
            <div className="bg-[#212529] rounded-2xl border border-white/[0.06] p-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D62555] border-t-transparent" />
            </div>
          ) : organization ? (
            <>
              {/* Organization card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#212529] to-[#1a1d21] rounded-2xl border border-white/[0.06]">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-5">
                    {organization.logo || organization.profileImage ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#2c3036] shrink-0">
                        <Image
                          unoptimized
                          alt={organization.name || 'Organization'}
                          src={organization.logo || organization.profileImage}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-blue-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-0.5 font-poppins">
                        Organization
                      </p>
                      <h3 className="text-xl sm:text-2xl font-black text-white font-poppins truncate">
                        {organization.name || 'My Organization'}
                      </h3>
                    </div>
                  </div>

                  {/* Organizer plan */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
                    <div>
                      <p className="text-sm text-gray-400 font-poppins">Organizer Plan</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-white">Freemium</span>
                        <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-400/10 rounded-full">
                          FREE
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/pricing"
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                      <Crown className="w-4 h-4" />
                      Upgrade
                    </Link>
                  </div>
                </div>
              </div>

              {/* Organizer benefits */}
              <div className="bg-[#212529] rounded-2xl border border-white/[0.06] overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06]">
                  <h3 className="text-sm font-bold text-white font-poppins">Organizer Benefits</h3>
                  <p className="text-xs text-gray-500 font-poppins mt-0.5">
                    Included with your organizer plan
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
                  {[
                    {
                      icon: Trophy,
                      label: 'Create Tournaments',
                      description: 'Host and manage tournaments',
                      color: 'text-green-400',
                      bg: 'bg-green-400/10',
                    },
                    {
                      icon: Building2,
                      label: 'Organization Page',
                      description: 'Custom organization profile',
                      color: 'text-blue-400',
                      bg: 'bg-blue-400/10',
                    },
                    {
                      icon: Tv,
                      label: 'Streaming Integration',
                      description: 'Embed streams in tournaments',
                      color: 'text-purple-400',
                      bg: 'bg-purple-400/10',
                    },
                    {
                      icon: DollarSign,
                      label: 'Organizer Cost',
                      description: 'Free to get started',
                      color: 'text-emerald-400',
                      bg: 'bg-emerald-400/10',
                    },
                  ].map((benefit, idx) => {
                    const Icon = benefit.icon
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-5 bg-[#212529] hover:bg-white/[0.02] transition-colors"
                      >
                        <div
                          className={`w-9 h-9 ${benefit.bg} rounded-xl flex items-center justify-center shrink-0`}
                        >
                          <Icon className={`w-4 h-4 ${benefit.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white font-poppins">
                            {benefit.label}
                          </p>
                          <p className="text-xs text-gray-500 font-poppins mt-0.5">
                            {benefit.description}
                          </p>
                        </div>
                        <Check className="w-4 h-4 text-green-400/60 shrink-0 mt-0.5 ml-auto" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            /* No organization */
            <div className="bg-[#212529] rounded-2xl border border-white/[0.06] p-8 sm:p-10 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-poppins mb-2">
                No Organization Yet
              </h3>
              <p className="text-sm text-gray-400 font-poppins mb-5 max-w-sm mx-auto">
                Create an organization to host tournaments and manage your esports events.
              </p>
              <Link
                href="/organization/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D62555] hover:bg-[#b81f47] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Building2 className="w-4 h-4" />
                Create Organization
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SubscriptionTab
