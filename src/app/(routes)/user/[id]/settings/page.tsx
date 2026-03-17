'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Settings } from 'lucide-react'
import { getSession } from 'next-auth/react'

import { UserSidebar } from '@/components/user/settings/SideBar/SidebarDesktop'
import Account from '@/components/user/settings/sidebarTabs/account'
import Profile from '@/components/user/settings/sidebarTabs/profile'
import Subscription from '@/components/user/settings/sidebarTabs/subscription'
import Notification from '@/components/user/settings/sidebarTabs/notification'
import Chat from '@/components/user/settings/sidebarTabs/chat'
import Security from '@/components/user/settings/sidebarTabs/security'
import { UserSidebarMobile } from '@/components/user/settings/SideBar/SidebarMobile'
import { getMembershipDetailsByMembershipPeriod, getUserById } from '@/services/userService'
import GameAccount from '@/components/user/settings/sidebarTabs/gameAccount'
import { VariantImage } from '@/components/ui/VariantImage'

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('My Account')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [membership, setMembership] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobileContentVisible, setIsMobileContentVisible] = useState(false)
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userIdUrl = params.id

  const navItems = [
    { id: 'My Account', label: 'My Account' },
    { id: 'Profile', label: 'Profile' },
    { id: 'Subscription', label: 'Subscription' },
    { id: 'Security', label: 'Security' },
    { id: 'Notification', label: 'Notification' },
    { id: 'Game-accounts', label: 'Game-accounts' },
    { id: 'Chat', label: 'Chat' },
    { id: 'Language', label: 'Language' },
  ]

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession()
        const userId = session?.user?._id as string
        setAuthenticatedUserId(userId)
        if (userIdUrl !== userId) {
          router.push('/404')
        }
        setLoading(true)
        const user = await getUserById(userId)
        if (!user) {
          router.push('/404')
        }
        if (user) {
          const membershipDetails = user.membershipPeriod
            ? await getMembershipDetailsByMembershipPeriod(user.membershipPeriod)
            : null
          setMembership(membershipDetails)
        }
        setUser(user)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        router.push('/404')
      }
    }
    fetchUser()
  }, [userIdUrl])

  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab) {
      setActiveTab(urlTab)
      setIsMobileContentVisible(true)
    } else {
      setActiveTab('My Account')
    }
    setMounted(true)
  }, [searchParams])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    setIsMobileContentVisible(true)
    const params = new URLSearchParams(window.location.search)
    params.set('tab', tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  if (!mounted) return null

  if (!mounted || loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-white font-poppins text-lg">
          <VariantImage alt="Loading..." className="w-full h-full" src="/Loader.gif" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-10">
        {/* Page header - visible on all sizes */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D62555] to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-[#D62555]/20">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-poppins">Settings</h1>
            <p className="text-xs sm:text-sm text-gray-400 font-poppins">
              Manage your account preferences
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-[300px] shrink-0">
            <UserSidebar
              activeId={activeTab}
              items={navItems}
              user={user}
              onItemClick={handleTabClick}
            />
          </div>

          {/* Mobile sidebar (shows when content is not visible) */}
          <div className={`lg:hidden ${isMobileContentVisible ? 'hidden' : 'block'}`}>
            <UserSidebarMobile
              activeId={activeTab}
              authenticatedUserId={authenticatedUserId}
              items={navItems}
              user={user}
              onItemClick={handleTabClick}
            />
          </div>

          {/* Content area */}
          <div
            className={`flex-1 min-w-0 ${!isMobileContentVisible ? 'hidden' : 'block'} lg:block`}
          >
            {/* Mobile back button */}
            <button
              className="lg:hidden flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
              onClick={() => setIsMobileContentVisible(false)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium font-poppins">Back to menu</span>
            </button>

            {/* Active tab content */}
            <div>
              {activeTab === 'My Account' && user && <Account user={user} />}
              {activeTab === 'Profile' && user && <Profile user={user} />}
              {activeTab === 'Subscription' && user && (
                <Subscription membershipDetails={membership} user={user} />
              )}
              {activeTab === 'Notification' && user && <Notification user={user} />}
              {activeTab === 'Chat' && <Chat user={user} />}
              {activeTab === 'Security' && user && <Security user={user} />}
              {activeTab === 'Game-accounts' && user && <GameAccount user={user} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
