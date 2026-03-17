import { useCallback, useEffect, useState } from 'react'

import { getMatchById } from '@/services/matchService'
import { getParticipantById } from '@/services/participantService'
import { getUserById } from '@/services/userService'
import { getTournamentById } from '@/services/tournamentService'
import { getMessagesByMatchId, sendMessageToMatch } from '@/services/messagesService'
import { getOrganizationById } from '@/services/organizationService'
import { getTeamById } from '@/services/teamService'
import { initSocket, getSocket } from '@/lib/socket'
import { Message } from '@/types/messageType'
import { Ticket } from '@/types/ticketType'

export interface MatchProfileState {
  matchId: string
  tournamentId?: string
  team1: { name: string; score: number; participantId?: string }
  team2: { name: string; score: number; participantId?: string }
  status: string
  screenshots: unknown[]
  tickets: Ticket[]
  messages: Message[]
  isAdminView: boolean
  isAuthorized: boolean
}

interface Options {
  matchId: string
  currentUserId?: string
  userTeamIds?: string[]
  adminContext?: boolean // true when accessed from setup route
}

export const useMatchProfile = ({
  matchId,
  currentUserId,
  userTeamIds = [],
  adminContext = false,
}: Options) => {
  const [state, setState] = useState<MatchProfileState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [usernames, setUsernames] = useState<Record<string, string>>({})
  const [userRoles, setUserRoles] = useState<Record<string, string>>({})
  const [teamMemberships, setTeamMemberships] = useState<Record<string, string>>({})
  // Track underlying user IDs for solo participants so we can align their messages (participantId != userId)
  const [participantUserIds, setParticipantUserIds] = useState<{ team1?: string; team2?: string }>(
    {},
  )

  const load = useCallback(async () => {
    if (!matchId) {
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const matchResp = await getMatchById(matchId)
      const match = matchResp.match || matchResp

      // Extract participant IDs and team names directly from match data
      const participantAId =
        match.participantA?.$oid || match.participantA?._id || match.participantA || undefined
      const participantBId =
        match.participantB?.$oid || match.participantB?._id || match.participantB || undefined

      const resolveParticipantName = async (pid?: string): Promise<string | undefined> => {
        if (!pid) {
          return undefined
        }
        try {
          // Get participant data first

          const part = await getParticipantById(pid)

          // For team participants: extract team ID and get team name
          if (part?.team) {
            const teamId = typeof part.team === 'string' ? part.team : part.team._id || part.team.id
            if (teamId) {
              try {
                const team = await getTeamById(teamId)

                if (team?.name) {
                  return team.name
                } else {
                }
              } catch (teamError) {}
            } else {
            }
          }

          // For solo participants: get user name
          if (part?.user) {
            const userRef = part.user
            const userId =
              (typeof userRef === 'string'
                ? userRef
                : userRef?._id || userRef?.id || userRef?.$oid) || undefined
            if (userId) {
              const user = await getUserById(userId)
              const resolvedName =
                user?.nickname ||
                user?.fullname ||
                user?.username ||
                (user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : undefined) ||
                'Player'

              return resolvedName
            } else {
            }
          } else {
          }
        } catch (error) {
          return undefined
        }
        return undefined
      }

      // Resolve participant names using the proper function that handles both teams and solo participants
      const nameA = await resolveParticipantName(participantAId)
      const nameB = await resolveParticipantName(participantBId)

      // Fetch participant objects once more lightweight (separate from name resolution) to extract user IDs for SOLO tournaments
      // (We keep this separate to avoid refactoring the verbose debug logic inside resolveParticipantName)
      let team1UserId: string | undefined
      let team2UserId: string | undefined
      try {
        if (participantAId) {
          const pA = await getParticipantById(participantAId)
          const rawUser = pA?.user
          team1UserId =
            typeof rawUser === 'string' ? rawUser : rawUser?._id || rawUser?.id || rawUser?.$oid
        }
        if (participantBId) {
          const pB = await getParticipantById(participantBId)
          const rawUser = pB?.user
          team2UserId =
            typeof rawUser === 'string' ? rawUser : rawUser?._id || rawUser?.id || rawUser?.$oid
        }
      } catch {
        /* ignore participant fetch errors here */
      }
      setParticipantUserIds({ team1: team1UserId, team2: team2UserId })

      // Debug log to see what we resolved

      // Attempt immediate participant ownership check before tournament fetch
      let earlyIsParticipant = false
      if (currentUserId) {
        if (participantAId === currentUserId || participantBId === currentUserId) {
          earlyIsParticipant = true
        }
      }
      if (!earlyIsParticipant && userTeamIds.length) {
        if (participantAId && userTeamIds.includes(participantAId)) {
          earlyIsParticipant = true
        }
        if (participantBId && userTeamIds.includes(participantBId)) {
          earlyIsParticipant = true
        }
      }

      // Names are already extracted above from match data directly

      // Scores
      let scoreA = 0
      let scoreB = 0
      if (Array.isArray(match.scores)) {
        interface RawScore {
          participant?: unknown
          score?: number
        }
        ;(match.scores as RawScore[]).forEach(s => {
          let sid: string | undefined
          const p = s.participant
          if (typeof p === 'string') {
            sid = p
          } else if (p && typeof p === 'object') {
            const obj = p as { _id?: string; $oid?: string; id?: string }
            sid = obj.$oid || obj._id || obj.id
          }
          if (sid && sid === participantAId) {
            scoreA = s.score || 0
          } else if (sid && sid === participantBId) {
            scoreB = s.score || 0
          }
        })
      }

      const tId: string | undefined =
        match.tournament?.$oid || match.tournament?._id || match.tournament || undefined

      // Authorization: user must be participant (user id or team membership) OR admin context
      let isParticipant = false
      let isAdminView = false

      if (tId) {
        try {
          const tournament = await getTournamentById(tId)

          // Fetch organization roles if tournament has an organization
          const organizationRoles: Record<string, string> = {}
          if (tournament?.organization) {
            try {
              const orgId =
                tournament.organization.$oid ||
                tournament.organization._id ||
                tournament.organization
              if (orgId) {
                const organization = await getOrganizationById(orgId)
                if (organization?.staff && Array.isArray(organization.staff)) {
                  organization.staff.forEach(
                    (staffMember: {
                      user?: { _id?: string; id?: string; $oid?: string }
                      role?: string
                    }) => {
                      const userId =
                        staffMember.user?.$oid || staffMember.user?._id || staffMember.user?.id
                      if (userId && staffMember.role) {
                        organizationRoles[userId] = staffMember.role
                      }
                    },
                  )
                }
              }
            } catch (orgError) {}
          }
          setUserRoles(organizationRoles)
          const participants: unknown[] = Array.isArray(tournament?.participants)
            ? tournament.participants
            : []
          const participantUserIds = new Set<string>()
          const participantTeamIds = new Set<string>()
          participants.forEach(p => {
            if (p && typeof p === 'object') {
              const rec = p as Record<string, unknown>
              const u = rec.user
              const t = rec.team
              const extract = (val: unknown): string | undefined => {
                if (!val) {
                  return undefined
                }
                if (typeof val === 'string') {
                  return val
                }
                if (typeof val === 'object') {
                  const o = val as { _id?: string; id?: string; $oid?: string }
                  return o.$oid || o._id || o.id
                }
                return undefined
              }
              const uid = extract(u)
              const tid = extract(t)
              if (uid) {
                participantUserIds.add(uid)
              }
              if (tid) {
                participantTeamIds.add(tid)
              }
            }
          })
          if (earlyIsParticipant) {
            isParticipant = true
          } else if (currentUserId && participantUserIds.has(currentUserId)) {
            isParticipant = true
          } else if (userTeamIds.some(id => participantTeamIds.has(id))) {
            isParticipant = true
          }
          // Admin view: rely on adminContext for now (could refine by checking org ownership)
          if (adminContext) {
            isAdminView = true
          }
        } catch {
          // ignore tournament fetch errors
        }
      }

      const isAuthorized = isParticipant || isAdminView

      // Load messages (non-blocking for auth)
      let loadedMessages: Message[] = []
      try {
        const msgs = await getMessagesByMatchId(matchId)
        if (Array.isArray(msgs)) {
          loadedMessages = msgs
        }
      } catch {
        /* ignore */
      }

      const screenshots: unknown[] = Array.isArray(match.screenshots) ? match.screenshots : []

      setMessages(loadedMessages)
      setState({
        matchId,
        tournamentId: tId,
        team1: { name: nameA || 'Player A', score: scoreA, participantId: participantAId },
        team2: { name: nameB || 'Player B', score: scoreB, participantId: participantBId },
        status: match.status || 'Unknown',
        screenshots,
        tickets: [],
        messages: loadedMessages,
        isAdminView,
        isAuthorized,
      })

      // Cache team IDs for efficient team membership detection
      let participantATeamId: string | null = null
      let participantBTeamId: string | null = null

      // Pre-fetch participant team IDs once upfront
      try {
        if (participantAId) {
          const participantA = await getParticipantById(participantAId)
          if (participantA?.team) {
            participantATeamId =
              typeof participantA.team === 'string'
                ? participantA.team
                : participantA.team._id || participantA.team.id
          }
        }
        if (participantBId) {
          const participantB = await getParticipantById(participantBId)
          if (participantB?.team) {
            participantBTeamId =
              typeof participantB.team === 'string'
                ? participantB.team
                : participantB.team._id || participantB.team.id
          }
        }
      } catch {
        // Ignore participant fetch errors, fall back to direct ID comparison for solo tournaments
      }

      // Cache usernames and team memberships for messages
      const usernameCache: Record<string, string> = {}
      const teamMembershipCache: Record<string, string> = {}

      for (const message of loadedMessages) {
        if (message.sender && !usernameCache[message.sender]) {
          try {
            const user = await getUserById(message.sender)
            if (user) {
              usernameCache[message.sender] =
                user.nickname || user.fullname || user.username || user.firstName || 'Unknown User'

              // For solo tournaments: match sender to extracted participant user IDs (NOT participant record IDs)
              if (team1UserId && message.sender === team1UserId) {
                teamMembershipCache[message.sender] = 'team1'
              } else if (team2UserId && message.sender === team2UserId) {
                teamMembershipCache[message.sender] = 'team2'
              } else if (message.sender === participantAId) {
                // Fallback: legacy check in case API returned direct user id as participant id
                teamMembershipCache[message.sender] = 'team1'
              } else if (message.sender === participantBId) {
                teamMembershipCache[message.sender] = 'team2'
              }
              // For team tournaments: check user's team memberships against participant team IDs
              else if (
                user.teams &&
                Array.isArray(user.teams) &&
                (participantATeamId || participantBTeamId)
              ) {
                for (const userTeam of user.teams) {
                  const userTeamId =
                    typeof userTeam === 'string' ? userTeam : userTeam._id || userTeam.id
                  if (userTeamId) {
                    if (participantATeamId && userTeamId === participantATeamId) {
                      teamMembershipCache[message.sender] = 'team1'
                      break
                    } else if (participantBTeamId && userTeamId === participantBTeamId) {
                      teamMembershipCache[message.sender] = 'team2'
                      break
                    }
                  }
                }
              }
            }
          } catch {
            usernameCache[message.sender] = message.sender // fallback to ID
          }
        }
      }
      setUsernames(usernameCache)
      setTeamMemberships(teamMembershipCache)
    } catch {
      setError('Failed to load match')
    } finally {
      setIsLoading(false)
    }
  }, [adminContext, currentUserId, matchId, userTeamIds])

  useEffect(() => {
    load()
  }, [load])

  // Socket integration for real-time updates (same pattern as MatchList)
  useEffect(() => {
    if (!currentUserId || !matchId) {
      return
    }

    let isMounted = true
    const socket = initSocket(currentUserId)

    const refreshMessages = async () => {
      if (!isMounted) {
        return
      }

      try {
        const updatedMessages = await getMessagesByMatchId(matchId)
        if (Array.isArray(updatedMessages) && isMounted) {
          setMessages(updatedMessages)
        }
      } catch (error) {
        // Silently fail for network issues to avoid console spam
        if (isMounted) {
          setError('Connection issue - retrying...')
          // Clear error after 3 seconds
          setTimeout(() => {
            if (isMounted) {
              setError(null)
            }
          }, 3000)
        }
      }
    }

    // Handle typing indicators
    const handleUserTyping = (data: { userId: string; username: string; matchId: string }) => {
      if (data.matchId === matchId && data.userId !== currentUserId) {
        setTypingUsers(prev => {
          if (!prev.includes(data.username)) {
            return [...prev, data.username]
          }
          return prev
        })

        // Remove typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(user => user !== data.username))
        }, 3000)
      }
    }

    const handleUserStoppedTyping = (data: {
      userId: string
      username: string
      matchId: string
    }) => {
      if (data.matchId === matchId) {
        setTypingUsers(prev => prev.filter(user => user !== data.username))
      }
    }

    // Listen for real-time updates
    socket.on('update-match', refreshMessages)
    socket.on('updateLiveMatch', refreshMessages)
    socket.on('new-message', refreshMessages)
    socket.on('match-message', refreshMessages)

    // Typing indicators
    socket.on('user-typing', handleUserTyping)
    socket.on('user-stopped-typing', handleUserStoppedTyping)

    return () => {
      isMounted = false
      const s = getSocket()
      s?.off('update-match', refreshMessages)
      s?.off('updateLiveMatch', refreshMessages)
      s?.off('new-message', refreshMessages)
      s?.off('match-message', refreshMessages)
      s?.off('user-typing', handleUserTyping)
      s?.off('user-stopped-typing', handleUserStoppedTyping)
    }
  }, [currentUserId, matchId])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        return
      }
      const sent = await sendMessageToMatch(matchId, content)
      setMessages(prev => [...prev, sent])

      // Stop typing indicator when message is sent
      const socket = getSocket()
      if (socket && currentUserId) {
        socket.emit('stop-typing', { matchId, userId: currentUserId })
      }
    },
    [matchId, currentUserId],
  )

  const emitTyping = useCallback(() => {
    const socket = getSocket()
    if (socket && currentUserId && matchId) {
      socket.emit('typing', { matchId, userId: currentUserId })
    }
  }, [matchId, currentUserId])

  const emitStopTyping = useCallback(() => {
    const socket = getSocket()
    if (socket && currentUserId && matchId) {
      socket.emit('stop-typing', { matchId, userId: currentUserId })
    }
  }, [matchId, currentUserId])

  // Helper to get username from ID
  const getUsername = useCallback(
    (userId: string) => {
      return usernames[userId] || userId
    },
    [usernames],
  )

  // Helper to determine which team a user belongs to
  const getUserTeam = useCallback(
    (userId: string) => {
      if (!state) {
        return null
      }

      // First check our cached team memberships (built from message senders)
      if (teamMemberships[userId]) {
        return teamMemberships[userId] as 'team1' | 'team2'
      }

      // SOLO tournaments: compare against extracted participant underlying user IDs
      if (participantUserIds.team1 && userId === participantUserIds.team1) {
        return 'team1'
      }
      if (participantUserIds.team2 && userId === participantUserIds.team2) {
        return 'team2'
      }
      // Fallback (older logic where participantId might equal userId)
      if (state.team1.participantId === userId) {
        return 'team1'
      }
      if (state.team2.participantId === userId) {
        return 'team2'
      }

      // For team tournaments: Check if user is member of any team that matches participants
      // The user's team IDs should match against the participant IDs (which are team IDs in team tournaments)
      if (userTeamIds.includes(state.team1.participantId || '')) {
        return 'team1'
      }

      if (userTeamIds.includes(state.team2.participantId || '')) {
        return 'team2'
      }

      // Enhanced check: If the current user ID matches the user asking, check against currentUserId
      if (userId === currentUserId) {
        // Solo perspective: current user underlying user id match
        if (participantUserIds.team1 && currentUserId === participantUserIds.team1) {
          return 'team1'
        }
        if (participantUserIds.team2 && currentUserId === participantUserIds.team2) {
          return 'team2'
        }
        if (state.team1.participantId === currentUserId) {
          return 'team1'
        }
        if (state.team2.participantId === currentUserId) {
          return 'team2'
        }
        // Team tournaments
        if (userTeamIds.includes(state.team1.participantId || '')) {
          return 'team1'
        }
        if (userTeamIds.includes(state.team2.participantId || '')) {
          return 'team2'
        }
      }

      return null
    },
    [state, userTeamIds, currentUserId, teamMemberships, participantUserIds],
  )

  // Helper to check if user has admin role in organization
  const isUserAdmin = useCallback(
    (userId: string) => {
      const role = userRoles[userId]
      return (
        role === 'Founder' || role === 'Admin' || role === 'Bracket Manager' || role === 'Moderator'
      )
    },
    [userRoles],
  )

  return {
    state,
    isLoading,
    error,
    messages,
    sendMessage,
    typingUsers,
    emitTyping,
    emitStopTyping,
    getUsername,
    getUserTeam,
    isUserAdmin,
  }
}

export default useMatchProfile
