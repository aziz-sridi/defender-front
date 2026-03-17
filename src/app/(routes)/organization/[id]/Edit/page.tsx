'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { AccessDenied, OrganizationNotFound } from '@/components/organizations/errorPages'
import { NavBar } from '@/components/organizations/navbar'
import GeneralSection, {
  generalSave,
  generalCancel,
} from '@/components/organizations/updateOrganisation/GeneralSection'
import BrandingTab, {
  brandingSave,
  brandingCancel,
} from '@/components/organizations/updateOrganisation/brandingTab'
import JoinRequestsTab from '@/components/organizations/updateOrganisation/joinRequestsTab'
import MembersTab from '@/components/organizations/updateOrganisation/membersTab'
import MembershipsTab, {
  membersSave,
  membersCancel,
} from '@/components/organizations/updateOrganisation/membershipsTab'
import Settings, {
  settingsSave,
  settingsCancel,
} from '@/components/organizations/updateOrganisation/settingsTab'
import SocialMedia, {
  socialMediaSave,
  socialMediaCancel,
} from '@/components/organizations/updateOrganisation/socialMediaTab'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { getOrganizationById } from '@/services/organizationService'
import type { Organization } from '@/types/organizationType'

export default function EditRoster({ params }: { params: Promise<{ id: string }> }) {
  const { id: organizationId } = use(params)
  const [activeTab, setActiveTab] = useState('General')
  const [mounted, setMounted] = useState(false)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUserOrganization, setIsUserOrganization] = useState<boolean | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: sessionData } = useSession()
  const session = sessionData

  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab) {
      setActiveTab(urlTab)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true)
        const fetchedOrganization = await getOrganizationById(organizationId)
        setOrganization(fetchedOrganization)
        const userId = session?.user?._id

        // Check if user is organization creator or staff member
        const isCreator = fetchedOrganization.createdBy._id === userId
        const isStaffMember = fetchedOrganization.staff?.some((staffMember: any) => {
          const staffUserId =
            typeof staffMember.user === 'string'
              ? staffMember.user
              : staffMember.user?._id || staffMember.user?.id
          return (
            staffUserId === userId &&
            ['Founder', 'Admin', 'Bracket Manager', 'Moderator'].includes(staffMember.role)
          )
        })

        setIsUserOrganization(isCreator || isStaffMember)
        setLoading(false)
      } catch (error) {
        setIsUserOrganization(false)
        setLoading(false)
      }
    }
    fetchOrganization()
  }, [organizationId, session])

  const navItems = [
    { id: 'General', label: 'General' },
    { id: 'Branding', label: 'Branding' },
    { id: 'Members', label: 'Members' },
    { id: 'Memberships', label: 'Memberships' },
    { id: 'Join Requests', label: 'Join Requests' },
    { id: 'Social Media', label: 'Social Media' },
    { id: 'Settings', label: 'Settings' },
  ]

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    const params = new URLSearchParams(window.location.search)
    params.set('tab', tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const handleBackToProfile = () => {
    router.push(`/organization/${organizationId}/Profile`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center">
        <div className="text-white font-poppins">Loading organization data...</div>
      </div>
    )
  }

  if (!organization) {
    return <OrganizationNotFound />
  }
  if (isUserOrganization === false) {
    return <AccessDenied />
  }

  let activeTabFunctions = { onSaveChanges: () => {}, onCancelChanges: () => {} }

  switch (activeTab) {
    case 'General':
      activeTabFunctions = { onSaveChanges: generalSave, onCancelChanges: generalCancel }
      break
    case 'Branding':
      activeTabFunctions = { onSaveChanges: brandingSave, onCancelChanges: brandingCancel }
      break
    case 'Memberships':
      activeTabFunctions = { onSaveChanges: membersSave, onCancelChanges: membersCancel }
      break
    case 'Settings':
      activeTabFunctions = { onSaveChanges: settingsSave, onCancelChanges: settingsCancel }
      break
    case 'Social Media':
      activeTabFunctions = { onSaveChanges: socialMediaSave, onCancelChanges: socialMediaCancel }
      break
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white relative">
      <div className="pt-10 pb-20 px-4 lg:px-20">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToProfile}
            className="w-10 h-10 rounded-full bg-[#212529] border border-white/10 flex items-center justify-center hover:bg-[#2a2d31] hover:border-white/20 transition-all flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex flex-col">
            <Typo
              as="h2"
              className="text-lg sm:text-sm md:text-lg"
              color="white"
              fontFamily="poppins"
              fontVariant="h2"
              fontWeight="regular"
            >
              Edit Organization
            </Typo>
            <Typo
              as="p"
              className="text-s sm:text-sm md:text-lg mt-1 md:mt-0"
              color="white"
              fontFamily="poppins"
              fontVariant="p3"
              fontWeight="regular"
            >
              Manage your organization's profile, settings
            </Typo>
          </div>
        </div>

        <div className="mb-6">
          <NavBar activeId={activeTab} items={navItems} onItemClick={handleTabClick} />
        </div>

        {activeTab === 'General' && (
          <GeneralSection organization={organization} organizationId={organizationId} />
        )}
        {activeTab === 'Branding' && (
          <BrandingTab organization={organization} organizationId={organizationId} />
        )}
        {activeTab === 'Members' && (
          <MembersTab organization={organization} organizationId={organizationId} />
        )}
        {activeTab === 'Memberships' && <MembershipsTab organizationId={organizationId} />}
        {activeTab === 'Join Requests' && <JoinRequestsTab />}
        {activeTab === 'Social Media' && <SocialMedia organization={organization} />}
        {activeTab === 'Settings' && <Settings organization={organization} />}
      </div>
      {!(activeTab === 'Members' || activeTab === 'Join Requests') && (
        <>
          <div className="hidden sm:flex fixed top-16 right-0 z-50 bg-[#161616]/20 m-6 rounded-xl backdrop-blur-sm p-4 gap-4 border-2 border-white/20 shadow-md">
            <Button
              className="font-poppins w-auto"
              label="Cancel"
              variant="contained-black"
              onClick={() => activeTabFunctions.onCancelChanges?.()}
            />
            <Button
              className="font-poppins w-auto"
              label="Save Changes"
              variant="contained-red"
              onClick={() => activeTabFunctions.onSaveChanges?.()}
            />
          </div>

          <div className="sm:hidden fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[300px] p-4 bg-[#161616]/20 rounded-xl flex gap-4 justify-center border-2 border-white/20 m-2 z-50">
            <Button
              className="font-poppins w-auto"
              label="Cancel"
              variant="contained-black"
              onClick={() => activeTabFunctions.onCancelChanges?.()}
            />
            <Button
              className="font-poppins w-auto"
              label="Save Changes"
              variant="contained-red"
              onClick={() => activeTabFunctions.onSaveChanges?.()}
            />
          </div>
        </>
      )}
    </div>
  )
}
