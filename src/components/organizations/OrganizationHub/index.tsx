'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import Loader from '@/app/loading'
import { getJoinedOrganizations } from '@/services/organizationService'
import { organizerImageSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface Organization {
  _id: string
  name: string
  description?: string
  logo?: string
  logoImage?: string
  staff?: Array<{
    user: string | { _id: string; id?: string }
    role: 'Founder' | 'Admin' | 'Member'
  }>
  members?: Array<{
    user: string | { _id: string; id?: string }
    status: 'active' | 'pending' | 'rejected'
  }>
}

interface UserOrganizationStatus {
  isFounder: boolean
  isMember: boolean
  foundedOrganizations: Organization[]
  joinedOrganizations: Organization[]
  hasAnyOrganization: boolean
}

interface OrganizationCardProps {
  organization: Organization
  userRole: 'Founder' | 'Admin' | 'Member'
  onSelect: (orgId: string) => void
  isSelected?: boolean
}

const OrganizationCard = ({
  organization,
  userRole,
  onSelect,
  isSelected,
}: OrganizationCardProps) => {
  const [imageError, setImageError] = useState(false)

  // Safe image URL with fallback
  const imageUrl = useMemo(() => {
    if (imageError) {
      return DEFAULT_IMAGES.ORGANIZATION
    }
    return organizerImageSanitizer(
      organization?.logo || organization?.logoImage || '',
      DEFAULT_IMAGES.ORGANIZATION,
    )
  }, [organization?.logo, organization?.logoImage, imageError])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Founder':
        return 'bg-defendrRed/20 text-defendrRed border-defendrRed/30'
      case 'Admin':
        return 'bg-defendrBlue/20 text-defendrBlue border-defendrBlue/30'
      case 'Member':
        return 'bg-defendrGreen/20 text-defendrGreen border-defendrGreen/30'
      default:
        return 'bg-defendrLightGrey/20 text-defendrLightGrey border-defendrLightGrey/30'
    }
  }

  return (
    <div
      className={`
        group relative bg-defendrLightBlack/50 border rounded-xl p-6 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'border-defendrRed bg-defendrRed/5 shadow-lg shadow-defendrRed/20'
            : 'border-defendrGrey hover:border-defendrRed/50 hover:bg-defendrLightBlack/70'
        }
      `}
      onClick={() => onSelect(organization._id)}
    >
      {/* Organization Logo */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-defendrGrey flex-shrink-0 group-hover:bg-defendrLightGrey transition-colors duration-200">
          <Image
            src={imageUrl}
            alt={`${organization?.name || 'Organization'} logo`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        <div className="flex-1 min-w-0">
          <Typo
            as="h3"
            className="text-defendrWhite font-semibold text-lg mb-1 truncate group-hover:text-defendrRed transition-colors duration-200"
            fontFamily="poppins"
          >
            {organization.name}
          </Typo>

          {organization.description && (
            <Typo
              as="p"
              className="text-defendrLightGrey text-sm line-clamp-2 group-hover:text-defendrSilver transition-colors duration-200"
              fontFamily="poppins"
            >
              {organization.description}
            </Typo>
          )}
        </div>
      </div>

      {/* Role Badge and Selection */}
      <div className="flex items-center justify-between">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(userRole)}`}
        >
          {userRole}
        </div>

        {isSelected && (
          <div className="flex items-center gap-1 text-defendrRed">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Selected</span>
          </div>
        )}
      </div>
    </div>
  )
}

interface OrganizationSelectorProps {
  organizations: Organization[]
  userRole: 'Founder' | 'Admin' | 'Member'
  onSelect: (orgId: string) => void
  selectedOrgId?: string
}

const OrganizationSelector = ({
  organizations,
  userRole,
  onSelect,
  selectedOrgId,
}: OrganizationSelectorProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <Typo
          as="h1"
          className="text-defendrWhite font-bold text-2xl sm:text-3xl mb-4"
          fontFamily="poppins"
        >
          Select Organization
        </Typo>
        <Typo as="p" className="text-defendrLightGrey text-base sm:text-lg" fontFamily="poppins">
          Choose the organization for which you want to view and manage.
        </Typo>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {organizations.map(org => (
          <OrganizationCard
            key={org._id}
            organization={org}
            userRole={userRole}
            onSelect={onSelect}
            isSelected={selectedOrgId === org._id}
          />
        ))}
      </div>
    </div>
  )
}

interface OrganizationHubProps {
  onOrganizationSelect: (orgId: string) => void
  onCreateOrganization: () => void
}

const OrganizationHub = ({ onOrganizationSelect, onCreateOrganization }: OrganizationHubProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userOrgStatus, setUserOrgStatus] = useState<UserOrganizationStatus | null>(null)
  const [selectedOrgId, setSelectedOrgId] = useState<string>('')

  // Analyze user's organization status
  const analyzeUserOrganizations = useCallback(
    (organizations: Organization[], userId: string): UserOrganizationStatus => {
      const foundedOrgs: Organization[] = []
      const joinedOrgs: Organization[] = []

      organizations.forEach(org => {
        const isFounder = org.staff?.some(staffMember => {
          const staffUserId =
            typeof staffMember.user === 'string'
              ? staffMember.user
              : staffMember.user?._id || staffMember.user?.id
          return staffUserId === userId && staffMember.role === 'Founder'
        })

        const isMember =
          org.staff?.some(staffMember => {
            const staffUserId =
              typeof staffMember.user === 'string'
                ? staffMember.user
                : staffMember.user?._id || staffMember.user?.id
            return staffUserId === userId
          }) ||
          org.members?.some(member => {
            const memberUserId =
              typeof member.user === 'string' ? member.user : member.user?._id || member.user?.id
            return memberUserId === userId
          })

        if (isFounder) {
          foundedOrgs.push(org)
        } else if (isMember) {
          joinedOrgs.push(org)
        }
      })

      return {
        isFounder: foundedOrgs.length > 0,
        isMember: joinedOrgs.length > 0,
        foundedOrganizations: foundedOrgs,
        joinedOrganizations: joinedOrgs,
        hasAnyOrganization: foundedOrgs.length > 0 || joinedOrgs.length > 0,
      }
    },
    [],
  )

  // Load user organizations
  useEffect(() => {
    const loadUserOrganizations = async () => {
      if (status === 'loading') return

      if (!session?.user?._id) {
        router.push('/signin')
        return
      }

      try {
        setLoading(true)
        const organizations = await getJoinedOrganizations()
        const orgStatus = analyzeUserOrganizations(organizations, session.user._id)
        setUserOrgStatus(orgStatus)
      } catch (error) {
        console.error('Error loading organizations:', error)
        toast.error('Failed to load organizations')
      } finally {
        setLoading(false)
      }
    }

    loadUserOrganizations()
  }, [session, status, router, analyzeUserOrganizations])

  const handleOrganizationSelect = useCallback(
    (orgId: string) => {
      setSelectedOrgId(orgId)
      onOrganizationSelect(orgId)
    },
    [onOrganizationSelect],
  )

  const handleCreateOrganization = useCallback(() => {
    onCreateOrganization()
  }, [onCreateOrganization])

  if (status === 'loading' || loading) {
    return <Loader />
  }

  if (!userOrgStatus) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Typo as="h2" className="text-defendrWhite font-semibold mb-4" fontFamily="poppins">
            Unable to load organizations
          </Typo>
          <Typo as="p" className="text-defendrLightGrey" fontFamily="poppins">
            Please try refreshing the page or contact support.
          </Typo>
        </div>
      </div>
    )
  }

  // Scenario 1: User is a founder of organizations
  if (userOrgStatus.isFounder) {
    return (
      <div className="w-full">
        <OrganizationSelector
          organizations={userOrgStatus.foundedOrganizations}
          userRole="Founder"
          onSelect={handleOrganizationSelect}
          selectedOrgId={selectedOrgId}
        />
        <button
          type="button"
          onClick={handleCreateOrganization}
          className="mt-6 w-full group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] hover:border-defendrRed/40 hover:bg-defendrRed/[0.04] transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-defendrRed/15 group-hover:bg-defendrRed/25 flex items-center justify-center flex-shrink-0 transition-colors">
            <svg className="w-5 h-5 text-defendrRed" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm sm:text-base font-poppins">
              Create New Organisation
            </p>
            <p className="text-gray-500 text-xs sm:text-sm font-poppins mt-0.5">
              Start a new organisation to manage tournaments
            </p>
          </div>
        </button>
      </div>
    )
  }

  // Scenario 2: User is a member of organizations (but not founder)
  if (userOrgStatus.isMember) {
    return (
      <div className="w-full">
        <OrganizationSelector
          organizations={userOrgStatus.joinedOrganizations}
          userRole="Member"
          onSelect={handleOrganizationSelect}
          selectedOrgId={selectedOrgId}
        />
        <button
          type="button"
          onClick={handleCreateOrganization}
          className="mt-6 w-full group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] hover:border-defendrRed/40 hover:bg-defendrRed/[0.04] transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-defendrRed/15 group-hover:bg-defendrRed/25 flex items-center justify-center flex-shrink-0 transition-colors">
            <svg className="w-5 h-5 text-defendrRed" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm sm:text-base font-poppins">
              Create Your Own Organisation
            </p>
            <p className="text-gray-500 text-xs sm:text-sm font-poppins mt-0.5">
              Become a founder and start your own organisation
            </p>
          </div>
        </button>
      </div>
    )
  }

  // Scenario 3: User has no organizations — premium empty state
  return (
    <div className="w-full max-w-lg mx-auto text-center py-8">
      {/* Icon */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-defendrRed to-rose-500 flex items-center justify-center shadow-2xl shadow-red-900/30">
        <svg
          className="w-10 h-10 sm:w-12 sm:h-12 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
          />
        </svg>
      </div>

      <Typo as="h1" className="text-white font-bold text-2xl sm:text-3xl mb-3" fontFamily="poppins">
        Start Your Organisation
      </Typo>
      <Typo
        as="p"
        className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed"
        fontFamily="poppins"
      >
        You&apos;re not part of any organisation yet. Create one to start hosting tournaments and
        building your community.
      </Typo>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
        {[
          { icon: '🏆', title: 'Host Tournaments', desc: 'Create and manage competitive events' },
          { icon: '👥', title: 'Build a Team', desc: 'Invite staff and grow your org' },
          { icon: '📊', title: 'Track Stats', desc: 'Monitor your org performance' },
        ].map(f => (
          <div key={f.title} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
            <div className="text-xl mb-1.5">{f.icon}</div>
            <p className="text-white font-semibold text-sm font-poppins mb-0.5">{f.title}</p>
            <p className="text-gray-500 text-xs font-poppins leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <Button
        label="Create Your Organisation"
        size="l"
        variant="contained-red"
        onClick={handleCreateOrganization}
        className="w-full rounded-xl shadow-lg shadow-red-900/30 hover:scale-[1.02] transition-transform"
      />
      <Typo as="p" className="text-gray-600 text-sm mt-4" fontFamily="poppins">
        Or join an existing organisation by invitation
      </Typo>
    </div>
  )
}

export default OrganizationHub
