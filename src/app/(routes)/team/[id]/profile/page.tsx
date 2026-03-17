'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { getSession } from 'next-auth/react'

import ProfileBanner from '@/components/team/helpers/profileBanner'
import TeamInfoCard from '@/components/team/helpers/teamInfoCard'
import GameSelector from '@/components/team/helpers/gameSelector'
import { NavBar } from '@/components/team/helpers/navbar'
import OverviewTab from '@/components/team/team-profile-tabs/overview'
import MembersTab from '@/components/team/team-profile-tabs/membersTab'
import TournamentsTab from '@/components/team/team-profile-tabs/tournaments'
import AchievementsTab from '@/components/team/team-profile-tabs/achievements'
import StatisticsTab from '@/components/team/team-profile-tabs/statistics'
import AddMemberModal from '@/components/team/popups/addMemberModal'
import {
  getTeamById,
  getTeamsByUserId,
  inviteToTeam,
  contactTeam,
  joinTeam,
} from '@/services/teamService'
import { getGameById } from '@/services/gameService'
import { getUserById } from '@/services/userService'
import MessagePopup from '@/components/team/popups/messagePopup'
import { getErrorMessage } from '@/utils/errorHandler'
import ShareModal from '@/components/team/popups/shareButtons'
import { Team } from '@/types/teamType'
import { isTeamOwner } from '@/utils/teamUtils'

interface NewMember {
  name: string
  userId: string
  role: string
  message: string
}

export default function ProfileTeamsPage() {
  const params = useParams()
  const teamId = params?.id as string | undefined
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false)
  const [newMember, setNewMember] = useState<NewMember>({
    name: '',
    userId: '',
    role: 'Member',
    message: '',
  })
  const [authenticatedUserId, setAuthenticatedUserIdState] = useState('')
  const [isUserTeam, setIsUserTeam] = useState<boolean | null>(null)
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false)
  const [isUserTeamOwner, setIsUserTeamOwner] = useState<boolean>(false)
  const [messagePopup, setMessagePopup] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const shareTitle = `Check out this team profile!`

  // Redirect immediately if the route param is missing or explicitly "undefined"
  useEffect(() => {
    if (!teamId || teamId === 'undefined') {
      router.replace('/team')
    }
  }, [teamId, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId || teamId === 'undefined') {
        return
      }

      setLoading(true)
      try {
        if (typeof window !== 'undefined') {
          setShareUrl(`${window.location.origin}/team/${teamId}/profile`)
        }
        const fetchedTeamRaw = await getTeamById(teamId)
        // getTeamById already returns shape compatible with Team (_id present). If not, guard.
        if (!fetchedTeamRaw || !fetchedTeamRaw._id) {
          router.replace('/team')
          return
        }

        // Fetch additional data to populate the team
        let gameData = null
        if (fetchedTeamRaw.game) {
          try {
            const gameId =
              typeof fetchedTeamRaw.game === 'string'
                ? fetchedTeamRaw.game
                : (fetchedTeamRaw.game as unknown as { _id?: string })?._id
            if (gameId) {
              gameData = await getGameById(gameId)
            }
          } catch {
            // ignore
          }
        }

        // Populate user data for team members. Backend may return either
        // string IDs or populated user objects. Collect all user IDs that
        // need fetching, fetch them in parallel, then map results back to
        // preserve role/_id and other fields.
        const populatedTeamOwner: Record<string, unknown>[] = []
        const populatedTeamRoster: Record<string, unknown>[] = []

        // Helper to collect ids from a mixed array
        const collectIds = (arr: unknown[] | undefined): string[] => {
          if (!arr || !Array.isArray(arr)) {
            return []
          }
          const ids: string[] = []
          for (const it of arr) {
            if (typeof it === 'string') {
              ids.push(it)
            } else if (it && typeof (it as Record<string, unknown>).user === 'string') {
              ids.push((it as Record<string, string>)['user'])
            }
          }
          return ids
        }

        const ownerIds = collectIds(fetchedTeamRaw.teamowner)
        const rosterIds = collectIds(fetchedTeamRaw.teamroster)
        const idsToFetch = Array.from(new Set([...ownerIds, ...rosterIds]))

        // Fetch all missing users in parallel
        const fetchedUsersArray = await Promise.all(
          idsToFetch.map(id => getUserById(id).catch(() => null)),
        )
        const usersById: Record<string, Record<string, unknown> | null> = {}
        idsToFetch.forEach((id, idx) => {
          const userObj = fetchedUsersArray[idx] as Record<string, unknown> | null
          if (userObj) {
            const key =
              (userObj as Record<string, unknown>)['_id'] ||
              (userObj as Record<string, unknown>)['id']
            if (key) {
              usersById[String(key)] = userObj
            } else {
              usersById[id] = userObj
            }
          } else {
            usersById[id] = null
          }
        })

        // Map owners
        if (fetchedTeamRaw.teamowner && Array.isArray(fetchedTeamRaw.teamowner)) {
          for (const owner of fetchedTeamRaw.teamowner) {
            if (typeof owner === 'string') {
              const user = usersById[owner] || null
              populatedTeamOwner.push({ user, role: 'Member' })
            } else if (!owner.user) {
              populatedTeamOwner.push(owner)
            } else if (typeof owner.user === 'string') {
              const user = usersById[owner.user] || null
              populatedTeamOwner.push({ ...owner, user })
            } else {
              // already populated
              populatedTeamOwner.push(owner)
            }
          }
        }

        // Map roster
        if (fetchedTeamRaw.teamroster && Array.isArray(fetchedTeamRaw.teamroster)) {
          for (const member of fetchedTeamRaw.teamroster) {
            if (typeof member === 'string') {
              const user = usersById[member] || null
              populatedTeamRoster.push({ user, role: 'Member' })
            } else if (!member.user) {
              populatedTeamRoster.push(member)
            } else if (typeof member.user === 'string') {
              const user = usersById[member.user] || null
              populatedTeamRoster.push({ ...member, user })
            } else {
              populatedTeamRoster.push(member)
            }
          }
        }

        // Narrow to Team by picking expected fields; tolerate extra props.
        const fetchedTeamObj = {
          ...fetchedTeamRaw,
          _id: fetchedTeamRaw._id,
          name: fetchedTeamRaw.name || 'Unnamed Team',
          description: fetchedTeamRaw.description || '',
          game: gameData || fetchedTeamRaw.game,
          datecreation:
            fetchedTeamRaw.datecreation || fetchedTeamRaw.createdAt || new Date().toISOString(),
          teamowner: populatedTeamOwner,
          teamroster: populatedTeamRoster,
        }
        setTeam(fetchedTeamObj as unknown as Team)

        // Check if user is part of the team and if they are the owner
        const session = await getSession()
        const userId = session?.user?._id as string | undefined
        // ensure we always keep a string in state (empty when not authenticated)
        setAuthenticatedUserIdState(userId || '')
        if (userId) {
          const userTeams = (await getTeamsByUserId(userId)) as Array<{ _id: string }>
          const teamIds = userTeams.map(t => t._id)
          setIsUserTeam(teamIds.includes(teamId))

          // Check if user is the team owner using utility function
          setIsUserTeamOwner(isTeamOwner(fetchedTeamObj as any, userId))
          // Check if user already requested to join this team
          try {
            const pending = Array.isArray((fetchedTeamObj as any)?.requests)
              ? (fetchedTeamObj as any).requests.some((r: any) => {
                  const uid = typeof r.user === 'string' ? r.user : r.user?._id
                  return uid === userId
                })
              : false
            setIsRequestPending(pending)
          } catch {
            setIsRequestPending(false)
          }
        } else {
          setIsUserTeam(false)
          setIsUserTeamOwner(false)
          setIsRequestPending(false)
        }
      } catch {
        // router.replace('/team')
        return
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [teamId, router])

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'statistics', label: 'Statistics' },
  ]

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    const params = new URLSearchParams(window.location.search)
    params.set('tab', tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const handleAddMember = () => {
    setShowAddMemberModal(true)
  }

  const handleGameChange = async (gameName: string) => {
    if (!team) {
      return
    }
    setTeam({ ...team, game: gameName })
  }

  const handleRequestJoin = async () => {
    try {
      if (!teamId) {
        return
      }
      await joinTeam(teamId)
      toast.success('Request to join team sent successfully')
      setIsRequestPending(true)
    } catch (error) {
      const e = error as any
      const msg =
        e?.response?.data?.message || getErrorMessage(error, 'Failed to send join request')
      toast.error(msg)
      if (typeof msg === 'string' && msg.toLowerCase().includes('already requested')) {
        setIsRequestPending(true)
      }
    }
  }

  const handleSendMessage = async () => {
    try {
      if (!teamId) {
        return
      }
      await contactTeam(teamId, message)
      toast.success('Message sent successfully')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to send message. Please try again later.'))
    }
  }

  const saveNewMember = async () => {
    if (newMember.name.trim() === '' || newMember.userId === '') {
      toast.warning('Please select a user to invite')
      return
    }
    try {
      if (!teamId) {
        return
      }
      await inviteToTeam(teamId, newMember.userId, newMember.message)
      setNewMember({ name: '', userId: '', role: 'Member', message: '' })
      setShowAddMemberModal(false)
      toast.success('Invitation sent successfully')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to send invitation. Please try again.'))
    }
  }

  const handleViewProfile = (memberId: string) => {
    router.push(`/user/${memberId}/profile`)
  }
  const shareProfile = () => {
    setShowShareModal(true)
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white overflow-x-hidden">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white font-poppins text-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Loading" src="/Loader.gif" />
          </div>
        </div>
      )}

      {team && (
        <>
          <ProfileBanner
            authenticatedUserId={authenticatedUserId}
            isUserTeam={isUserTeam || false}
            isUserTeamOwner={isUserTeamOwner}
            isRequestPending={isRequestPending}
            team={team}
            onBackClick={() => {
              // If user is not authenticated, send them back to team listing instead of
              // trying to navigate to `/user/undefined/profile`.
              if (authenticatedUserId) {
                router.push(`/user/${authenticatedUserId}/profile`)
              } else {
                router.push('/team')
              }
            }}
            onGiftClick={() => {}}
            onRequestJoinClick={handleRequestJoin}
            onShareClick={shareProfile}
            onAddMemberClick={handleAddMember}
          />
          <ShareModal
            isOpen={showShareModal}
            shareTitle={shareTitle}
            shareUrl={shareUrl}
            onClose={() => setShowShareModal(false)}
          />
        </>
      )}

      <div className="px-4 lg:px-20 ">
        <div className="block sm:hidden mb-6 mt-7">
          <NavBar activeId={activeTab} items={navItems} onItemClick={handleTabClick} />
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="sm:w-[230px] md:w-[270px] xl:w-[400px] xl:flex-shrink-0 mt-7">
            <MessagePopup
              message={message}
              opened={messagePopup}
              setMessage={setMessage}
              setOpened={setMessagePopup}
              onSend={handleSendMessage}
            />
            {team && <GameSelector selectedGame={team.game} onGameChange={handleGameChange} />}
            {team && (
              <TeamInfoCard
                currentTab={activeTab}
                isUserTeam={isUserTeam || false}
                team={team}
                onContactTeam={() => setMessagePopup(true)}
                onShareProfile={shareProfile}
              />
            )}
          </div>

          <div className="flex-1 min-w-0 xl:ml-5">
            <div className="hidden sm:flex mb-6">
              <NavBar activeId={activeTab} items={navItems} onItemClick={handleTabClick} />
            </div>

            <div className="bg-transparent rounded-lg">
              {activeTab === 'overview' && team && (
                <OverviewTab
                  team={team}
                  teamDescription={team.description}
                  teamId={team._id}
                  onViewAllMembers={() => setActiveTab('members')}
                  onViewAllTournaments={() => setActiveTab('tournaments')}
                  onAddMember={handleAddMember}
                  isUserTeam={isUserTeamOwner}
                />
              )}

              {activeTab === 'members' && team && (
                <MembersTab
                  isUserTeam={isUserTeam || false}
                  isUserTeamOwner={isUserTeamOwner}
                  team={team}
                  teamId={team._id}
                  onAddMember={handleAddMember}
                  onViewProfile={handleViewProfile}
                />
              )}
              {activeTab === 'tournaments' && team && (
                <TournamentsTab team={team} teamId={team._id} />
              )}
              {activeTab === 'achievements' && team && (
                <AchievementsTab team={team} teamId={team._id} />
              )}
              {activeTab === 'statistics' && team && <StatisticsTab teamId={team._id} />}
            </div>
          </div>
        </div>
      </div>

      {showAddMemberModal && (
        <AddMemberModal
          newMember={newMember}
          setNewMember={setNewMember}
          onCancel={() => setShowAddMemberModal(false)}
          onSave={saveNewMember}
        />
      )}
    </div>
  )
}
