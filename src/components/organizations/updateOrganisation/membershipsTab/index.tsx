'use client'
import { useEffect, useState } from 'react'
import { Crown, Badge, Ticket, Sparkles, Wallet, Heart } from 'lucide-react'

import { Switch } from '@/components/ui/switch'
import Typo from '@/components/ui/Typo'
import { getOrganizationById, updateOrganizationV2 } from '@/services/organizationService'

interface MembershipsTabProps {
  organizationId?: string
}
let saveFn: (() => void) | null = null
export function membersSave() {
  if (saveFn) {
    saveFn()
  }
}
let cancelFn: (() => void) | null = null
export function membersCancel() {
  if (cancelFn) {
    cancelFn()
  }
}
export default function MembershipsTab({ organizationId }: MembershipsTabProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [org, setOrg] = useState<any>(null)
  const [isMembershipEnabled, setIsMembershipEnabled] = useState(false)
  const [hasSubscriberBadge, setHasSubscriberBadge] = useState(false)
  const [hasPaidEntryFees, setHasPaidEntryFees] = useState(false)
  const [hasSpecialEvents, setHasSpecialEvents] = useState(false)
  const [supporterPrice, setSupporterPrice] = useState('5')

  useEffect(() => {
    //when you have enough data change it
    organizationId = null
    if (!organizationId) {
      return
    }
    setLoading(true)
    getOrganizationById(organizationId)
      .then(data => {
        if (!data) {
          setOrg(null)
          setLoading(false)
          return
        }
        setOrg(data)
        setIsMembershipEnabled(!!data.membershipEnabled)
        setHasSubscriberBadge(!!data.membershipSubscriberBadge)
        setHasPaidEntryFees(!!data.membershipPaidEntryFees)
        setHasSpecialEvents(!!data.membershipSpecialEvents)
        setSupporterPrice(data.membershipSupporterPrice || '5')
        setLoading(false)
      })
      .catch(() => {
        setOrg(null)
        setLoading(false)
      })
  }, [organizationId])

  const onCancelChanges = () => {
    if (!org) {
      return
    }
    setIsMembershipEnabled(!!org.membershipEnabled)
    setHasSubscriberBadge(!!org.membershipSubscriberBadge)
    setHasPaidEntryFees(!!org.membershipPaidEntryFees)
    setHasSpecialEvents(!!org.membershipSpecialEvents)
    setSupporterPrice(org.membershipSupporterPrice || '5')
  }
  cancelFn = onCancelChanges
  const onSaveChanges = async () => {
    if (!organizationId) {
      return
    }
    setSaving(true)
    try {
      const settingsPayload = {
        membershipEnabled: isMembershipEnabled,
        membershipSubscriberBadge: hasSubscriberBadge,
        membershipPaidEntryFees: hasPaidEntryFees,
        membershipSpecialEvents: hasSpecialEvents,
        membershipSupporterPrice: supporterPrice,
      }
      const payload = {
        settings: settingsPayload,
      }
      await updateOrganizationV2(organizationId, payload)
    } catch {
      setError('Failed to save membership settings.')
    } finally {
      setSaving(false)
    }
  }
  saveFn = onSaveChanges
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Typo as="p" className="text-gray-400">
          Loading membership settings...
        </Typo>
      </div>
    )
  }

  if (!organizationId || !org) {
    return (
      <div className="flex flex-col gap-6 max-w-7xl pb-10 mx-auto relative">
        <div className="bg-[#212529] rounded-xl p-7 sm:p-10 flex flex-col gap-6">
          <Typo as="p" className="text-gray-400">
            Not enough organization data available.
          </Typo>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Typo as="p" className="text-red-500">
          {error}
        </Typo>
      </div>
    )
  }

  const perkItems = [
    {
      label: 'Subscriber badge',
      description: 'Exclusive badge next to their name',
      icon: Badge,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
      checked: hasSubscriberBadge,
      onChange: setHasSubscriberBadge,
    },
    {
      label: '5% Off paid entry fees',
      description: 'Discount on tournament entry costs',
      icon: Ticket,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/15',
      checked: hasPaidEntryFees,
      onChange: setHasPaidEntryFees,
    },
    {
      label: 'Special events access',
      description: 'Members-only tournaments & events',
      icon: Sparkles,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/15',
      checked: hasSpecialEvents,
      onChange: setHasSpecialEvents,
    },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-7xl pb-10 mx-auto relative">
      {/* Section 1: Enable Membership */}
      <div className="bg-[#212529] rounded-xl p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#D62555]/15 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#D62555]" />
            </div>
            <Typo
              as="h1"
              className="text-lg sm:text-xl"
              color="white"
              fontFamily="poppins"
              fontVariant="h3"
            >
              Membership Tiers
            </Typo>
          </div>
          <Typo as="p" className="text-gray-500 text-sm mt-1 ml-[46px]" fontFamily="poppins">
            Configure membership options for fans and supporters.
          </Typo>
        </div>

        <div className="flex justify-between items-center bg-[#1a1d20] rounded-xl p-4 sm:p-5 border border-white/5 gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <Typo
              as="h4"
              className="text-sm sm:text-base"
              color="white"
              fontFamily="poppins"
              fontVariant="h4"
            >
              Enable Membership Program
            </Typo>
            <Typo as="p" className="text-gray-500 text-xs sm:text-sm" fontFamily="poppins">
              Fans can subscribe to support your org and unlock perks.
            </Typo>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D62555]" />
              <Typo as="span" className="text-[#D62555] text-[11px]" fontFamily="poppins">
                Connect your Konnect wallet to receive payments
              </Typo>
            </div>
          </div>
          <Switch checked={isMembershipEnabled} onCheckedChange={setIsMembershipEnabled} />
        </div>

        {/* Wallet status */}
        <div className="flex items-center gap-3 bg-[#1a1d20] rounded-xl p-4 border border-white/5">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${org?.walletLinked ? 'bg-green-500/15' : 'bg-orange-500/15'}`}
          >
            <Wallet
              className={`w-4.5 h-4.5 ${org?.walletLinked ? 'text-green-400' : 'text-orange-400'}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <Typo as="p" className="text-white text-sm font-medium" fontFamily="poppins">
              Wallet Status
            </Typo>
            <Typo
              as="p"
              className={`text-xs ${org?.walletLinked ? 'text-green-400' : 'text-orange-400'}`}
              fontFamily="poppins"
            >
              {org?.walletLinked ? 'Connected' : 'Not connected'}
            </Typo>
          </div>
          {!org?.walletLinked && (
            <button
              className="px-4 py-2 bg-[#D62555] hover:bg-[#c01e4a] text-white text-xs font-semibold rounded-lg transition-colors"
              onClick={() => {}}
            >
              Link Wallet
            </button>
          )}
        </div>
      </div>

      {/* Section 2: Tier cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Fan Tier */}
        <div className="bg-[#212529] rounded-xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-500/15 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <Typo
                as="h3"
                className="text-base font-bold"
                color="white"
                fontFamily="poppins"
                fontVariant="h4"
              >
                Fan
              </Typo>
              <Typo as="p" className="text-xs text-gray-500" fontFamily="poppins">
                Free tier
              </Typo>
            </div>
            <div className="ml-auto bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
              <span className="text-blue-400 text-xs font-semibold">Free</span>
            </div>
          </div>
          <div className="h-px bg-white/5" />
          <ul className="flex flex-col gap-2.5">
            <li className="flex items-center gap-2.5 text-sm text-gray-300 font-poppins">
              <div className="w-5 h-5 bg-blue-500/15 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-3 h-3 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Follow organization updates
            </li>
            <li className="flex items-center gap-2.5 text-sm text-gray-300 font-poppins">
              <div className="w-5 h-5 bg-blue-500/15 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-3 h-3 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              View public tournaments
            </li>
            <li className="flex items-center gap-2.5 text-sm text-gray-300 font-poppins">
              <div className="w-5 h-5 bg-blue-500/15 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-3 h-3 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Community access
            </li>
          </ul>
        </div>

        {/* Supporter Tier */}
        <div className="bg-[#212529] rounded-xl p-6 border border-[#D62555]/20 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D62555]/10 to-transparent rounded-bl-full" />
          <div className="absolute top-3 right-3">
            <div className="bg-[#D62555]/15 border border-[#D62555]/25 rounded-full px-2.5 py-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D62555]" />
              <span className="text-[#D62555] text-[10px] font-bold uppercase tracking-wider">
                Popular
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#D62555]/15 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#D62555]" />
            </div>
            <div>
              <Typo
                as="h3"
                className="text-base font-bold"
                color="white"
                fontFamily="poppins"
                fontVariant="h4"
              >
                Supporter
              </Typo>
              <Typo as="p" className="text-xs text-gray-500" fontFamily="poppins">
                Paid tier
              </Typo>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 ml-0.5">
            <div className="flex items-center gap-2">
              <input
                className="w-16 px-2 py-1.5 rounded-lg bg-[#1a1d20] text-white text-lg font-bold border border-white/10 focus:border-[#D62555]/50 outline-none text-center font-poppins"
                min="1"
                step="1"
                type="number"
                value={supporterPrice}
                onChange={e => setSupporterPrice(e.target.value)}
              />
              <span className="text-gray-500 text-sm font-poppins">TND / month</span>
            </div>
          </div>
          <div className="h-px bg-white/5" />
          <ul className="flex flex-col gap-2.5">
            {perkItems.map(perk => (
              <li key={perk.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-5 h-5 ${perk.iconBg} rounded-full flex items-center justify-center shrink-0`}
                  >
                    <perk.icon className={`w-3 h-3 ${perk.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm text-gray-200 font-poppins">{perk.label}</span>
                  </div>
                </div>
                <Switch
                  checked={perk.checked}
                  onCheckedChange={perk.onChange}
                  className="shrink-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
