'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession } from 'next-auth/react'
import { ArrowLeft } from 'lucide-react'

import { NavBar } from '@/components/team/helpers/navbar'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import GeneralSection from '@/components/team/edit-team/GeneralSection'
import BrandingTab from '@/components/team/edit-team/brandingTab'
import MembersTab from '@/components/team/edit-team/membersTab'
import SocialMedia from '@/components/team/edit-team/socialMediaTab'
import Settings from '@/components/team/edit-team/settingsTab'
import { getTeamsByUserId, getTeamById } from '@/services/teamService'

export default function EditRoster({ params }: { params: Promise<{ id: string }> }) {
  const { id: teamId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [team, setTeam] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUserTeam, setIsUserTeam] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState('General')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const urlTab = searchParams.get('tab')
    setActiveTab(urlTab ?? 'General')
    setMounted(true)
  }, [searchParams])

  useEffect(() => {
    if (!teamId) {
      return
    }

    const fetchTeam = async () => {
      setLoading(true)
      try {
        const fetchedTeam = await getTeamById(teamId)
        if (!fetchedTeam) {
          router.push('/404')
          return
        }
        setTeam(fetchedTeam)
      } catch (_) {
        router.push('/404')
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [teamId, router])

  // Check if current user owns this team
  useEffect(() => {
    if (!teamId) {
      return
    }

    const checkUserTeam = async () => {
      try {
        const session = await getSession()

        const userId = session?.user?._id as string
        if (!userId) {
          setIsUserTeam(false)
          return
        }
        const userTeams = await getTeamsByUserId(userId)
        const isOwner = userTeams.some(t => t._id === teamId)
        setIsUserTeam(isOwner)
      } catch {
        setIsUserTeam(false)
      }
    }

    checkUserTeam()
  }, [teamId])

  const navItems = [
    { id: 'General', label: 'General' },
    { id: 'Branding', label: 'Branding' },
    { id: 'Members', label: 'Members' },
    { id: 'Social Media', label: 'Social Media' },
    { id: 'Settings', label: 'Settings' },
  ]

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    const params = new URLSearchParams(window.location.search)
    params.set('tab', tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  if (loading || !team) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-white font-poppins text-lg">
          <img alt="Loading..." src="/Loader.gif" />
        </div>
      </div>
    )
  }

  // Access denied
  if (isUserTeam === false) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center">
        <div className="text-white font-poppins text-center">
          <Typo as="h4" className="mb-4" fontFamily="poppins" fontVariant="h4">
            Access Denied
          </Typo>
          <Typo className="text-lg" fontFamily="poppins">
            You don't have permission to edit this team.
          </Typo>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <div className="pt-10 px-4 lg:px-20">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <Button
                icon={<ArrowLeft className="w-5 h-5" />}
                label="Back to Team Profile"
                size="s"
                variant="outlined-grey"
                onClick={() => router.push(`/team/${teamId}/profile`)}
              />
            </div>
            <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h3" fontWeight="regular">
              Edit Team
            </Typo>
            <Typo
              as="p"
              className="mt-2 md:mt-0"
              color="white"
              fontFamily="poppins"
              fontVariant="p2"
              fontWeight="regular"
            >
              Manage your team's profile, settings
            </Typo>
          </div>
        </div>

        <div className="mb-6">
          <NavBar activeId={activeTab} items={navItems} onItemClick={handleTabClick} />
        </div>

        {activeTab === 'General' && <GeneralSection team={team} teamId={teamId} />}
        {activeTab === 'Branding' && <BrandingTab team={team} teamId={teamId} />}
        {activeTab === 'Members' && <MembersTab team={team} teamId={teamId} />}
        {activeTab === 'Social Media' && <SocialMedia team={team} />}
        {activeTab === 'Settings' && <Settings team={team} />}
      </div>
    </div>
  )
}
