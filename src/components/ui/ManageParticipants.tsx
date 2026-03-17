import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import * as XLSX from 'xlsx'

import { getTournamentById } from '@/services/tournamentService'
import { getTeamById } from '@/services/teamService'
import Button from '@/components/ui/Button'
import CustomToggleSwitch from '@/components/ui/CustomToggleSwitch'
import CustomCheckBox from '@/components/ui/customCheckBox'
import Typo from '@/components/ui/Typo'
import {
  getParticipantsByTournament,
  checkInParticipant,
  kickParticipant,
} from '@/services/participantService'

import { getAllTeams } from '@/services/teamService'
import { getUserById, searchUsers } from '@/services/userService'
import { updateTournament } from '@/services/tournamentService'
import profileIcon from '@/components/assets/tournament/profileIcon.svg'
import discordIcon from '@/components/assets/tournament/discord.png'
import riotIcon from '@/components/assets/tournament/riot.png'
import greenTickIcon from '@/components/assets/tournament/greentick.png'
import importantIcon from '@/components/assets/tournament/important.png'
import { User } from '@/types/userType'

interface Participant {
  id: string
  participantId?: string | null
  userId?: string | null
  username: string
  firstName?: string
  lastName?: string
  fullName?: string
  phone?: string
  facebook?: string
  profileImage?: string
  teamName?: string
  country: string
  checkIn: boolean
  freeAgent?: boolean
  verified?: boolean
  issued?: boolean
  discordId?: string
  riotId?: string
  email?: string
  expanded?: boolean
  teamMembers?: Array<{
    userId: string
    username: string
    role: string
    email?: string
    verified?: boolean
    discordId?: string
    riotId?: string
    profileImage?: string
    [key: string]: string | boolean | undefined
  }>
}

interface ManageParticipantsProps {
  participationType: 'Solo' | 'Team'
  tournamentId?: string
}

const ManageParticipants: React.FC<ManageParticipantsProps> = ({
  participationType,
  tournamentId,
}) => {
  // Modal state for kick confirmation
  const [kickModal, setKickModal] = useState<{
    open: boolean
    participantId: string | null
    type: 'Solo' | 'Team' | null
  }>({ open: false, participantId: null, type: null })
  const actualTournamentId =
    tournamentId ||
    (typeof window !== 'undefined' ? localStorage.getItem('createdTournamentId') : null) ||
    ''
  const { data: session } = useSession()

  // Helper to check if user is admin (adjust as needed for your session object)
  // Determine admin status: check for roles array or fallback to boolean
  const isAdmin = Array.isArray(session?.user?.roles)
    ? session.user.roles.includes('admin')
    : !!(session?.user && (session.user as any).isAdmin)

  // Handler for kicking a participant (Solo or Team)
  const handleKickParticipant = async (participantId: string) => {
    if (!actualTournamentId || !session?.accessToken) return
    try {
      await kickParticipant(actualTournamentId, participantId)
      setParticipants(prev => prev.filter(p => p.id !== participantId))
      toast.success('Participant kicked successfully')
    } catch (err) {
      toast.error('Failed to kick participant')
    } finally {
      setKickModal({ open: false, participantId: null, type: null })
    }
  }

  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<Record<string, any>>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.accessToken && actualTournamentId) {
      if (participationType === 'Solo') {
        loadParticipants()
      } else {
        loadTeams()
      }
    }
  }, [session?.accessToken, actualTournamentId, participationType])

  const loadParticipants = async () => {
    if (!session?.accessToken || !actualTournamentId) {
      return
    }
    try {
      setIsLoading(true)
      const participantsData = await getParticipantsByTournament(actualTournamentId)
      if (participantsData && participantsData.length > 0) {
        const filteredParticipants = participantsData.filter(
          (participant: any) =>
            participant.participantType === participationType &&
            participant.tournament === actualTournamentId,
        )
        const uiParticipants = await Promise.all(
          filteredParticipants.map(async (participant: any, index: number) => {
            let userData = null
            let username = `Participant ${index + 1}`
            let fullName = 'Unknown User'
            let country = 'Unknown'
            let verified = false
            if (participant.user) {
              try {
                userData = await getUserById(participant.user)
                username = userData.nickname || userData.username || `Participant ${index + 1}`
                fullName = userData.fullname || userData.nickname || 'Unknown User'
                country = userData.country || 'Unknown'
                verified = userData.verifmail || false
              } catch {}
            }
            const finalCountry = userData?.country || country || 'Unknown'
            const finalEmail = userData?.email || participant.contactEmail || 'N/A'
            return {
              id: participant._id,
              participantId: participant._id,
              userId: participant.user,
              username: username,
              firstName: fullName.split(' ')[0] || 'Unknown',
              lastName: fullName.split(' ').slice(1).join(' ') || 'User',
              fullName: fullName,
              phone: userData?.phone ? String(userData.phone) : 'N/A',
              facebook: userData?.socialMediaLinks?.facebook || 'N/A',
              profileImage: userData?.profileImage || '',
              teamName: participant.team || 'No Team',
              country: finalCountry,
              checkIn: participant.checkin || false,
              freeAgent: false,
              verified: verified,
              issued: false,
              discordId: 'N/A',
              riotId: 'N/A',
              email: finalEmail,
              expanded: false,
            }
          }),
        )
        setParticipants(uiParticipants)
      } else {
        setParticipants([])
      }
    } catch {
      setParticipants([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load teams for Team participationType
  const loadTeams = async () => {
    if (!session?.accessToken || !actualTournamentId) {
      return
    }
    try {
      setIsLoading(true)
      // Get the tournament data to get the team IDs
      const tournament = await getTournamentById(actualTournamentId)
      let teamIds: string[] = []
      if (Array.isArray(tournament?.teams) && tournament.teams.length > 0) {
        teamIds = tournament.teams
      } else if (Array.isArray(tournament?.participants) && tournament.participants.length > 0) {
        // Extract unique team IDs from participants
        const ids = tournament.participants
          .map((p: any) => p.team?._id || p.team?.id)
          .filter(Boolean)
        teamIds = Array.from(new Set(ids))
      }
      if (teamIds.length > 0) {
        // Fetch each team by ID
        const teamDataArr = await Promise.all(
          teamIds.map(async (teamId: string, index: number) => {
            try {
              const team = await getTeamById(teamId)
              return {
                id: team._id || teamId,
                participantId: team._id || teamId,
                userId: '',
                username: team.name || `Team ${index + 1}`,
                firstName: '',
                lastName: '',
                teamName: team.name || `Team ${index + 1}`,
                country: team.country || 'Unknown',
                checkIn: false, // Team type does not have checkIn property
                freeAgent: false,
                verified: false,
                issued: false,
                discordId: 'N/A',
                riotId: 'N/A',
                email: team.email || 'N/A',
                expanded: false,
              }
            } catch {
              // fallback if team fetch fails
              return {
                id: teamId,
                participantId: teamId,
                userId: '',
                username: `Team ${index + 1}`,
                firstName: '',
                lastName: '',
                teamName: `Team ${index + 1}`,
                country: 'Unknown',
                checkIn: false,
                freeAgent: false,
                verified: false,
                issued: false,
                discordId: 'N/A',
                riotId: 'N/A',
                email: 'N/A',
                expanded: false,
              }
            }
          }),
        )
        setParticipants(teamDataArr)
      } else {
        setParticipants([])
      }
    } catch {
      setParticipants([])
    } finally {
      setIsLoading(false)
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      participants.map(p => ({
        Username: p.username,
        'First Name': p.firstName,
        'Last Name': p.lastName,
        'Team Name': p.teamName,
        Country: p.country,
        'Check In': p.checkIn ? 'Yes' : 'No',
        'Free Agent': p.freeAgent ? 'Yes' : 'No',
        Verified: p.verified ? 'Yes' : 'No',
        'Discord ID': p.discordId,
        'Riot ID': p.riotId,
        Email: p.email,
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants')
    XLSX.writeFile(
      workbook,
      `tournament_participants_${new Date().toISOString().split('T')[0]}.xlsx`,
    )
  }

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        if (Array.isArray(jsonData)) {
          setParticipants(jsonData)
        } else {
          toast.error('Invalid JSON format. Expected an array of participants.')
        }
      } catch (error) {
        toast.error('Error parsing JSON file.')
      }
    }
    reader.readAsText(file)
  }

  const [globalCheckIn, setGlobalCheckIn] = useState(false)
  const [globalFreeAgent, setGlobalFreeAgent] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  const updateParticipant = (id: string, field: keyof Participant, value: unknown) => {
    setParticipants(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleCheckinToggle = async (participantId: string, newCheckinStatus: boolean) => {
    try {
      const participant = participants.find((p: any) => p.id === participantId)
      const actualParticipantId = participant?.participantId || participantId
      if (actualParticipantId && actualParticipantId !== 'null') {
        await checkInParticipant(actualParticipantId)
      }
      updateParticipant(participantId, 'checkIn', newCheckinStatus)
    } catch {
      updateParticipant(participantId, 'checkIn', !newCheckinStatus)
      toast.error('Failed to update checkin status. Please try again.')
    }
  }

  const handleSaveChanges = async () => {
    if (!session?.accessToken || !actualTournamentId) {
      return
    }
    try {
      setIsLoading(true)
      if (participationType === 'Solo') {
        const participantIds = participants.map((p: any) => p.userId || p.id)
        const formData = new FormData()
        formData.append('participants', JSON.stringify(participantIds))
        await updateTournament(actualTournamentId, formData)
      } else {
        const teamIds = participants.map((p: any) => p.id)
        const formData = new FormData()
        formData.append('teams', JSON.stringify(teamIds))
        await updateTournament(actualTournamentId, formData)
      }
      setHasChanges(false)
      toast.success(
        `${participationType === 'Solo' ? 'Participants' : 'Teams'} saved successfully!`,
      )
    } catch {
      toast.error('Failed to save changes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const searchParticipants = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }
    try {
      setIsSearching(true)
      setSearchError(null)
      const searchedUsers = await searchUsers(query)
      if (!searchedUsers || searchedUsers.length === 0) {
        setSearchError('No participants found with that nickname')
        setSearchResults([])
        return
      }
      const participantResults = searchedUsers.map((user: any) => ({
        _id: user._id || user.id,
        userId: user._id || user.id,
        fullname: user.fullname || 'Unknown',
        username: user.username || user.nickname || 'Unknown',
        nickname: user.nickname || user.username || 'Unknown',
        country: user.country || 'Unknown',
        email: user.email || 'N/A',
      }))
      setSearchResults(participantResults)
      setSearchError(null)
    } catch {
      setSearchError('No participants found with that nickname')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const searchTeams = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }
    try {
      setIsSearching(true)
      setSearchError(null)
      const allTeams = await getAllTeams()
      if (!allTeams || allTeams.length === 0) {
        setSearchError('No teams found in database')
        setSearchResults([])
        return
      }
      const filteredTeams = allTeams.filter(
        team => team.name && team.name.toLowerCase().includes(query.toLowerCase()),
      )
      if (filteredTeams.length === 0) {
        setSearchError('No teams found with that name')
        setSearchResults([])
      } else {
        const teamResults = filteredTeams.map((team: any) => ({
          _id: team._id || team.id || Math.random().toString(),
          name: team.name,
          country: team.country || 'Unknown',
          email: team.email || 'N/A',
          description: team.description || 'No description',
        }))
        setSearchResults(teamResults)
        setSearchError(null)
      }
    } catch {
      setSearchError('Error searching teams')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (participationType === 'Solo') {
      searchParticipants(query)
    } else {
      searchTeams(query)
    }
  }

  const handleAddSelection = async (selectedItem: any) => {
    try {
      if (participationType === 'Solo') {
        const userId = selectedItem._id || selectedItem.userId
        let completeUserData = null
        try {
          completeUserData = await getUserById(userId)
        } catch {}
        const addedFullName = completeUserData?.fullname || selectedItem.fullname || 'Unknown User'
        const newParticipant = {
          id: userId,
          participantId: null,
          userId: userId,
          username:
            completeUserData?.nickname ||
            selectedItem.nickname ||
            selectedItem.username ||
            'Unknown',
          firstName: addedFullName.split(' ')[0] || 'Unknown',
          lastName: addedFullName.split(' ').slice(1).join(' ') || 'User',
          fullName: addedFullName,
          phone: completeUserData?.phone ? String(completeUserData.phone) : 'N/A',
          facebook: completeUserData?.socialMediaLinks?.facebook || 'N/A',
          profileImage: completeUserData?.profileImage || '',
          teamName: 'No Team',
          country: completeUserData?.country || selectedItem.country || 'Unknown',
          checkIn: false,
          freeAgent: false,
          verified: completeUserData?.verifmail || false,
          issued: false,
          discordId: 'N/A',
          riotId: 'N/A',
          email: completeUserData?.email || selectedItem.email || 'N/A',
          expanded: false,
        }
        setParticipants(prev => [...prev, newParticipant])
      } else {
        const newTeam = {
          id: selectedItem._id,
          username: selectedItem.name || 'Unknown Team',
          firstName: '',
          lastName: '',
          teamName: selectedItem.name || 'Unknown Team',
          country: selectedItem.country || 'Unknown',
          checkIn: false,
          freeAgent: false,
          verified: false,
          issued: false,
          discordId: 'N/A',
          riotId: 'N/A',
          email: selectedItem.email || 'N/A',
          expanded: false,
        }
        setParticipants(prev => [...prev, newTeam])
      }
      setHasChanges(true)
      setShowAddModal(false)
      setSearchQuery('')
      setSearchResults([])
      setSearchError(null)
      toast.success(
        `${participationType === 'Solo' ? 'Participant' : 'Team'} added successfully! Click "Save Changes" to persist.`,
      )
    } catch {
      toast.error('Failed to add selection. Please try again.')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedParticipants(participants.map(p => p.id))
    } else {
      setSelectedParticipants([])
    }
  }

  const handleSelectParticipant = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedParticipants(prev => [...prev, id])
    } else {
      setSelectedParticipants(prev => prev.filter(pId => pId !== id))
      setSelectAll(false)
    }
  }

  // Load team members when team is expanded - only show selected members for tournament
  const loadTeamMembers = async (teamId: string) => {
    try {
      // Get the participant record to find selected team members
      const participantsData = await getParticipantsByTournament(actualTournamentId)
      // Find participant by team ID - participantType is "Solo" for team registrations
      const teamParticipant = participantsData?.find(
        (p: any) => p.team?._id === teamId || p.team?.id === teamId || p.team === teamId,
      )

      // Get selected member IDs from participant record
      const selectedMemberIds: string[] = []
      if (teamParticipant?.teamMembers && Array.isArray(teamParticipant.teamMembers)) {
        selectedMemberIds.push(
          ...teamParticipant.teamMembers.map((m: any) =>
            typeof m === 'string' ? m : m._id || m.id,
          ),
        )
      }
      if (teamParticipant?.substituteMembers && Array.isArray(teamParticipant.substituteMembers)) {
        selectedMemberIds.push(
          ...teamParticipant.substituteMembers.map((m: any) =>
            typeof m === 'string' ? m : m._id || m.id,
          ),
        )
      }

      const team = await getTeamById(teamId)

      const members: Array<{
        userId: string
        username: string
        role: string
        email?: string
        verified?: boolean
        discordId?: string
        riotId?: string
        requireGameAccount?: string
        requireDiscordUsername?: string
        requireEpicGamesUsername?: string
        requireSteamId?: string
        requireRiotId?: string
        requireRankRating?: string
        requireCustomGameIdentifier?: string
        [key: string]: string | boolean | undefined
      }> = []

      // Get team owner
      if (team.teamowner && Array.isArray(team.teamowner)) {
        for (const ownerEntry of team.teamowner) {
          try {
            // Check if user is an object or just an ID
            const userIdOrObj = ownerEntry.user
            let userData: User | undefined
            let userId = ''
            if (typeof userIdOrObj === 'string') {
              userId = userIdOrObj
              userData = await getUserById(userIdOrObj)
            } else if (userIdOrObj && typeof userIdOrObj === 'object') {
              // User is already an object
              userData = userIdOrObj
              userId = userData._id || ''
            }

            // Only include if in selected members list
            if (userData !== undefined && selectedMemberIds.includes(userId)) {
              members.push({
                userId: userData._id || 'unknown',
                username: userData.nickname || 'Unknown',
                role: ownerEntry.role || 'owner',
                email: userData.email || '',
                verified: userData.verifmail || false,
                discordId: userData.discordId || userData.socialMediaLinks?.discord || '',
                riotId:
                  userData.connectedAcc?.riot?.gameName && userData.connectedAcc?.riot?.tagLine
                    ? `${userData.connectedAcc.riot.gameName}#${userData.connectedAcc.riot.tagLine}`
                    : '',
                requireGameAccount: userData.gameProfiles?.[0]?.username || '',
                requireDiscordUsername:
                  userData.discordId || userData.socialMediaLinks?.discord || '',
                requireEpicGamesUsername: userData.connectedAcc?.epicGames?.displayName || '',
                requireSteamId: userData.connectedAcc?.steam?.steamId || '',
                requireRiotId:
                  userData.connectedAcc?.riot?.gameName && userData.connectedAcc?.riot?.tagLine
                    ? `${userData.connectedAcc.riot.gameName}#${userData.connectedAcc.riot.tagLine}`
                    : '',
                requireRankRating: '',
                requireCustomGameIdentifier: '',
              })
            }
          } catch {}
        }
      }

      // Get team roster
      if (team.teamroster && Array.isArray(team.teamroster)) {
        for (const rosterEntry of team.teamroster) {
          try {
            // Check if user is an object or just an ID
            const userIdOrObj = rosterEntry.user
            let userData: User | undefined
            let userId = ''
            if (typeof userIdOrObj === 'string') {
              userId = userIdOrObj
              userData = await getUserById(userIdOrObj)
            } else if (userIdOrObj && typeof userIdOrObj === 'object') {
              // User is already an object
              userData = userIdOrObj as User
              userId = userData._id || ''
            }

            // Only include if in selected members list
            if (userData && selectedMemberIds.includes(userId)) {
              members.push({
                userId: userData._id || 'unknown',
                username: userData.nickname || 'Unknown',
                role: rosterEntry.role || 'member',
                email: userData.email || '',
                verified: userData.verifmail || false,
                discordId: userData.discordId || userData.socialMediaLinks?.discord || '',
                riotId:
                  userData.connectedAcc?.riot?.gameName && userData.connectedAcc?.riot?.tagLine
                    ? `${userData.connectedAcc.riot.gameName}#${userData.connectedAcc.riot.tagLine}`
                    : '',
                requireGameAccount: userData.gameProfiles?.[0]?.username || '',
                requireDiscordUsername:
                  userData.discordId || userData.socialMediaLinks?.discord || '',
                requireEpicGamesUsername: userData.connectedAcc?.epicGames?.displayName || '',
                requireSteamId: userData.connectedAcc?.steam?.steamId || '',
                requireRiotId:
                  userData.connectedAcc?.riot?.gameName && userData.connectedAcc?.riot?.tagLine
                    ? `${userData.connectedAcc.riot.gameName}#${userData.connectedAcc.riot.tagLine}`
                    : '',
                requireRankRating: '',
                requireCustomGameIdentifier: '',
              })
            }
          } catch {}
        }
      }

      // Update participant with team members
      setParticipants(prev => prev.map(p => (p.id === teamId ? { ...p, teamMembers: members } : p)))
    } catch {
      toast.error('Failed to load team members')
    }
  }

  const handleTeamExpand = (teamId: string, currentExpanded: boolean) => {
    if (!currentExpanded) {
      // Expanding - load team members
      loadTeamMembers(teamId)
    }
    updateParticipant(teamId, 'expanded', !currentExpanded)
  }

  // --- Dynamic headers from joinProcess ---
  const [tournamentJoinProcess, setTournamentJoinProcess] = useState<any>(null)
  useEffect(() => {
    async function fetchJoinProcess() {
      if (actualTournamentId) {
        try {
          const tournament = await getTournamentById(actualTournamentId)
          setTournamentJoinProcess(tournament?.joinProcess || null)
        } catch {}
      }
    }
    fetchJoinProcess()
  }, [actualTournamentId])

  // Map joinProcess keys to readable labels
  const joinProcessLabels: Record<string, string> = {
    limitedBySkillLevel: 'Skill Level',
    requireVerifiedEmail: 'Verified Email',
    requireSubscription: 'Subscription',
    allowSouls: 'Souls',
    inHouseQueue: 'In-House Queue',
    entryFee: 'Entry Fee',
    linkGameRequired: 'Game Linked',
    requireAgeVerification: 'Age Verified',
    requireGameAccount: 'Game Account',
    requireDiscordUsername: 'Discord Username',
    requireEpicGamesUsername: 'Epic Username',
    requireSteamId: 'Steam ID',
    requireRiotId: 'Riot ID',
    requireRankRating: 'Rank Rating',
    requireCustomGameIdentifier: 'Custom Game ID',
  }

  // Fields to exclude from joinProcess display (irrelevant for participants table)
  const excludedJoinProcessFields = [
    'maxFreeAgents',
    'numberOfParticipants',
    'numberOfSubstitutes',
    'perTeamPurchasing',
    'limitSkillLevel', // This is a nested object, not a simple field
    'requireVerifiedEmail', // Already shown in Verified column
  ]

  // Only show joinProcess fields that are true (or >0 for numbers) and not excluded
  const joinProcessFields = tournamentJoinProcess
    ? Object.entries(tournamentJoinProcess)
        .filter(([k, v]) => {
          // Exclude irrelevant fields
          if (excludedJoinProcessFields.includes(k)) {
            return false
          }
          // Only show if value is true or > 0
          if (typeof v === 'boolean') {
            return v
          }
          if (typeof v === 'number') {
            return v > 0
          }
          return false
        })
        .map(([k]) => k)
    : []

  return (
    <div className="bg-defendrBg text-white p-4 sm:p-6">
      {/* Kick Confirmation Modal */}
      {kickModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-4 sm:p-6 w-full max-w-sm">
            <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h3" className="mb-4">
              Confirm Kick
            </Typo>
            <Typo as="p" color="grey" fontVariant="p4" className="mb-6">
              Are you sure you want to kick this{' '}
              {kickModal.type === 'Solo' ? 'participant' : 'team'}? This action cannot be undone.
            </Typo>
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                size="xxs"
                variant="outlined-grey"
                onClick={() => setKickModal({ open: false, participantId: null, type: null })}
              />
              <Button
                label="Confirm Kick"
                size="xxs"
                variant="contained-red"
                onClick={() => {
                  if (kickModal.participantId) handleKickParticipant(kickModal.participantId)
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h2 className="text-white text-lg sm:text-xl font-poppins">Participant</h2>
        <div className="text-sm text-defendrGrey font-poppins">
          {participationType}: <span className="text-defendrRed">{participants.length}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
        <CustomToggleSwitch checked={globalCheckIn} label="Check In" onChange={setGlobalCheckIn} />
        {participationType === 'Team' && (
          <CustomToggleSwitch
            checked={globalFreeAgent}
            label="Free Agent"
            onChange={setGlobalFreeAgent}
          />
        )}
        <div className="flex flex-wrap gap-2 sm:ml-auto w-full sm:w-auto">
          <Button
            className="font-poppins text-xs px-3 py-1 flex-1 min-w-[120px]"
            label="Export Data"
            size="xxs"
            variant="contained-red"
            onClick={exportToExcel}
          />
          <Button
            className="font-poppins text-xs px-3 py-1 flex-1 min-w-[120px]"
            label="Import Data"
            size="xxs"
            variant="contained-red"
            onClick={() => fileInputRef.current?.click()}
          />
          <Button
            className="font-poppins text-xs px-3 py-1 flex-1 min-w-[120px]"
            label={participationType === 'Solo' ? '+ Add Participant' : '+ Add Team'}
            size="xxs"
            variant="contained-red"
            onClick={() => setShowAddModal(true)}
          />
        </div>
      </div>

      <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg">
        {/* Responsive Table for md+ screens, Card view for mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px] text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/10 font-poppins text-white">
                <th className="p-2 md:p-4 text-left w-8 md:w-12">#</th>
                <th className="p-2 md:p-4 text-left w-8 md:w-12">
                  <CustomCheckBox
                    checked={selectAll}
                    id="select-all"
                    label=""
                    onChange={() => handleSelectAll(!selectAll)}
                  />
                </th>
                <th className="p-2 md:p-4 text-left min-w-[120px] md:min-w-[200px]">
                  {participationType === 'Solo' ? 'Username' : 'Team Name'}
                </th>
                <th className="p-2 md:p-4 text-left min-w-[80px] md:min-w-[120px]">Country</th>
                {participationType === 'Solo' && (
                  <th className="p-2 md:p-4 text-left min-w-[80px] md:min-w-[120px]">Verified</th>
                )}
                {participationType === 'Solo' && (
                  <th className="p-2 md:p-4 text-left min-w-[120px] md:min-w-[200px]">Email</th>
                )}
                {participationType === 'Solo' && (
                  <th className="p-2 md:p-4 text-left min-w-[120px] md:min-w-[180px]">Full Name</th>
                )}
                {participationType === 'Solo' && (
                  <th className="p-2 md:p-4 text-left min-w-[100px] md:min-w-[140px]">
                    Phone Number
                  </th>
                )}
                {participationType === 'Solo' && (
                  <th className="p-2 md:p-4 text-left min-w-[100px] md:min-w-[140px]">Facebook</th>
                )}
                <th className="p-2 md:p-4 text-left min-w-[80px] md:min-w-[120px]">Check In</th>
                <th className="p-2 md:p-4 text-left min-w-[80px] md:min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="p-4 text-center text-white"
                    colSpan={participationType === 'Solo' ? 10 : 6}
                  >
                    Loading participants...
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td
                    className="p-4 text-center text-defendrGrey whitespace-normal break-words"
                    colSpan={participationType === 'Solo' ? 10 : 6}
                  >
                    No {participationType === 'Solo' ? 'participants' : 'teams'} found. Click{' '}
                    <span className="font-semibold">
                      Add {participationType === 'Solo' ? 'Participant' : 'Team'}
                    </span>{' '}
                    to add some.
                  </td>
                </tr>
              ) : (
                participants.map((participant, index) => (
                  <>
                    <tr
                      key={participant.id}
                      className="border-b border-defendrGrey/10 hover:bg-defendrGrey/5 transition-colors duration-200"
                    >
                      <td className="p-2 md:p-4 text-white font-poppins">{index + 1}</td>
                      <td className="p-2 md:p-4">
                        <CustomCheckBox
                          checked={selectedParticipants.includes(participant.id)}
                          id={`participant-${participant.id}`}
                          label=""
                          onChange={() =>
                            handleSelectParticipant(
                              participant.id,
                              !selectedParticipants.includes(participant.id),
                            )
                          }
                        />
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-2">
                          {participant.profileImage ? (
                            <Image
                              unoptimized
                              alt={participant.username}
                              className="rounded-full object-cover"
                              height={28}
                              width={28}
                              src={
                                participant.profileImage.startsWith('http')
                                  ? participant.profileImage
                                  : `https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20logo/user.png`
                              }
                              onError={e => {
                                ;(e.target as HTMLImageElement).src =
                                  'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/default%20pictures/default%20logo/user.png'
                              }}
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#D62555]/20 flex items-center justify-center text-[#D62555] text-xs font-bold shrink-0">
                              {participant.username?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                          {participationType === 'Solo' ? (
                            <a
                              className="text-defendrRed underline hover:text-defendrHoverRed font-poppins"
                              href={
                                participant.userId ? `/user/${participant.userId}/profile` : '#'
                              }
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {participant.username}
                            </a>
                          ) : (
                            <a
                              className="text-defendrRed underline hover:text-defendrHoverRed font-poppins"
                              href={participant.id ? `/team/${participant.id}/profile` : '#'}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {participant.teamName}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-2">
                          <Typo as="span" color="red" fontFamily="poppins" fontVariant="p3">
                            T
                          </Typo>
                          <Typo as="span" color="white" fontVariant="p3">
                            {participant.country}
                          </Typo>
                        </div>
                      </td>
                      {/* Verified (Solo only, always shown) */}
                      {participationType === 'Solo' && (
                        <td className="p-2 md:p-4">
                          <div className="flex items-center gap-2">
                            {participant.verified ? (
                              <Image alt="Verified" height={16} src={greenTickIcon} width={16} />
                            ) : (
                              <Image
                                alt="Not Verified"
                                height={16}
                                src={importantIcon}
                                width={16}
                              />
                            )}
                            <Typo
                              as="span"
                              color={participant.verified ? 'white' : 'white'}
                              fontVariant="p4"
                            >
                              {participant.verified ? 'Verified' : 'Not Verified'}
                            </Typo>
                          </div>
                        </td>
                      )}
                      {/* Email (Solo only) */}
                      {participationType === 'Solo' && (
                        <td className="p-2 md:p-4">
                          <Typo as="span" color="white" fontVariant="p4">
                            {participant.email || 'N/A'}
                          </Typo>
                        </td>
                      )}
                      {/* Full Name (Solo only) */}
                      {participationType === 'Solo' && (
                        <td className="p-2 md:p-4">
                          <Typo as="span" color="white" fontVariant="p4">
                            {participant.fullName || 'N/A'}
                          </Typo>
                        </td>
                      )}
                      {/* Phone Number (Solo only) */}
                      {participationType === 'Solo' && (
                        <td className="p-2 md:p-4">
                          <Typo as="span" color="white" fontVariant="p4">
                            {participant.phone || 'N/A'}
                          </Typo>
                        </td>
                      )}
                      {/* Facebook (Solo only) */}
                      {participationType === 'Solo' && (
                        <td className="p-2 md:p-4">
                          {participant.facebook && participant.facebook !== 'N/A' ? (
                            <a
                              href={
                                participant.facebook.startsWith('http')
                                  ? participant.facebook
                                  : `https://facebook.com/${participant.facebook}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/30 transition-colors duration-200"
                              title={participant.facebook}
                            >
                              <svg
                                className="w-4 h-4 text-[#1877F2]"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </a>
                          ) : (
                            <Typo as="span" color="white" fontVariant="p4">
                              N/A
                            </Typo>
                          )}
                        </td>
                      )}
                      {/* Check In */}
                      <td className="p-2 md:p-4">
                        <CustomToggleSwitch
                          checked={participant.checkIn}
                          label=""
                          onChange={checked => {
                            updateParticipant(participant.id, 'checkIn', checked)
                            handleCheckinToggle(participant.id, checked)
                            setHasChanges(true)
                          }}
                        />
                      </td>
                      {/* Actions column for both Solo and Team */}
                      <td className="p-2 md:p-4">
                        <div className="flex gap-2">
                          {participationType === 'Solo' && (
                            <Button
                              className="font-poppins text-xs px-3 py-1"
                              label="Kick Participant"
                              size="xxs"
                              variant="contained-red"
                              onClick={() =>
                                setKickModal({
                                  open: true,
                                  participantId: participant.id,
                                  type: 'Solo',
                                })
                              }
                            />
                          )}

                          {participationType === 'Team' && (
                            <>
                              <Button
                                className="font-poppins text-xs px-3 py-1"
                                label={participant.expanded ? 'Hide Members' : 'Check Team Members'}
                                size="xxs"
                                variant="contained-red"
                                onClick={() => {
                                  handleTeamExpand(participant.id, participant.expanded || false)
                                }}
                              />
                              <Button
                                className="font-poppins text-xs px-3 py-1"
                                label="Kick Team"
                                size="xxs"
                                variant="contained-red"
                                onClick={() => {
                                  // Find the participantId for this team
                                  const teamParticipant = participants.find(
                                    p =>
                                      p.id === participant.id ||
                                      p.teamName === participant.teamName,
                                  )
                                  const participantIdToKick =
                                    teamParticipant?.participantId || participant.id
                                  setKickModal({
                                    open: true,
                                    participantId: participantIdToKick,
                                    type: 'Team',
                                  })
                                }}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Expandable Team Members Row */}
                    {participationType === 'Team' && participant.expanded && (
                      <tr key={`${participant.id}-members`}>
                        <td className="p-4 bg-defendrGrey/5" colSpan={5}>
                          <div className="ml-8">
                            <Typo
                              as="span"
                              className="mb-4 block"
                              color="white"
                              fontFamily="poppins"
                              fontVariant="p3b"
                            >
                              Selected Tournament Members
                            </Typo>
                            {!participant.teamMembers ? (
                              <Typo
                                as="span"
                                className="text-sm block"
                                color="grey"
                                fontVariant="p5"
                              >
                                Loading team members...
                              </Typo>
                            ) : participant.teamMembers.length === 0 ? (
                              <Typo
                                as="span"
                                className="text-sm block"
                                color="grey"
                                fontVariant="p5"
                              >
                                No members selected for this tournament
                              </Typo>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                  <thead>
                                    <tr className="border-b border-defendrGrey/30">
                                      <th className="p-3 text-left">
                                        <Typo
                                          as="span"
                                          color="grey"
                                          fontFamily="poppins"
                                          fontVariant="p5b"
                                        >
                                          #
                                        </Typo>
                                      </th>
                                      <th className="p-3 text-left min-w-[150px]">
                                        <Typo
                                          as="span"
                                          color="grey"
                                          fontFamily="poppins"
                                          fontVariant="p5b"
                                        >
                                          Username
                                        </Typo>
                                      </th>
                                      <th className="p-3 text-left min-w-[100px]">
                                        <Typo
                                          as="span"
                                          color="grey"
                                          fontFamily="poppins"
                                          fontVariant="p5b"
                                        >
                                          Role
                                        </Typo>
                                      </th>
                                      <th className="p-3 text-left min-w-[100px]">
                                        <Typo
                                          as="span"
                                          color="grey"
                                          fontFamily="poppins"
                                          fontVariant="p5b"
                                        >
                                          Verified
                                        </Typo>
                                      </th>
                                      <th className="p-3 text-left min-w-[180px]">
                                        <Typo
                                          as="span"
                                          color="grey"
                                          fontFamily="poppins"
                                          fontVariant="p5b"
                                        >
                                          Email
                                        </Typo>
                                      </th>
                                      {/* Dynamic joinProcess headers for team members */}
                                      {joinProcessFields.map(field => (
                                        <th key={field} className="p-3 text-left min-w-[120px]">
                                          <Typo
                                            as="span"
                                            color="grey"
                                            fontFamily="poppins"
                                            fontVariant="p5b"
                                          >
                                            {joinProcessLabels[field] || field}
                                          </Typo>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {participant.teamMembers.map((member, idx) => (
                                      <tr
                                        key={`${member.userId}-${idx}`}
                                        className="border-b border-defendrGrey/10 hover:bg-defendrGrey/5"
                                      >
                                        <td className="p-3">
                                          <Typo
                                            as="span"
                                            color="grey"
                                            fontFamily="poppins"
                                            fontVariant="p5"
                                          >
                                            {idx + 1}
                                          </Typo>
                                        </td>
                                        <td className="p-3">
                                          <a
                                            className="text-defendrRed underline hover:text-defendrHoverRed font-poppins text-sm"
                                            href={
                                              member.userId ? `/user/${member.userId}/profile` : '#'
                                            }
                                            rel="noopener noreferrer"
                                            target="_blank"
                                          >
                                            {member.username}
                                          </a>
                                        </td>
                                        <td className="p-3">
                                          <Typo
                                            as="span"
                                            className="capitalize"
                                            color="white"
                                            fontFamily="poppins"
                                            fontVariant="p5"
                                          >
                                            {member.role}
                                          </Typo>
                                        </td>
                                        <td className="p-3">
                                          <div className="flex items-center gap-2">
                                            {member.verified ? (
                                              <Image
                                                alt="Verified"
                                                height={14}
                                                src={greenTickIcon}
                                                width={14}
                                              />
                                            ) : (
                                              <Image
                                                alt="Not Verified"
                                                height={14}
                                                src={importantIcon}
                                                width={14}
                                              />
                                            )}
                                            <Typo
                                              as="span"
                                              color={member.verified ? 'white' : 'grey'}
                                              fontFamily="poppins"
                                              fontVariant="p5"
                                            >
                                              {member.verified ? 'Yes' : 'No'}
                                            </Typo>
                                          </div>
                                        </td>
                                        <td className="p-3">
                                          <Typo
                                            as="span"
                                            color={member.email ? 'white' : 'grey'}
                                            fontFamily="poppins"
                                            fontVariant="p5"
                                          >
                                            {member.email || '-'}
                                          </Typo>
                                        </td>
                                        {/* Dynamic joinProcess fields */}
                                        {joinProcessFields.map(field => {
                                          const value = member[field as keyof typeof member]
                                          const hasValue = value && value !== ''
                                          return (
                                            <td key={`${member.userId}-${field}`} className="p-3">
                                              <Typo
                                                as="span"
                                                color={hasValue ? 'white' : 'grey'}
                                                fontFamily="poppins"
                                                fontVariant="p5"
                                              >
                                                {hasValue ? String(value) : '-'}
                                              </Typo>
                                            </td>
                                          )
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
          <div className="flex gap-4 p-2 md:p-4 border-t border-defendrGrey/20">
            <input
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              type="file"
              onChange={importFromJSON}
            />
          </div>
        </div>
        {/* Card view for mobile */}
        <div className="md:hidden p-2 space-y-6">
          {isLoading ? (
            <div className="text-center text-white py-8">Loading participants...</div>
          ) : participants.length === 0 ? (
            <div className="text-center text-defendrGrey py-10 px-2 whitespace-normal break-words rounded-lg bg-defendrGrey/10 text-base font-poppins">
              No {participationType === 'Solo' ? 'participants' : 'teams'} found.
              <br />
              Click{' '}
              <span className="font-semibold">
                Add {participationType === 'Solo' ? 'Participant' : 'Team'}
              </span>{' '}
              to add some.
            </div>
          ) : (
            participants.map((participant, index) => (
              <div
                key={participant.id}
                className="bg-defendrGrey/10 rounded-lg p-4 flex flex-col gap-3 border border-defendrGrey/20"
              >
                <div className="flex items-center gap-2">
                  <span className="font-poppins text-defendrRed">#{index + 1}</span>
                  <CustomCheckBox
                    checked={selectedParticipants.includes(participant.id)}
                    id={`participant-mobile-${participant.id}`}
                    label=""
                    onChange={() =>
                      handleSelectParticipant(
                        participant.id,
                        !selectedParticipants.includes(participant.id),
                      )
                    }
                  />
                  <Image
                    alt="Profile"
                    className="rounded-full"
                    height={24}
                    src={profileIcon}
                    width={24}
                  />
                  {participationType === 'Solo' ? (
                    <a
                      className="text-defendrRed underline hover:text-defendrHoverRed font-poppins text-base"
                      href={participant.userId ? `/user/${participant.userId}/profile` : '#'}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {participant.username}
                    </a>
                  ) : (
                    <a
                      className="text-defendrRed underline hover:text-defendrHoverRed font-poppins text-base"
                      href={participant.id ? `/team/${participant.id}/profile` : '#'}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {participant.teamName}
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="font-semibold">Country:</span> {participant.country}
                  {participationType === 'Solo' && (
                    <>
                      <span className="font-semibold">Verified:</span>{' '}
                      {participant.verified ? 'Yes' : 'No'}
                      <span className="font-semibold">Check In:</span>{' '}
                      <CustomToggleSwitch
                        checked={participant.checkIn}
                        label=""
                        onChange={checked => {
                          updateParticipant(participant.id, 'checkIn', checked)
                          handleCheckinToggle(participant.id, checked)
                          setHasChanges(true)
                        }}
                      />
                      <span className="font-semibold">Free Agent:</span>{' '}
                      <CustomToggleSwitch
                        checked={participant.freeAgent || false}
                        label=""
                        onChange={checked => {
                          updateParticipant(participant.id, 'freeAgent', checked)
                          setHasChanges(true)
                        }}
                      />
                      <span className="font-semibold">Discord:</span>{' '}
                      {participant.discordId || 'N/A'}
                      <span className="font-semibold">Riot:</span> {participant.riotId || 'N/A'}
                      <span className="font-semibold">Email:</span> {participant.email || 'N/A'}
                    </>
                  )}
                  {participationType === 'Team' && (
                    <>
                      <span className="font-semibold">Check In:</span>{' '}
                      <CustomToggleSwitch
                        checked={participant.checkIn}
                        label=""
                        onChange={checked => {
                          updateParticipant(participant.id, 'checkIn', checked)
                          handleCheckinToggle(participant.id, checked)
                          setHasChanges(true)
                        }}
                      />
                    </>
                  )}
                </div>
                {participationType === 'Solo' && (
                  <div className="flex gap-2 mt-2">
                    {isAdmin && (
                      <Button
                        className="font-poppins text-xs px-3 py-1"
                        label="Kick"
                        size="xxs"
                        variant="contained-red"
                        onClick={() =>
                          setKickModal({ open: true, participantId: participant.id, type: 'Solo' })
                        }
                      />
                    )}
                    <Button
                      className="font-poppins text-xs px-3 py-1"
                      label="View profile"
                      size="xxs"
                      variant="contained-red"
                      onClick={() => {
                        if (participant.userId) {
                          window.open(`/user/${participant.userId}/profile`, '_blank')
                        }
                      }}
                    />
                  </div>
                )}
                {participationType === 'Team' && (
                  <div className="mt-3 flex flex-col gap-2">
                    {isAdmin && (
                      <Button
                        className="font-poppins text-xs px-3 py-1 w-full"
                        label="Kick Team"
                        size="xxs"
                        variant="contained-red"
                        onClick={() =>
                          setKickModal({ open: true, participantId: participant.id, type: 'Team' })
                        }
                      />
                    )}
                    <Button
                      className="font-poppins text-xs px-3 py-1 w-full"
                      label={participant.expanded ? 'Hide Members' : 'Check Team Members'}
                      size="xxs"
                      variant="contained-red"
                      onClick={() => {
                        handleTeamExpand(participant.id, participant.expanded || false)
                      }}
                    />
                    {participant.expanded && (
                      <div className="mt-3 p-3 bg-defendrGrey/10 rounded-lg">
                        <Typo
                          as="span"
                          className="mb-3 block"
                          color="white"
                          fontFamily="poppins"
                          fontVariant="p4b"
                        >
                          Selected Tournament Members
                        </Typo>
                        {!participant.teamMembers ? (
                          <Typo as="span" className="text-xs block" color="grey" fontVariant="p5">
                            Loading team members...
                          </Typo>
                        ) : participant.teamMembers.length === 0 ? (
                          <Typo as="span" className="text-xs block" color="grey" fontVariant="p5">
                            No members selected for this tournament
                          </Typo>
                        ) : (
                          <div className="space-y-3">
                            {participant.teamMembers.map((member, idx) => (
                              <div key={idx} className="p-3 bg-defendrGrey/20 rounded">
                                <div className="flex items-center gap-2 mb-2">
                                  <Typo as="span" color="red" fontFamily="poppins" fontVariant="p5">
                                    #{idx + 1}
                                  </Typo>
                                  <a
                                    className="text-defendrRed underline hover:text-defendrHoverRed text-sm font-semibold font-poppins"
                                    href={member.userId ? `/user/${member.userId}/profile` : '#'}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    {member.username}
                                  </a>
                                  <Typo
                                    as="span"
                                    className="capitalize"
                                    color="grey"
                                    fontVariant="p6"
                                  >
                                    ({member.role})
                                  </Typo>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <Typo as="span" color="grey" fontVariant="p6">
                                      Verified:{' '}
                                    </Typo>
                                    <Typo as="span" color="white" fontVariant="p6">
                                      {member.verified ? 'Yes' : 'No'}
                                    </Typo>
                                  </div>
                                  <div>
                                    <Typo as="span" color="grey" fontVariant="p6">
                                      Email:{' '}
                                    </Typo>
                                    <Typo
                                      as="span"
                                      color={member.email ? 'white' : 'grey'}
                                      fontVariant="p6"
                                    >
                                      {member.email || '-'}
                                    </Typo>
                                  </div>
                                  {joinProcessFields.map(field => {
                                    const value = member[field as keyof typeof member]
                                    const hasValue = value && value !== ''
                                    return (
                                      <div key={`${member.userId}-mobile-${field}`}>
                                        <Typo as="span" color="grey" fontVariant="p6">
                                          {joinProcessLabels[field] || field}:{' '}
                                        </Typo>
                                        <Typo
                                          as="span"
                                          color={hasValue ? 'white' : 'grey'}
                                          fontVariant="p6"
                                        >
                                          {hasValue ? String(value) : '-'}
                                        </Typo>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6 mb-8 sm:mb-0">
        <Button
          className="font-poppins"
          label="Cancel"
          size="xs"
          variant="outlined-red"
          onClick={() => {
            setHasChanges(false)
            loadParticipants()
          }}
        />
        <Button
          className="font-poppins"
          label="Save Changes"
          size="xs"
          variant="contained-red"
          onClick={handleSaveChanges}
        />
      </div>

      {/* Add Participant/Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
          <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-4 sm:p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h3">
                {participationType === 'Solo' ? 'Add Participant' : 'Add Team'}
              </Typo>
              <button
                className="text-white hover:text-defendrRed"
                onClick={() => {
                  setShowAddModal(false)
                  setSearchQuery('')
                }}
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <input
                className="w-full bg-defendrLightBlack border border-defendrGrey rounded-lg px-4 py-2 text-white placeholder-defendrGrey focus:border-defendrRed outline-none"
                placeholder={`Search for ${participationType === 'Solo' ? 'participants' : 'teams'}...`}
                type="text"
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
              />
            </div>
            {/* Search Results */}
            <div className="mb-4 max-h-60 overflow-y-auto">
              {isSearching && <div className="text-center text-defendrGrey py-4">Searching...</div>}
              {searchError && <div className="text-center text-defendrRed py-4">{searchError}</div>}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map(item => (
                    <div
                      key={item._id}
                      className="p-3 bg-defendrGrey rounded-lg cursor-pointer hover:bg-defendrRed transition-colors"
                      onClick={() => handleAddSelection(item)}
                    >
                      <div className="text-white font-medium">
                        {participationType === 'Solo'
                          ? item.nickname || item.username || 'Unknown User'
                          : item.name}
                      </div>
                      <div className="text-defendrGrey text-sm">
                        {participationType === 'Solo'
                          ? `${item.fullname || 'No full name'} • ${item.country}`
                          : `${item.country} • ${item.description || 'No description'}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                size="xxs"
                variant="outlined-grey"
                onClick={() => {
                  setShowAddModal(false)
                  setSearchQuery('')
                  setSearchResults([])
                  setSearchError(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageParticipants
