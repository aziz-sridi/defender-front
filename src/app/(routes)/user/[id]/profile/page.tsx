'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { NavBar } from '@/components/user/userProfileTabs/navbar'
import ProfileBannerUser from '@/components/user/userProfileTabs/ProfileBannerUser'
import { UserInfoCard } from '@/components/user/userProfileTabs/UserInfoCard'
import { OverviewTab } from '@/components/user/userProfileTabs/OverviewTab'
import { EmptyStatTab } from '@/components/user/userProfileTabs/emptyStatTab'
import {
  getFollowers,
  getFriendsByUserId,
  getUserById,
  getMembershipDetailsByMembershipPeriod,
  getUserStats,
} from '@/services/userService'
import {
  getTournamentsByOrganizerId,
  getTournamentsByUserParticipation,
} from '@/services/tournamentService'
import { getGameById } from '@/services/gameService'
import ShareModal from '@/components/user/userProfileTabs/helpers/shareButtons'
import TeamsTab from '@/components/user/userProfileTabs/teamsTab'
import Friends from '@/components/user/userProfileTabs/FriendsTab'
import EventsTab from '@/components/user/userProfileTabs/eventsTab'
import FollowersTab from '@/components/user/userProfileTabs/followersTab'
import Leaderboard from '@/components/user/userProfileTabs/rankingTab'
import { TooltipProvider } from '@/components/ui/tooltip'
import StatsTab from '@/components/user/userProfileTabs/statsTab'

export default function UserProfile() {
  const params = useParams()
  const userId = params.id as string
  const { data: session } = useSession()
  const [showShareModal, setShowShareModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [tournaments, setTournaments] = useState<any[]>([])
  const [organizerTournaments, setOrganizerTournaments] = useState<any[]>([])
  const [gameData, setGameData] = useState<any[]>([])
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [friends, setFriends] = useState<any[]>([])
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [stats, setStats] = useState<any[]>([])
  const [membership, setMembership] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [ownedTeams, setOwnedTeams] = useState<any[]>([])
  const [participatedTeams, setParticipatedTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isUserProfile, setIsUserProfile] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Use session directly instead of getSession()
  const currentUserId = session?.user?._id || null

  useEffect(() => {
    if (!userId) {
      router.push('/404')
      return
    }

    const fetchUserData = async () => {
      try {
        setLoading(true)

        // Get user data
        const userData = await getUserById(userId)
        if (!userData) {
          console.error('User not found')
          return
        }

        // Set user info from the main user data
        setUser(userData)
        setConnectedAccounts(userData.connectedAcc || [])
        setFollowing(userData.following || [])

        // Use data already in user when possible
        const ownedTeams = userData.teamOwnerOf || []
        const participatedTeams = userData.teamRosterOf || []
        setOwnedTeams(ownedTeams)
        setParticipatedTeams(participatedTeams)
        setTeams([...ownedTeams, ...participatedTeams])

        // Get tournaments data with error handling
        try {
          const userTournaments = await getTournamentsByUserParticipation(userId)
          setTournaments(userTournaments || [])
        } catch (error) {
          console.error('Error fetching user tournaments:', error)
          setTournaments([])
        }

        try {
          const orgTournaments = await getTournamentsByOrganizerId(userId)
          setOrganizerTournaments(orgTournaments || [])
        } catch (error) {
          console.error('Error fetching organizer tournaments:', error)
          setOrganizerTournaments([])
        }

        // Get additional data with proper error handling
        try {
          const [friends, followers, statsData, membershipDetails] = await Promise.allSettled([
            getFriendsByUserId(userId),
            getFollowers(userId),
            getUserStats(userId),
            userData.membershipPeriod
              ? getMembershipDetailsByMembershipPeriod(userData.membershipPeriod)
              : Promise.resolve(null),
          ])

          setFriends(friends.status === 'fulfilled' ? friends.value || [] : [])
          setFollowers(followers.status === 'fulfilled' ? followers.value || [] : [])
          setStats(statsData.status === 'fulfilled' ? statsData.value || [] : [])
          setMembership(membershipDetails.status === 'fulfilled' ? membershipDetails.value : null)
        } catch (error) {
          console.error('Error fetching user relationships:', error)
        }

        // Fetch game data if needed
        if (userData.favoriteGames?.length > 0) {
          try {
            const games = await Promise.all(
              userData.favoriteGames.map((game: any) => getGameById(game._id).catch(() => null)),
            )
            // console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeere games: ", games)
            setGameData(games.filter(Boolean))
          } catch (error) {
            console.error('Error fetching game data:', error)
          }
        }

        // Check if this is the current user's profile
        setIsUserProfile(userId === currentUserId)
      } catch (err) {
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId, currentUserId])

  // Set active tab from URL params
  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab) {
      setActiveTab(urlTab)
    } else {
      setActiveTab('overview')
    }
    setMounted(true)
  }, [searchParams])

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'stats', label: 'Stats' },
    { id: 'events', label: 'Events' },
    { id: 'Teams', label: 'Teams' },
    { id: 'Friends', label: 'Friends' },
    { id: 'Followers', label: 'Followers' },
    { id: 'Ranking', label: 'Ranking' },
  ]

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    const params = new URLSearchParams(window.location.search)
    params.set('tab', tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const onShareClick = () => {
    setShowShareModal(true)
  }

  return (
    <div className="min-h-screen bg-defendrBg font-poppins text-white overflow-x-hidden">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white font-poppins text-lg">
            <img src="/Loader.gif" alt="Loading" />
          </div>
        </div>
      )}

      {!loading && user && (
        <>
          <ProfileBannerUser
            currentUserId={currentUserId}
            isUserProfile={isUserProfile}
            membership={membership}
            user={user}
            onBackClick={() => console.log('Back clicked')}
            onGiftClick={() => console.log('Gift clicked')}
            onShareClick={onShareClick}
          />
          <ShareModal
            isOpen={showShareModal}
            shareTitle="Check out this user profile!"
            shareUrl={`${window.location.origin}/user/${user._id}/profile`}
            onClose={() => setShowShareModal(false)}
          />
        </>
      )}

      <div className="px-4 lg:px-20">
        <div className="mb-6 mt-7">
          <TooltipProvider delayDuration={100}>
            <NavBar activeId={activeTab} items={navItems} onItemClick={handleTabClick} />
          </TooltipProvider>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-start">
          {activeTab === 'overview' && user && (
            <div className="w-full xl:w-[500px] shrink-0">
              <UserInfoCard
                isUserProfile={isUserProfile}
                membership={membership}
                teams={teams}
                user={user}
                userId={userId}
              />
            </div>
          )}

          <div className="flex-1 min-w-0 w-full">
            <div className="bg-transparent rounded-lg">
              {activeTab === 'overview' && user && (
                <OverviewTab
                  connectedAcc={connectedAccounts}
                  games={gameData}
                  isUserProfile={isUserProfile}
                  ownedTournaments={organizerTournaments}
                  tournaments={tournaments}
                />
              )}

              {activeTab === 'stats' &&
                (tournaments.length === 0 && organizerTournaments.length === 0 ? (
                  <EmptyStatTab isUserProfile={isUserProfile} />
                ) : (
                  <StatsTab stats={stats} />
                ))}
              {activeTab === 'events' && (
                <EventsTab organizerTournaments={organizerTournaments} tournaments={tournaments} />
              )}
              {activeTab === 'Teams' && user && (
                <TeamsTab
                  ownedTeams={ownedTeams}
                  participatedTeams={participatedTeams}
                  user={user}
                />
              )}
              {activeTab === 'Friends' && user && <Friends friends={friends} user={user} />}
              {activeTab === 'Followers' && (
                <FollowersTab followers={followers} following={following} />
              )}
              {activeTab === 'Ranking' && <Leaderboard />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
