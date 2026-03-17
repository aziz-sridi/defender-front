'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import TeamModal from '@/components/team/TeamModal'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { Tournament } from '@/types/tournamentType'
import { formatDate } from '@/utils/FormatDate'
import Twitter from '@/components/ui/Icons/Twitter'
import Instagram from '@/components/ui/Icons/Instagram'
import Facebook from '@/components/ui/Icons/FacebookIcon'
import Discord from '@/components/ui/Icons/Discord'
import DiscordAlt from '@/components/ui/Icons/DiscordAlt'
import LocationMark from '@/components/ui/Icons/LocationMark'
import CalendarEmpty from '@/components/ui/Icons/CalendarEmpty'
import Card from '@/components/ui/dataCard'
import { followOrganization, unfollowOrganization } from '@/services/organizationService'
import { getTeamById } from '@/services/teamService'
import { Team } from '@/types/teamType'
import { teamImageSanitizer, imageUrlSanitizer, getGameImageUrl } from '@/utils/imageUrlSanitizer'

interface TournamentOverviewProps {
  tournament: Tournament
}

export default function TournamentOverview({ tournament }: TournamentOverviewProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [copyAnimation, setCopyAnimation] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [mainRosterMembers, setMainRosterMembers] = useState<any[]>([])
  const [substituteRosterMembers, setSubstituteRosterMembers] = useState<any[]>([])
  const [loadingTeam, setLoadingTeam] = useState(false)

  // Check if user is already following the organization
  const checkFollowStatus = () => {
    if (!session?.user || !tournament.createdBy?._id) return false

    // Check if the organization ID is in the user's following array
    const userFollowing = session.user.following?.includes(tournament.createdBy._id)

    // Also check if the user ID is in the organization's followers array as fallback
    const orgFollowers = tournament.createdBy?.followers?.includes(session.user._id)

    return userFollowing || orgFollowers || false
  }

  // Set initial follow status
  React.useEffect(() => {
    const followStatus = checkFollowStatus()
    console.log('Follow status check:', {
      userId: session?.user?._id,
      orgId: tournament.createdBy?._id,
      userFollowing: session?.user?.following,
      orgFollowers: tournament.createdBy?.followers,
      followStatus,
    })
    setIsFollowing(followStatus)
  }, [session, tournament.createdBy?._id])

  const handleFollow = async () => {
    if (!tournament.createdBy?._id) return

    setIsLoading(true)
    try {
      if (isFollowing) {
        await unfollowOrganization(tournament.createdBy._id)
        setIsFollowing(false)
      } else {
        await followOrganization(tournament.createdBy._id)
        setIsFollowing(true)
      }
      // Refresh the page to update session data
      router.refresh()
    } catch (error: any) {
      console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} organization:`, error)

      // If user already follows, update the state to reflect this
      if (error?.response?.data?.message?.includes('already follows')) {
        setIsFollowing(true)
      }
      // If user doesn't follow, update the state to reflect this
      else if (error?.response?.data?.message?.includes('not following')) {
        setIsFollowing(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle view all participants - redirect to participants tab
  const handleViewParticipants = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('tab', 'participant')
    window.location.href = currentUrl.toString()
  }

  // Handle invite players - show modal
  const handleInvitePlayers = () => {
    setShowInviteModal(true)
  }

  // Handle team click - show team details modal
  const handleTeamClick = async (participant: any) => {
    if (!participant.team?._id) return

    setLoadingTeam(true)
    try {
      const teamData = await getTeamById(participant.team._id)
      setSelectedTeam(teamData)

      // Extract only participant team members grouped as main roster vs subs
      const allMembers: any[] = []
      const mainIds = [...(participant.teamMembers || [])]
      const subIds = [...(participant.substituteMembers || [])]

      // Add team owner if part of participating lists
      if (teamData.teamowner && teamData.teamowner.length > 0) {
        teamData.teamowner.forEach((owner: any) => {
          const ownerId = typeof owner.user === 'string' ? owner.user : owner.user?._id
          if (mainIds.includes(ownerId) || subIds.includes(ownerId)) {
            allMembers.push({
              ...owner.user,
              role: 'Owner',
              joinedAt: teamData.datecreation,
            })
          }
        })
      }

      // Add team roster members who are participating
      if (teamData.teamroster && teamData.teamroster.length > 0) {
        teamData.teamroster.forEach((member: any) => {
          const memberId = typeof member.user === 'string' ? member.user : member.user?._id
          if (mainIds.includes(memberId) || subIds.includes(memberId)) {
            allMembers.push({
              ...member.user,
              role: 'Member',
              joinedAt: member.joinedAt,
            })
          }
        })
      }

      // Split into main roster and substitutes using ids lists
      setMainRosterMembers(allMembers.filter(m => mainIds.includes(m._id)))
      setSubstituteRosterMembers(allMembers.filter(m => subIds.includes(m._id)))
      setTeamMembers(allMembers)
      setShowTeamModal(true)
    } catch (error) {
      console.error('Failed to fetch team details:', error)
    } finally {
      setLoadingTeam(false)
    }
  }

  // Generate tournament share link
  const getTournamentShareLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/tournament/${tournament._id}`
    }
    return ''
  }

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getTournamentShareLink())

      // Trigger copy animation
      setCopyAnimation(true)

      // Reset animation after 2 seconds
      setTimeout(() => {
        setCopyAnimation(false)
      }, 2000)

      console.log('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  // Helper function to validate and fix image URLs
  const getValidImageSrc = (imageSrc: string | undefined): string | null => {
    if (!imageSrc) return null
    return imageUrlSanitizer(imageSrc, 'user')
  }

  // Helper function to get game image based on game name
  const getGameImage = (gameName: string | undefined): string => {
    if (!gameName) return '/assets/images/default-team-icon.jpg'

    const gameNameLower = gameName.toLowerCase().trim()

    // Map common game names to their corresponding images
    const gameImageMap: { [key: string]: string } = {
      // League of Legends variations
      'league of legends': '/assets/newHome/games/1.png',
      lol: '/assets/newHome/games/1.png',
      league: '/assets/newHome/games/1.png',

      // Valorant variations
      valorant: '/assets/newHome/games/2.png',
      val: '/assets/newHome/games/2.png',

      // Fortnite variations
      fortnite: '/assets/newHome/games/3.png',
      'fortnite battle royale': '/assets/newHome/games/3.png',

      // Counter-Strike variations
      'counter-strike': '/assets/newHome/games/4.png',
      'counter strike': '/assets/newHome/games/4.png',
      'cs:go': '/assets/newHome/games/4.png',
      csgo: '/assets/newHome/games/4.png',
      cs: '/assets/newHome/games/4.png',

      // Dota 2 variations
      'dota 2': '/assets/newHome/games/5.png',
      dota: '/assets/newHome/games/5.png',

      // Additional popular games
      'apex legends': '/assets/newHome/games/2.png',
      apex: '/assets/newHome/games/2.png',
      overwatch: '/assets/newHome/games/3.png',
      'overwatch 2': '/assets/newHome/games/3.png',
      'rocket league': '/assets/newHome/games/4.png',
      fifa: '/assets/newHome/games/5.png',
      'fifa 24': '/assets/newHome/games/5.png',
      'call of duty': '/assets/newHome/games/1.png',
      cod: '/assets/newHome/games/1.png',
      pubg: '/assets/newHome/games/2.png',
      "playerunknown's battlegrounds": '/assets/newHome/games/2.png',

      // Mobile Legends: Bang Bang
      'mobile legends: bang bang': '/mobileLegend.png',
      'mobile legends': '/mobileLegend.png',
      mlbb: '/mobileLegend.png',
      'mobile legends bang bang': '/mobileLegend.png',
      'mobile legend': '/mobileLegend.png',

      // Mortal Kombat 11
      'mortal kombat 11': '/assets/images/game.jpg',
      'mortal kombat': '/assets/images/game.jpg',
      mk11: '/assets/images/game.jpg',

      // EA Sports FC series (placeholder soccer artwork)
      'ea sports fc 26': '/assets/images/game.jpg',
      'ea fc 26': '/assets/images/game.jpg',
      'fc 26': '/assets/images/game.jpg',
      'ea sports fc': '/assets/images/game.jpg',
      'fifa 26': '/assets/images/game.jpg',
      // FC 25 variants
      'ea sports fc 25': '/assets/images/game.jpg',
      'ea fc 25': '/assets/images/game.jpg',
      'fc 25': '/assets/images/game.jpg',
      'fifa 25': '/assets/images/game.jpg',

      // 2XKO (Riot fighting)
      '2xko': '/assets/images/game.jpg',

      // Tekken
      tekken: '/assets/images/game.jpg',
      'tekken 8': '/assets/images/game.jpg',
      'tekken 7': '/assets/images/game.jpg',

      // eFootball
      efootball: '/assets/images/game.jpg',
      'efootball 2024': '/assets/images/game.jpg',
      'efootball 2025': '/assets/images/game.jpg',
    }

    // Check for exact matches first
    if (gameImageMap[gameNameLower]) {
      return gameImageMap[gameNameLower]
    }

    // Check for partial matches
    for (const [key, imagePath] of Object.entries(gameImageMap)) {
      if (gameNameLower.includes(key) || key.includes(gameNameLower)) {
        return imagePath
      }
    }

    // Default fallback
    return '/assets/images/default-team-icon.jpg'
  }

  // Prefer IGDB cover like the Games Included section; fallback to provided coverImage then local map
  const getOverviewGameImage = (game: any): string => {
    const igdbUrl = getGameImageUrl(game, '')
    if (igdbUrl) {
      return igdbUrl
    }
    const cover = imageUrlSanitizer(game?.coverImage || '', 'general', '')
    if (cover) {
      return cover
    }
    return getGameImage(game?.name)
  }
  // Format dates for display
  const startDate = tournament.startDate ? formatDate(tournament.startDate) : 'TBD'

  // Create schedule details from tournament rounds if available
  const scheduleDetails =
    (tournament as any).rounds?.map((round: any) => ({
      type: round.name || `ROUND ${round.roundNumber}`,
      label: round.format || 'BO1',
      date: round.startDate ? formatDate(round.startDate) : 'TBD',
    })) || []

  // Define game details to display
  const gameDetails = [
    { label: 'Game', value: tournament.game?.name || 'Not specified' },
    { label: 'Game Mode', value: tournament.gameSettings?.format || tournament.gameMode || 'Team' },
    { label: 'Region', value: tournament.gameSettings?.region || 'MENA' },
    {
      label: 'Tournament Status',
      value: tournament.publishing ? 'Published' : 'Drafted Tournament',
    },
  ]

  return (
    <div className="w-full px-4" id={'overview'}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Main content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Game Information Card */}
          <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/20">
            <div className="p-6">
              <div className="flex items-center gap-6">
                {/* Game Icon */}
                <div className="flex-shrink-0">
                  <Image
                    alt={tournament.game?.name || 'game'}
                    height={60}
                    src={getOverviewGameImage(tournament.game)}
                    width={80}
                    className="rounded-lg object-cover"
                  />
                </div>

                {/* Game Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                  {gameDetails.map(({ label, value }, index) => (
                    <div key={label} className="text-center md:text-left">
                      <Typo
                        as="h6"
                        color="ghostGrey"
                        fontFamily="poppins"
                        fontVariant="p5"
                        className="uppercase tracking-wide"
                      >
                        {label}
                      </Typo>
                      <Typo
                        as="p"
                        className="mt-2"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="p3"
                      >
                        {value}
                      </Typo>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* About Tournament Card */}
          <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/20">
            <Card.Header className="border-b border-gray-700/20">
              <Typo
                as="h3"
                color="white"
                fontFamily="poppins"
                fontVariant="h3"
                className="text-defendrRed"
              >
                About {tournament.name}
              </Typo>
            </Card.Header>
            <Card.Body className="p-6">
              <Typo as="p" fontVariant="p3" color="white" className="leading-relaxed">
                {tournament.description || 'No description available.'}
              </Typo>

              {/* Additional Info */}
              <div className="mt-6 space-y-4">
                {/* Location or Online Status */}
                {(tournament as any).location ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    {(tournament as any).location.toLowerCase().includes('discord') ? (
                      <div className="bg-blue-500/5 border border-blue-400/20 rounded-lg p-4 hover:bg-blue-500/10 transition-all duration-300">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <DiscordAlt className="text-blue-400" height={24} width={24} />
                            <div>
                              <Typo as="p" color="white" fontVariant="p4" className="font-medium">
                                Discord Server
                              </Typo>
                              <Typo as="p" color="defendrGrey" fontVariant="p6" className="text-xs">
                                Required Discord server for participant(s)
                              </Typo>
                            </div>
                          </div>
                          <a
                            href={(tournament as any).location}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                          >
                            <span>Join</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <>
                        <LocationMark className="text-red-400" height={24} width={24} />
                        <Typo as="p" color="white" fontVariant="p4">
                          {(tournament as any).location}
                        </Typo>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <DiscordAlt className="text-blue-400" height={24} width={24} />
                    <div className="flex flex-col">
                      <Typo as="p" color="white" fontVariant="p4" className="font-semibold">
                        ONLINE
                      </Typo>
                      {(tournament as any).communicationSettings?.discordLink && (
                        <a
                          href={(tournament as any).communicationSettings.discordLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          Join Discord Server
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Game and Round Info Card */}
          <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/20">
            <Card.Header className="border-b border-gray-700/20">
              <Typo
                as="h3"
                color="white"
                fontFamily="poppins"
                fontVariant="h3"
                className="text-defendrRed"
              >
                Game and Round Info
              </Typo>
            </Card.Header>
            <Card.Body className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-400 font-medium">Game Mode:</span>
                    <span className="text-white font-semibold">
                      {tournament.gameSettings?.format || tournament.gameMode || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-400 font-medium">Slots:</span>
                    <span className="text-white font-semibold">
                      {(tournament as any).maxTeams || (tournament as any).maxParticipants || 16}{' '}
                      {tournament.gameMode === 'Team' ? 'Teams' : 'Players'}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-400 font-medium">Format:</span>
                    <span className="text-white font-semibold">
                      {(tournament as any).bracketType || 'Single Elimination'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-400 font-medium">Rounds:</span>
                    <span className="text-white font-semibold">
                      {(tournament as any).rounds?.length || 1} Total
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Right column - Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Organizer Card */}
          <Card className="bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg border border-white/10">
            <Card.Body className="p-5 sm:p-6">
              <div className="text-center space-y-4 sm:space-y-5">
                <div>
                  <Typo
                    as="p"
                    color="ghostGrey"
                    fontFamily="poppins"
                    fontVariant="p5"
                    className="uppercase tracking-wide text-xs sm:text-sm"
                  >
                    Organized by
                  </Typo>
                  <Typo
                    as="h4"
                    className="mt-2 sm:mt-3 text-white font-bold"
                    fontFamily="poppins"
                    fontVariant="h4"
                  >
                    {tournament.createdBy?.name || 'ASUS'}
                  </Typo>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                  <Button
                    aria-label={isFollowing ? 'Unfollow organization' : 'Follow organization'}
                    className="w-full sm:w-auto"
                    label={isFollowing ? 'Unfollow' : 'Follow'}
                    size="s"
                    variant={isFollowing ? 'outlined-grey' : 'outlined-red'}
                    onClick={handleFollow}
                    disabled={isLoading}
                  />
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/80 text-xs sm:text-sm mb-1 sm:mb-0">
                    {tournament.createdBy?.nbFollowers || 200} followers
                  </span>
                </div>

                {/* View Organization Profile */}
                {tournament.createdBy?._id && (
                  <Button
                    aria-label="View organization profile"
                    className="w-full sm:w-auto max-w-xs sm:max-w-none mx-auto mt-2 sm:mt-3"
                    href={`/organization/${tournament.createdBy._id}/Profile`}
                    label="View Organization Profile"
                    size="s"
                    variant="contained-ghostRed"
                  />
                )}

                {/* Socials */}
                {tournament.createdBy?.socialMediaLinks && (
                  <div className="flex justify-center gap-5 sm:gap-6 pt-3 sm:pt-4">
                    {Object.entries(tournament.createdBy.socialMediaLinks).map(
                      ([platform, url]) => {
                        if (!url) return null

                        const iconMapping: Record<string, React.ElementType> = {
                          twitter: Twitter,
                          instagram: Instagram,
                          facebook: Facebook,
                          discord: Discord,
                        }

                        const Icon = iconMapping[platform]
                        if (!Icon) return null

                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-90 cursor-pointer transition-colors text-gray-400 hover:text-white"
                          >
                            <Icon height="22" width="22" />
                          </a>
                        )
                      },
                    )}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Schedule Card - New Format */}
          <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/20">
            <Card.Header className="border-b border-gray-700/20">
              <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4">
                TOURNAMENT TIMELINE
              </Typo>
            </Card.Header>
            <Card.Body className="p-4">
              {/* Timeline with vertical line */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                {/* Timeline items */}
                <div className="space-y-4">
                  {/* Registration */}
                  <div className="relative flex items-start gap-3">
                    <div className="relative z-10 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">1</span>
                    </div>
                    <div className="flex-1 pb-1">
                      <Typo
                        as="h4"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="h5"
                        className="font-semibold mb-2"
                      >
                        Registration Opens
                      </Typo>
                      <Typo
                        as="p"
                        color="ghostGrey"
                        fontFamily="poppins"
                        fontVariant="p4"
                        className="text-sm mb-1"
                      >
                        Players can register and form teams
                      </Typo>
                      <Typo
                        as="p"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="p4"
                        className="text-sm font-semibold"
                      >
                        Ends:{' '}
                        {new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }).format(
                          new Date(
                            (tournament as any).registrationEndDate ||
                              tournament.structureProcess?.registrationEndDate ||
                              tournament.startDate,
                          ),
                        )}
                      </Typo>
                    </div>
                  </div>

                  {/* Tournament Start */}
                  <div className="relative flex items-start gap-3">
                    <div className="relative z-10 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">2</span>
                    </div>
                    <div className="flex-1 pb-1">
                      <Typo
                        as="h4"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="h5"
                        className="font-semibold mb-2"
                      >
                        Tournament Begins
                      </Typo>
                      <Typo
                        as="p"
                        color="ghostGrey"
                        fontFamily="poppins"
                        fontVariant="p4"
                        className="text-sm mb-1"
                      >
                        First round matches start
                      </Typo>
                      <Typo
                        as="p"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="p4"
                        className="text-sm font-semibold"
                      >
                        Starts: {startDate}
                      </Typo>
                    </div>
                  </div>

                  {/* Elimination */}
                  <div className="relative flex items-start gap-3">
                    <div className="relative z-10 w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">3</span>
                    </div>
                    <div className="flex-1 pb-1">
                      <Typo
                        as="h4"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="h5"
                        className="font-semibold mb-2"
                      >
                        Elimination Rounds
                      </Typo>
                      <Typo
                        as="p"
                        color="ghostGrey"
                        fontFamily="poppins"
                        fontVariant="p4"
                        className="text-sm mb-1"
                      >
                        Single elimination bracket
                      </Typo>
                      <Typo
                        as="p"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="p4"
                        className="text-sm font-semibold"
                      >
                        {(tournament as any).rounds?.length || 4} rounds total
                      </Typo>
                    </div>
                  </div>

                  {/* Finals */}
                  <div className="relative flex items-start gap-3">
                    <div className="relative z-10 w-6 h-6 bg-defendrRed rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">4</span>
                    </div>
                    <div className="flex-1">
                      <Typo
                        as="h4"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="h5"
                        className="font-semibold mb-2"
                      >
                        Grand Finals
                      </Typo>
                      <Typo
                        as="p"
                        color="ghostGrey"
                        fontFamily="poppins"
                        fontVariant="p4"
                        className="text-sm mb-1"
                      >
                        Final match determines the champion
                      </Typo>
                      <Typo
                        as="p"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="p4"
                        className="text-sm font-semibold"
                      >
                        Winner takes all prizes
                      </Typo>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Info Footer */}
              <div className="mt-4 pt-3 border-t border-gray-700/20">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <Typo
                      as="p"
                      color="ghostGrey"
                      fontFamily="poppins"
                      fontVariant="p5"
                      className="text-xs uppercase tracking-wide"
                    >
                      Format
                    </Typo>
                    <Typo
                      as="p"
                      color="white"
                      fontFamily="poppins"
                      fontVariant="p4"
                      className="text-sm font-semibold"
                    >
                      {(tournament as any).bracketType || 'Single Elimination'}
                    </Typo>
                  </div>
                  <div>
                    <Typo
                      as="p"
                      color="ghostGrey"
                      fontFamily="poppins"
                      fontVariant="p5"
                      className="text-xs uppercase tracking-wide"
                    >
                      Game Mode
                    </Typo>
                    <Typo
                      as="p"
                      color="white"
                      fontFamily="poppins"
                      fontVariant="p4"
                      className="text-sm font-semibold"
                    >
                      {tournament.gameSettings?.format || tournament.gameMode || 'Team'}
                    </Typo>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Participants Card */}
          <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/20">
            <Card.Header className="border-b border-gray-600/20 flex justify-between items-center">
              <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4">
                PARTICIPANTS
              </Typo>
              <button
                className="text-defendrRed hover:text-defendrHoverRed font-medium text-sm transition-colors"
                onClick={handleViewParticipants}
              >
                SEE ALL
              </button>
            </Card.Header>
            <Card.Body className="p-6">
              <div className="text-center mb-6">
                <Typo as="p" color="ghostGrey" fontVariant="p4">
                  {tournament.participants?.length || 0}{' '}
                  {tournament.gameMode === 'Team' ? 'teams' : 'players'} joined
                </Typo>
              </div>

              {/* Participant Avatars Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {tournament.participants?.slice(0, 8).map((participant, i) => {
                  // For team tournaments, show team info; for solo tournaments, show player info
                  const isTeamTournament = tournament.gameMode === 'Team'
                  const displayName = isTeamTournament
                    ? participant.team?.name || `Team ${i + 1}`
                    : participant.user?.nickname || participant.user?.fullname || `Player ${i + 1}`

                  const validImageSrc = isTeamTournament
                    ? teamImageSanitizer(
                        participant.team?.profileImage || participant.team?.coverImage || '',
                      )
                    : getValidImageSrc(participant.user?.profileImage || '')

                  const handleParticipantClick = () => {
                    if (isTeamTournament && participant.team?._id) {
                      handleTeamClick(participant)
                    } else if (!isTeamTournament && participant.user?._id) {
                      router.push(`/user/${participant.user._id}/profile`)
                    }
                  }

                  return (
                    <div key={participant._id} className="relative group">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br from-defendrRed via-defendrBlue to-defendrRed rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden ${
                          (isTeamTournament && participant.team?._id) ||
                          (!isTeamTournament && participant.user?._id)
                            ? 'cursor-pointer'
                            : 'cursor-default'
                        }`}
                        onClick={handleParticipantClick}
                      >
                        {validImageSrc ? (
                          <Image
                            src={validImageSrc}
                            alt={displayName}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {isTeamTournament
                              ? participant.team?.name?.charAt(0) || 'T'
                              : participant.user?.nickname?.charAt(0) ||
                                participant.user?.fullname?.charAt(0) ||
                                'P'}
                          </span>
                        )}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded-full text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {displayName}
                      </div>
                    </div>
                  )
                })}
                {tournament.participants && tournament.participants.length > 8 && (
                  <div className="relative group">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="text-gray-300 font-bold text-lg">
                        +{tournament.participants.length - 8}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded-full text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      More {tournament.gameMode === 'Team' ? 'teams' : 'players'}
                    </div>
                  </div>
                )}
                {(!tournament.participants || tournament.participants.length === 0) && (
                  <div className="col-span-4 text-center py-8">
                    <Typo as="p" color="ghostGrey" fontVariant="p4">
                      No {tournament.gameMode === 'Team' ? 'teams' : 'participants'} yet
                    </Typo>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  label={tournament.gameMode === 'Team' ? 'INVITE TEAMS' : 'INVITE PLAYERS'}
                  size="s"
                  variant="outlined-red"
                  className="w-full"
                  onClick={handleInvitePlayers}
                />
                <Button
                  label={
                    tournament.gameMode === 'Team' ? 'VIEW ALL TEAMS' : 'VIEW ALL PARTICIPANTS'
                  }
                  size="s"
                  variant="outlined-grey"
                  className="w-full"
                  onClick={handleViewParticipants}
                />
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-gray-700/20">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">
                      {tournament.participants?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Current</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">
                      {tournament.maxParticipants || 16}
                    </div>
                    <div className="text-xs text-gray-400">Max</div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Invite Players Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Invite Players</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tournament Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={getTournamentShareLink()}
                    readOnly
                    className={`flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border text-sm transition-all duration-300 ${
                      copyAnimation ? 'border-green-500 bg-green-900/20' : 'border-gray-600'
                    }`}
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      copyAnimation
                        ? 'bg-green-600 text-white scale-105'
                        : 'bg-defendrRed hover:bg-defendrHoverRed text-white'
                    }`}
                  >
                    {copyAnimation ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">
                  Share this link with {tournament.gameMode === 'Team' ? 'teams' : 'players'} to
                  invite them to join the tournament
                </p>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Details Modal (Reusable) */}
      <TeamModal
        show={showTeamModal}
        team={selectedTeam}
        teamMembers={teamMembers}
        mainRosterMembers={mainRosterMembers}
        substituteRosterMembers={substituteRosterMembers}
        onClose={() => setShowTeamModal(false)}
        onViewProfile={teamId => {
          router.push(`/team/${teamId}/profile`)
          setShowTeamModal(false)
        }}
        teamImageSanitizer={teamImageSanitizer}
        getValidImageSrc={getValidImageSrc}
      />
    </div>
  )
}
