'use client'
import Image from 'next/image'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/SelectBracket'
import TeamModal from '@/components/team/TeamModal'
import { getBracketById } from '@/services/bracketService'
import { getSocket, initializeSocket } from '@/hooks/socket'
import { setScore, swapParticipants } from '@/services/matchService'
import ScoreModal from '@/components/ui/matchListModal/scoreModal'

interface Player {
  id: string
  name: string
  avatar: string
  score: number
}

interface Match {
  id: string
  player1: Player
  player2: Player
  // raw participant ids (could be user or team ids) for API operations
  participantAId?: string
  participantBId?: string
  date: string
  time: string
  status: 'Starting' | 'To be started' | 'In Progress' | 'Completed' | 'Upcoming'
}

interface Phase {
  id: string
  name: string
  matches: Match[]
}

interface BracketPhases {
  winners: Phase[]
  losers: Phase[]
}

interface StaffMemberLike {
  user: string | { _id?: string; id?: string } | null | undefined
  role?: string
}

interface TournamentBracketsDemoProps {
  tournament: {
    bracket: string
    looserBracket: string
    name?: string
    phases?: BracketPhases
    winner?: string | { $oid?: string } | { _id?: string } | null
    staff?: StaffMemberLike[] // injected from server page if available
    participants?: Array<{
      _id?: string | { $oid?: string }
      team?: string | { _id?: string; $oid?: string }
      teamMembers?: Array<string | { $oid?: string; _id?: string }>
      substituteMembers?: Array<string | { $oid?: string; _id?: string }>
    }>
  }
}

const TournamentBracketsDemo: React.FC<TournamentBracketsDemoProps> = ({ tournament }) => {
  const { data: session, status } = useSession()
  const [phases, setPhases] = useState<BracketPhases>({ winners: [], losers: [] })
  // loading & error kept for future UI feedback (currently unused)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [scrollingAllowed, setScrollingAllowed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeBracket, setActiveBracket] = useState<'winners' | 'losers' | 'both'>('winners')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [winner, setWinner] = useState<Player | null>(null)
  // Score edit & swap states
  const [swapMode, setSwapMode] = useState(false)
  const [firstSwap, setFirstSwap] = useState<{ matchId: string; participantId: string } | null>(
    null,
  )
  // Team modal state
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [mainRosterMembers, setMainRosterMembers] = useState<any[]>([])
  const [substituteRosterMembers, setSubstituteRosterMembers] = useState<any[]>([])
  // Permission: user must be in tournament.staff (or injected staff) with role Founder/Admin/Bracket Manager
  const canManage = useMemo(() => {
    type SessionUser = {
      _id?: string
      id?: string
      userId?: string
      userID?: string
    }
    const sessionUser = (session?.user || {}) as SessionUser
    const sessionUserId =
      sessionUser._id || sessionUser.id || sessionUser.userId || sessionUser.userID || ''
    if (!sessionUserId) {
      return false
    }
    const staffList: StaffMemberLike[] = Array.isArray(tournament.staff)
      ? (tournament.staff as StaffMemberLike[])
      : []
    if (!staffList.length) {
      return false
    }
    const allowed = new Set(['founder', 'admin', 'bracket manager', 'moderator'])
    return staffList.some(member => {
      if (!member) {
        return false
      }
      const rawUser = member.user as { _id?: string; id?: string } | string | null | undefined
      const staffUserId =
        typeof rawUser === 'string'
          ? rawUser
          : rawUser?._id || (rawUser as { id?: string })?.id || undefined
      if (!staffUserId) {
        return false
      }
      const role = (member.role || '').toLowerCase().trim()
      return staffUserId === sessionUserId && allowed.has(role)
    })
  }, [session?.user, tournament.staff])
  // Score modal state
  const [scoreModalOpen, setScoreModalOpen] = useState(false)
  const [scoreMatch, setScoreMatch] = useState<Match | null>(null)
  const [scoreTeam1, setScoreTeam1] = useState(0)
  const [scoreTeam2, setScoreTeam2] = useState(0)
  // submittingScore state removed (unused)
  // Socket state not required; we join rooms on connect

  // Types and helpers for processing backend data
  type UnknownRecord = Record<string, unknown>
  type IdLike = string | { $oid?: string; _id?: string; id?: string }
  type ParticipantEntity = UnknownRecord & {
    _id?: string
    nickname?: string
    fullname?: string
    username?: string
    name?: string
    avatar?: string
    profileImage?: string
  }
  type ParticipantRef =
    | { user?: ParticipantEntity; team?: ParticipantEntity }
    | ParticipantEntity
    | IdLike
  interface BackendScore {
    participant: IdLike | UnknownRecord
    score: number
  }
  interface BackendMatch {
    _id?: string
    id?: string
    participantA?: ParticipantRef
    participantB?: ParticipantRef
    scores?: BackendScore[]
    scheduledAt?: string | number | Date
    createdAt?: string | number | Date
    status?: Match['status']
  }
  interface BackendRound {
    number?: number
    roundNumber?: number
    position?: number
    matches?: BackendMatch[]
    _id?: string
  }
  interface BackendBracket {
    _id?: string
    rounds?: BackendRound[]
  }

  // helpers defined inside processBracketData to keep hook deps stable

  // Transform backend bracket doc into phases for UI
  const processBracketData = useCallback((bracketData: unknown): Phase[] => {
    const isObject = (value: unknown): value is UnknownRecord =>
      typeof value === 'object' && value !== null

    const extractId = (val: unknown): string | undefined => {
      if (typeof val === 'string') {
        return val
      }
      if (isObject(val)) {
        const anyId = ((val as UnknownRecord).$oid ??
          (val as UnknownRecord)._id ??
          (val as UnknownRecord).id) as unknown
        if (typeof anyId === 'string') {
          return anyId
        }
      }
      return undefined
    }

    const getPhaseNameFromNumber = (roundNumber: number, totalRounds: number): string => {
      if (totalRounds === 1) {
        return 'Finals'
      }
      if (roundNumber === totalRounds) {
        return 'Finals'
      }
      if (roundNumber === totalRounds - 1) {
        return 'Semi Finals'
      }
      if (roundNumber === totalRounds - 2) {
        return 'Quarter Finals'
      }
      return `Round ${roundNumber}`
    }

    const bd = bracketData as BackendBracket | null
    if (!bd || !Array.isArray(bd.rounds)) {
      return []
    }

    const roundsSorted = [...bd.rounds].sort((a: BackendRound, b: BackendRound) => {
      const aNum = a.number ?? a.roundNumber ?? a.position ?? 0
      const bNum = b.number ?? b.roundNumber ?? b.position ?? 0
      return aNum - bNum
    })

    const phasesBuilt: Phase[] = roundsSorted.map((round: BackendRound, idx: number) => {
      const total = roundsSorted.length
      const name = getPhaseNameFromNumber(idx + 1, total)

      const rMatches = round.matches ?? []
      const matches: Match[] = rMatches.map((match: BackendMatch) => {
        const pickEntity = (ref?: ParticipantRef): ParticipantEntity | undefined => {
          if (!ref) {
            return undefined
          }
          if (isObject(ref) && ('user' in ref || 'team' in ref)) {
            const obj = ref as { user?: ParticipantEntity; team?: ParticipantEntity }
            return obj.user ?? obj.team
          }
          return isObject(ref) ? (ref as ParticipantEntity) : undefined
        }

        const participantA = pickEntity(match.participantA)
        const participantB = pickEntity(match.participantB)
        const participantAId = extractId(match.participantA) || participantA?._id || 'TBD'
        const participantBId = extractId(match.participantB) || participantB?._id || 'TBD'

        const getParticipantId = (ref?: ParticipantRef): string | undefined => {
          if (!ref) {
            return undefined
          }
          if (typeof ref === 'string') {
            return ref
          }
          if (isObject(ref)) {
            const obj = ref as UnknownRecord
            const anyId = (obj.$oid ?? obj._id ?? obj.id) as unknown
            if (typeof anyId === 'string') {
              return anyId
            }
          }
          return undefined
        }

        const findScore = (participantRef?: ParticipantRef): number => {
          const pid = getParticipantId(participantRef)
          const scoresArr = match.scores ?? []
          const entry = scoresArr.find(s => {
            const sp = s.participant
            let sid: string | undefined
            if (typeof sp === 'string') {
              sid = sp
            } else if (isObject(sp)) {
              const spObj = sp as UnknownRecord
              const v = (spObj.$oid ?? spObj._id ?? spObj.id) as unknown
              sid = typeof v === 'string' ? v : undefined
            }
            return sid && pid && String(sid) === String(pid)
          })
          return entry?.score ?? 0
        }

        const player1Name =
          (participantA?.nickname as string | undefined) ||
          (participantA?.fullname as string | undefined) ||
          (participantA?.username as string | undefined) ||
          (participantA?.name as string | undefined) ||
          'TBD'
        const player1Avatar =
          (participantA?.avatar as string | undefined) ||
          (participantA?.profileImage as string | undefined) ||
          '/assets/organization/default_org_icon.jpg'
        const player1: Player =
          participantA && typeof participantA === 'object'
            ? {
                id: String(participantAId),
                name: player1Name,
                avatar: player1Avatar,
                score: findScore(match.participantA),
              }
            : {
                id: 'TBD',
                name: 'TBD',
                avatar: '/assets/organization/default_org_icon.jpg',
                score: 0,
              }

        const player2Name =
          (participantB?.nickname as string | undefined) ||
          (participantB?.fullname as string | undefined) ||
          (participantB?.username as string | undefined) ||
          (participantB?.name as string | undefined) ||
          'TBD'
        const player2Avatar =
          (participantB?.avatar as string | undefined) ||
          (participantB?.profileImage as string | undefined) ||
          '/assets/organization/default_org_icon.jpg'
        const player2: Player =
          participantB && typeof participantB === 'object'
            ? {
                id: String(participantBId),
                name: player2Name,
                avatar: player2Avatar,
                score: findScore(match.participantB),
              }
            : {
                id: 'TBD',
                name: 'TBD',
                avatar: '/assets/organization/default_org_icon.jpg',
                score: 0,
              }

        const created = match.scheduledAt || match.createdAt
        return {
          id: (match._id as string | undefined) || (match.id as string | undefined) || `${idx}`,
          player1,
          // participant ids help with API calls
          participantAId: participantAId !== 'TBD' ? String(participantAId) : undefined,
          participantBId: participantBId !== 'TBD' ? String(participantBId) : undefined,
          player2,
          date: created ? new Date(created).toLocaleDateString() : 'TBD',
          time: created ? new Date(created).toLocaleTimeString() : 'TBD',
          status: match.status || 'To be started',
        }
      })

      return { id: (round._id as string | undefined) || String(idx), name, matches }
    })

    return phasesBuilt
  }, [])

  // ✅ SOCKET SETUP
  useEffect(() => {
    if (status === 'loading') {
      return
    }

    // Even unauthenticated users can view public bracket data

    try {
      initializeSocket(session?.user?._id ?? 'public')
      const socket = getSocket()

      function onConnect() {
        // join the live bracket room(s)
        if (tournament.bracket) {
          socket.emit('consult-bracket', { bracketId: tournament.bracket })
        }
        if (tournament.looserBracket) {
          socket.emit('consult-bracket', { bracketId: tournament.looserBracket })
        }
      }

      function onDisconnect() {}

      socket.on('connect', onConnect)
      socket.on('disconnect', onDisconnect)

      socket.on('connected-bracket', (_msg: unknown) => {})

      socket.on('update-bracket', (updatedBracket: unknown) => {
        try {
          const ub = updatedBracket as { _id?: string; rounds?: unknown[] } | null
          const transform = (br: unknown) => processBracketData(br)
          if (ub && ub._id) {
            if (tournament.bracket && ub._id === tournament.bracket) {
              setPhases(prev => ({ ...prev, winners: transform(ub) }))
            } else if (tournament.looserBracket && ub._id === tournament.looserBracket) {
              setPhases(prev => ({ ...prev, losers: transform(ub) }))
            } else if (ub.rounds && Array.isArray(ub.rounds)) {
              setPhases(prev => ({ ...prev, winners: transform(ub) }))
            }
          }
        } catch {
          // ignore malformed updates
        }
      })

      return () => {
        socket.off('connect', onConnect)
        socket.off('disconnect', onDisconnect)
        socket.off('connected-bracket')
        socket.off('update-bracket')
      }
    } catch {
      setLoading(false)
    }
  }, [status, session?.user?._id, tournament.bracket, tournament.looserBracket, processBracketData])

  // Fetch bracket data by ids and build phases (fallback to props if already provided)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)

        let winners: Phase[] = []
        let losers: Phase[] = []

        if (tournament.bracket) {
          const res = await getBracketById(tournament.bracket)
          const br = res?.bracket || res
          winners = processBracketData(br)
        }
        if (tournament.looserBracket) {
          try {
            const resL = await getBracketById(tournament.looserBracket)
            const brL = resL?.bracket || resL
            losers = processBracketData(brL)
          } catch {
            // ignore if losers bracket not present
          }
        }

        // If server provided phases in props, prefer them when non-empty
        const provided = tournament.phases
        const providedCount = (provided?.winners?.length || 0) + (provided?.losers?.length || 0)
        const hasProvided = providedCount > 0

        if (hasProvided && provided) {
          setPhases(provided as BracketPhases)
        } else {
          setPhases({ winners, losers })
        }

        // --- determine if we truly have a losers bracket (double elimination) ---
        const losersHasMatches =
          (losers?.some(ph => (ph.matches?.length || 0) > 0) ||
            provided?.losers?.some(ph => (ph.matches?.length || 0) > 0)) ??
          false
        const hasLosersBracket = Boolean(tournament.looserBracket) && losersHasMatches

        // If we thought we might have double elim but there's no losers data, force winners view
        if (!hasLosersBracket) {
          setActiveBracket('winners')
        } else {
          // If double elim, default to both only once (first load)
          setActiveBracket(prev => (prev === 'winners' ? 'both' : prev))
        }
        const rawWinner = tournament.winner as unknown
        let winnerId: string | undefined
        if (rawWinner) {
          if (typeof rawWinner === 'string') {
            winnerId = rawWinner
          } else if (
            typeof rawWinner === 'object' &&
            rawWinner !== null &&
            ('$oid' in (rawWinner as Record<string, unknown>) ||
              '_id' in (rawWinner as Record<string, unknown>))
          ) {
            const obj = rawWinner as { $oid?: unknown; _id?: unknown }
            winnerId =
              (typeof obj.$oid === 'string' && obj.$oid) ||
              (typeof obj._id === 'string' && obj._id) ||
              undefined
          }
        }

        // Winner setting strategy:
        // 1. If tournament.winner exists, prefer its corresponding player in final match.
        // 2. For single elimination (no losers data), take last winners phase last match winner.
        // 3. For double elimination without winner field, attempt grand final or last winners phase.
        const searchPlayer = (side: Phase[], id: string): Player | undefined => {
          for (const ph of side) {
            for (const m of ph.matches) {
              if (m.player1.id === id) {
                return m.player1
              }
              if (m.player2.id === id) {
                return m.player2
              }
            }
          }
          return undefined
        }

        const deriveLastWinnersMatch = (): Match | null => {
          if (!winners.length) {
            return null
          }
          for (let i = winners.length - 1; i >= 0; i--) {
            const phase = winners[i]
            if (phase.matches.length) {
              const last = phase.matches[phase.matches.length - 1]
              return last
            }
          }
          return null
        }

        const hasLosers = hasLosersBracket

        if (winnerId) {
          const p = searchPlayer(winners, winnerId) || searchPlayer(losers, winnerId)
          if (p) {
            setWinner(p)
          } else {
            // fallback placeholder if not found yet
            setWinner({
              id: winnerId,
              name: 'Winner',
              avatar: '/assets/organization/default_org_icon.jpg',
              score: 0,
            })
          }
        } else {
          if (!hasLosers) {
            // Single elimination: last match of last winners phase
            const last = deriveLastWinnersMatch()
            if (last && last.player1.score !== last.player2.score) {
              setWinner(last.player1.score > last.player2.score ? last.player1 : last.player2)
            }
          } else {
            // Double elim fallback: try grand final style detection
            const allMatches = [...winners, ...losers].flatMap(ph => ph.matches)
            const finalCandidate = allMatches
              .slice()
              .reverse()
              .find(m => m.player1.score !== m.player2.score && m.status === 'Completed')
            if (finalCandidate) {
              setWinner(
                finalCandidate.player1.score > finalCandidate.player2.score
                  ? finalCandidate.player1
                  : finalCandidate.player2,
              )
            }
          }
        }
      } catch {
        setError('Failed to load bracket data')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [
    tournament.bracket,
    tournament.looserBracket,
    tournament.phases,
    tournament.winner,
    processBracketData,
  ])

  // (moved above)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    },
    [position.x, position.y],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) {
        return
      }
      const newX = e.clientX - startPosition.x
      const newY = e.clientY - startPosition.y
      setPosition({ x: newX, y: newY })
    },
    [isDragging, startPosition.x, startPosition.y],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!scrollingAllowed) {
        return
      }
      e.preventDefault()
      const delta = e.deltaY
      const newScale = Math.min(Math.max(scale - delta * 0.001, 0.5), 2)
      setScale(newScale)

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const scaleChange = newScale - scale
        setPosition(prev => ({
          x: prev.x - (x - prev.x) * (scaleChange / scale),
          y: prev.y - (y - prev.y) * (scaleChange / scale),
        }))
      }
    },
    [scale, scrollingAllowed],
  )

  useEffect(() => {
    const handleMouseEnter = () => {
      document.body.style.overflow = 'hidden'
      setScrollingAllowed(true)
    }

    const handleMouseLeave = () => {
      document.body.style.overflow = ''
      setScrollingAllowed(false)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  useEffect(() => {
    const handleMouseLeave = () => setIsDragging(false)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseUp])

  const isMatchHighlighted = useCallback(
    (match: Match) => {
      return (
        hoveredPlayer === null ||
        match.player1.id === hoveredPlayer ||
        match.player2.id === hoveredPlayer
      )
    },
    [hoveredPlayer],
  )

  const handleReset = useCallback(() => {
    setHoveredPlayer(null)
    setPosition({ x: 0, y: 0 })
    setScale(1)
  }, [])

  const handleBracketChange = (value: string) => {
    // Helper to sanitize team image

    if (!hasLosersBracket && value !== 'winners') {
      setActiveBracket('winners')
      return
    }
    setActiveBracket(value as 'winners' | 'losers' | 'both')
  }

  const openScoreModal = (match: Match) => {
    setScoreMatch(match)
    setScoreTeam1(match.player1.score)
    setScoreTeam2(match.player2.score)
    setScoreModalOpen(true)
  }

  const submitScoreModal = async () => {
    if (!scoreMatch) {
      return
    }
    if (!scoreMatch.participantAId || !scoreMatch.participantBId) {
      toast.error('Missing participant ids')
      return
    }
    try {
      await setScore(scoreMatch.id, scoreMatch.participantAId, scoreTeam1)
      await setScore(scoreMatch.id, scoreMatch.participantBId, scoreTeam2)
      // optimistic update
      setPhases(prev => {
        const clone: BracketPhases = {
          winners: prev.winners.map(r => ({ ...r, matches: r.matches.map(m => ({ ...m })) })),
          losers: prev.losers.map(r => ({ ...r, matches: r.matches.map(m => ({ ...m })) })),
        }
        const updateSide = (side: Phase[]) => {
          for (const phase of side) {
            for (const m of phase.matches) {
              if (m.id === scoreMatch.id) {
                if (m.participantAId === scoreMatch.participantAId) {
                  m.player1 = { ...m.player1, score: scoreTeam1 }
                }
                if (m.participantBId === scoreMatch.participantBId) {
                  m.player2 = { ...m.player2, score: scoreTeam2 }
                }
                return
              }
            }
          }
        }
        updateSide(clone.winners)
        updateSide(clone.losers)
        return clone
      })
      toast.success('Scores updated')
      setScoreModalOpen(false)
      setScoreMatch(null)
    } catch {
      toast.error('Failed to update scores')
    }
  }

  const toggleSwapMode = () => {
    if (!canManage) {
      return
    }
    setSwapMode(m => !m)
    setFirstSwap(null)
  }

  const handleParticipantSelectForSwap = useCallback(
    async (match: Match, participantId?: string) => {
      if (!swapMode || !participantId) {
        return
      }
      if (!firstSwap) {
        setFirstSwap({ matchId: match.id, participantId })
        return
      }
      if (firstSwap.matchId === match.id) {
        toast.error('Select a participant from a different match')
        return
      }
      // locate both matches and ensure same phase
      const findPhaseContaining = (
        mId: string,
      ): { side: 'winners' | 'losers'; index: number } | null => {
        for (let i = 0; i < phases.winners.length; i++) {
          if (phases.winners[i].matches.some(m => m.id === mId)) {
            return { side: 'winners', index: i }
          }
        }
        for (let i = 0; i < phases.losers.length; i++) {
          if (phases.losers[i].matches.some(m => m.id === mId)) {
            return { side: 'losers', index: i }
          }
        }
        return null
      }
      const phaseA = findPhaseContaining(firstSwap.matchId)
      const phaseB = findPhaseContaining(match.id)
      if (!phaseA || !phaseB || phaseA.side !== phaseB.side || phaseA.index !== phaseB.index) {
        toast.error('Swap allowed only within the same round')
        return
      }
      if (firstSwap.participantId === participantId) {
        toast.error('Cannot swap the same participant')
        return
      }
      try {
        await swapParticipants(firstSwap.participantId, participantId, firstSwap.matchId, match.id)
        toast.success('Participants swapped')
        // authoritative reload
        try {
          if (tournament.bracket) {
            const res = await getBracketById(tournament.bracket)
            const br = res?.bracket || res
            const winners = processBracketData(br)
            let losers: Phase[] = []
            if (tournament.looserBracket) {
              try {
                const resL = await getBracketById(tournament.looserBracket)
                const brL = resL?.bracket || resL
                losers = processBracketData(brL)
              } catch {
                // ignore losers bracket fetch failure
              }
            }
            setPhases({ winners, losers })
          }
        } catch {
          // silent
        }
      } catch {
        toast.error('Failed to swap participants')
      } finally {
        setFirstSwap(null)
        setSwapMode(false)
      }
    },
    [swapMode, firstSwap, phases, tournament.bracket, tournament.looserBracket, processBracketData],
  )
  const teamImageSanitizer = (img: string) => img || ''
  const getValidImageSrc = (img: string | undefined) => img || ''

  // Show team modal for participant, fetch full team details if needed
  const handleParticipantClick = useCallback(
    async (player: any) => {
      if (swapMode) {
        return
      }

      // First, find the participant record using participantId
      const participantId = player?.participantId || player?.id
      if (!participantId) {
        return
      }

      const participantRecord = tournament.participants?.find((p: any) => {
        const pid = typeof p._id === 'string' ? p._id : p._id?.$oid
        return pid === participantId
      })

      if (!participantRecord || !participantRecord.team) {
        return
      }

      // Extract team ID exactly like TournamentOverview does
      const teamId =
        typeof participantRecord.team === 'string'
          ? participantRecord.team
          : participantRecord.team?._id

      if (!teamId) {
        return
      }

      const mainIds = [...(participantRecord.teamMembers || [])]
      const subIds = [...(participantRecord.substituteMembers || [])]

      try {
        const { getTeamById } = await import('@/services/teamService')
        const teamData = await getTeamById(teamId)
        setSelectedTeam(teamData)

        // Group members exactly like TournamentOverview
        const allMembers: any[] = []

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
      } catch {
        // silently handle errors
      }
    },
    [swapMode, tournament.participants],
  )
  const hasLosersBracket = phases.losers.some(p => p.matches.length > 0)
  const toggleFullscreen = () => setIsFullscreen(f => !f)

  return (
    <div
      className={`h-full bg-defendrBg text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* ephemeral states touched to satisfy linter until UI surface added */}
      {false && (loading || error)}
      <div className="flex justify-between items-center p-4 border-b border-defendrGrey">
        <h1 className="text-xl font-poppins text-white">
          {hasLosersBracket
            ? activeBracket === 'winners'
              ? "Winner's Bracket"
              : activeBracket === 'losers'
                ? "Loser's Bracket"
                : 'Tournament Brackets'
            : 'Tournament Bracket'}
        </h1>
        <div className="flex items-center gap-3">
          {hasLosersBracket && (
            <Select value={activeBracket} onValueChange={handleBracketChange}>
              <SelectTrigger className="w-[180px] bg-defendrLightBlack border-defendrRed text-white text-sm">
                <SelectValue placeholder="Select bracket" />
              </SelectTrigger>
              <SelectContent className="bg-defendrLightBlack border-defendrRed">
                <SelectItem className="text-white hover:bg-defendrRed text-sm" value="winners">
                  Winner's bracket
                </SelectItem>
                <SelectItem className="text-white hover:bg-defendrRed text-sm" value="losers">
                  Loser's bracket
                </SelectItem>
                <SelectItem className="text-white hover:bg-defendrRed text-sm" value="both">
                  Both Brackets
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          <button
            className="bg-defendrRed hover:bg-defendrRed/80 rounded-lg px-3 py-1.5 text-white font-poppins text-sm transition-colors flex items-center gap-2"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                    fillRule="evenodd"
                  />
                </svg>
                Exit Fullscreen
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                    fillRule="evenodd"
                  />
                </svg>
                Fullscreen
              </>
            )}
          </button>
          <button
            className="bg-defendrRed hover:bg-defendrRed/80 rounded-lg px-3 py-1.5 text-white font-poppins text-sm transition-colors"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        aria-label="Tournament bracket"
        className="flex-1 overflow-hidden relative bg-defendrBg border border-defendrGrey rounded-lg m-4"
        role="region"
        style={{ height: 'calc(100vh - 200px)' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute origin-top-left w-full h-full"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {hasLosersBracket && activeBracket === 'both' ? (
            <div className="p-4">
              <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
                <div className="grid grid-rows-2 gap-12">
                  <div>
                    <h3 className="text-lg font-poppins text-white mb-4">Winners Bracket</h3>
                    <BracketView
                      hoveredPlayer={hoveredPlayer}
                      isMatchHighlighted={isMatchHighlighted}
                      phases={phases.winners}
                      selectedSwap={firstSwap}
                      setHoveredPlayer={setHoveredPlayer}
                      showWinnerPanel={false}
                      swapMode={swapMode}
                      winner={winner}
                      onOpenScoreModal={openScoreModal}
                      onParticipantSelectForSwap={handleParticipantSelectForSwap}
                      onParticipantClick={handleParticipantClick}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-poppins text-white mb-4">Losers Bracket</h3>
                    <BracketView
                      hoveredPlayer={hoveredPlayer}
                      isMatchHighlighted={isMatchHighlighted}
                      phases={phases.losers}
                      selectedSwap={firstSwap}
                      setHoveredPlayer={setHoveredPlayer}
                      showWinnerPanel={false}
                      swapMode={swapMode}
                      winner={null}
                      onOpenScoreModal={openScoreModal}
                      onParticipantSelectForSwap={handleParticipantSelectForSwap}
                      onParticipantClick={handleParticipantClick}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <GrandFinalSection phases={phases} placement="right" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-poppins">
                {canManage && (
                  <button
                    className={`px-3 py-1 rounded border ${swapMode ? 'bg-defendrRed border-defendrRed text-white' : 'border-defendrGrey text-defendrGrey hover:border-defendrRed hover:text-defendrRed'}`}
                    type="button"
                    onClick={toggleSwapMode}
                  >
                    {swapMode ? 'Exit Swap Mode' : 'Swap Mode'}
                  </button>
                )}
                <span className="text-white">
                  {canManage
                    ? 'Click the pen icon to edit scores. Swap mode: select two participants from the same round to swap.'
                    : 'Bracket view (read only).'}
                </span>
                {canManage && firstSwap && swapMode && (
                  <span className="text-defendrRed">
                    First selected. Choose second participant…
                  </span>
                )}
              </div>
              <BracketView
                canManage={canManage}
                hoveredPlayer={hoveredPlayer}
                isMatchHighlighted={isMatchHighlighted}
                phases={
                  activeBracket === 'losers' && hasLosersBracket ? phases.losers : phases.winners
                }
                selectedSwap={firstSwap}
                setHoveredPlayer={setHoveredPlayer}
                swapMode={swapMode}
                winner={activeBracket === 'winners' ? winner : null}
                onOpenScoreModal={openScoreModal}
                onParticipantSelectForSwap={handleParticipantSelectForSwap}
                onParticipantClick={handleParticipantClick}
              />
            </div>
          )}
        </div>
      </div>
      <ScoreModal
        isOpen={scoreModalOpen}
        match={
          scoreMatch
            ? {
                team1: {
                  name: scoreMatch.player1.name || 'Player 1',
                  logo: scoreMatch.player1.avatar,
                },
                team2: {
                  name: scoreMatch.player2.name || 'Player 2',
                  logo: scoreMatch.player2.avatar,
                },
              }
            : null
        }
        setTeam1Score={setScoreTeam1}
        setTeam2Score={setScoreTeam2}
        team1Score={scoreTeam1}
        team2Score={scoreTeam2}
        onClose={() => setScoreModalOpen(false)}
        onSubmit={submitScoreModal}
      />
      <TeamModal
        show={showTeamModal}
        team={selectedTeam}
        teamMembers={teamMembers}
        mainRosterMembers={mainRosterMembers}
        substituteRosterMembers={substituteRosterMembers}
        onClose={() => setShowTeamModal(false)}
        onViewProfile={teamId => setShowTeamModal(false)}
        teamImageSanitizer={teamImageSanitizer}
        getValidImageSrc={getValidImageSrc}
      />
    </div>
  )
}

interface BracketViewProps {
  phases: Phase[]
  hoveredPlayer: string | null
  setHoveredPlayer: (playerId: string | null) => void
  isMatchHighlighted: (match: Match) => boolean
  winner: Player | null
  showWinnerPanel?: boolean
  swapMode: boolean
  onParticipantSelectForSwap: (match: Match, participantId?: string) => void
  selectedSwap: { matchId: string; participantId: string } | null
  onOpenScoreModal: (match: Match) => void
  canManage?: boolean
  onParticipantClick?: (participant: any) => void
}

const BracketView: React.FC<BracketViewProps> = ({
  phases,
  setHoveredPlayer,
  isMatchHighlighted,
  winner,
  showWinnerPanel = true,
  onOpenScoreModal,
  swapMode,
  onParticipantSelectForSwap,
  selectedSwap,
  canManage = false,
  onParticipantClick,
}) => {
  // Arrows temporarily disabled

  return (
    <div className="flex items-center justify-start gap-16 p-4 relative min-h-[500px]">
      {phases?.map((phase: Phase, phaseIndex: number) => (
        <div key={phase.id} className="flex flex-col items-center relative">
          {/* Phase matches */}
          <div className="flex flex-col gap-24 items-center">
            {phase.matches.map((match: Match, matchIndex: number) => (
              <div key={match.id} className="relative">
                <MatchCard
                  canManage={canManage}
                  isHighlighted={isMatchHighlighted(match)}
                  match={match}
                  matchIndex={matchIndex}
                  phaseIndex={phaseIndex}
                  selectedSwap={selectedSwap}
                  swapMode={swapMode}
                  onOpenScoreModal={onOpenScoreModal}
                  onParticipantSelectForSwap={onParticipantSelectForSwap}
                  onPlayerHover={setHoveredPlayer}
                  onParticipantClick={onParticipantClick}
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="text-white font-poppins text-sm text-center">{phase.name}</h4>
          </div>
        </div>
      ))}

      {winner && showWinnerPanel && (
        <div
          className="flex flex-col items-center justify-center bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4 min-w-[200px]"
          id="winner-display"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="text-yellow-500 text-2xl">🏆</div>
            <Image
              unoptimized
              alt={winner.name}
              className="rounded-full object-cover"
              height={40}
              src={winner.avatar}
              width={40}
            />
          </div>
          <h3 className="text-yellow-500 font-poppins text-lg text-center">WINNER</h3>
          <p className="text-white font-poppins text-sm text-center mt-1">{winner.name}</p>
        </div>
      )}

      {/* connectors disabled */}
    </div>
  )
}

interface MatchCardProps {
  match: Match
  isHighlighted: boolean
  onPlayerHover: (playerId: string | null) => void
  phaseIndex: number
  matchIndex: number
  swapMode: boolean
  onParticipantSelectForSwap: (match: Match, participantId?: string) => void
  selectedSwap: { matchId: string; participantId: string } | null
  onOpenScoreModal: (match: Match) => void
  canManage?: boolean
  onParticipantClick?: (participant: any) => void
}

const MatchCard: React.FC<MatchCardProps> = React.memo(
  ({
    match,
    isHighlighted,
    onPlayerHover,
    onOpenScoreModal,
    swapMode,
    onParticipantSelectForSwap,
    selectedSwap,
    canManage = false,
    onParticipantClick,
  }) => {
    const isPlayer1Winner = match.player1.score > match.player2.score
    const isPlayer2Winner = match.player2.score > match.player1.score

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Starting':
          return 'bg-green-500'
        case 'To be started':
          return 'bg-blue-500'
        case 'In Progress':
          return 'bg-orange-500'
        case 'Completed':
          return 'bg-gray-500'
        case 'Upcoming':
          return 'bg-purple-500'
        default:
          return 'bg-gray-500'
      }
    }

    // Helper to navigate to team profile if id is valid
    const handleTeamClick = () => {
      // Disable navigation while swapping participants
      if (swapMode) {
        return
      }
    }
    return (
      <div
        className={`bg-defendrLightBlack border border-defendrGrey rounded-lg p-3 w-72 transition-all duration-300 relative ${
          isHighlighted ? '' : 'opacity-30 blur-[1px]'
        }`}
        id={`match-${match.id}`}
      >
        <div className="absolute -top-2 -left-2">
          <span
            className={`${getStatusColor(match.status)} text-white px-2 py-1 rounded text-xs font-poppins`}
          >
            {match.status}
          </span>
        </div>

        <div
          className={`flex items-center justify-between p-2 rounded-lg mb-2 cursor-pointer transition-colors relative ${
            isPlayer1Winner
              ? 'bg-defendrRed/20 border border-defendrRed'
              : 'bg-defendrBg hover:bg-defendrGrey/20'
          } ${swapMode && selectedSwap?.participantId === match.participantAId ? 'ring-2 ring-defendrRed' : ''}`}
          onClick={() => {
            if (swapMode) {
              onParticipantSelectForSwap(match, match.participantAId)
            } else if (onParticipantClick) {
              onParticipantClick({ ...match.player1, participantId: match.participantAId })
            }
          }}
          onMouseEnter={() => onPlayerHover(match.player1.id)}
          onMouseLeave={() => onPlayerHover(null)}
        >
          <div
            className="flex items-center gap-2 flex-1 min-w-0"
            onClick={e => {
              if (swapMode) {
                // allow parent div onClick to capture selection for swap
                return
              }
              e.stopPropagation()
              if (onParticipantClick) {
                onParticipantClick({ ...match.player1, participantId: match.participantAId })
              }
            }}
          >
            <Image
              unoptimized
              alt={match.player1.name}
              className="rounded-full object-cover flex-shrink-0"
              height={20}
              src={match.player1.avatar}
              width={20}
            />
            <span className="text-white font-poppins text-xs truncate underline">
              {match.player1.name}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`font-bold text-lg min-w-[20px] text-center ${isPlayer1Winner ? 'text-defendrRed' : 'text-white'}`}
            >
              {match.player1.score}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center py-2 relative">
          <span className="text-white font-poppins text-sm font-bold">VS</span>
          {canManage && !swapMode && (
            <button
              aria-label="Edit score"
              className="ml-auto absolute right-1 top-1/2 -translate-y-[60%] text-defendrGrey hover:text-defendrRed transition-colors bg-defendrBg/60 backdrop-blur-sm rounded p-1 flex items-center justify-center"
              type="button"
              onClick={e => {
                e.stopPropagation()
                onOpenScoreModal(match)
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>

        <div
          className={`flex items-center justify-between p-2 rounded-lg mb-2 cursor-pointer transition-colors relative ${
            isPlayer2Winner
              ? 'bg-defendrRed/20 border border-defendrRed'
              : 'bg-defendrBg hover:bg-defendrGrey/20'
          } ${swapMode && selectedSwap?.participantId === match.participantBId ? 'ring-2 ring-defendrRed' : ''}`}
          onClick={() => {
            if (swapMode) {
              onParticipantSelectForSwap(match, match.participantBId)
            } else if (onParticipantClick) {
              onParticipantClick({ ...match.player2, participantId: match.participantBId })
            }
          }}
          onMouseEnter={() => onPlayerHover(match.player2.id)}
          onMouseLeave={() => onPlayerHover(null)}
        >
          <div
            className="flex items-center gap-2 flex-1 min-w-0"
            onClick={e => {
              if (swapMode) {
                return
              }
              e.stopPropagation()
              if (onParticipantClick) {
                onParticipantClick({ ...match.player2, participantId: match.participantBId })
              }
            }}
          >
            <Image
              unoptimized
              alt={match.player2.name}
              className="rounded-full object-cover flex-shrink-0"
              height={20}
              src={match.player2.avatar}
              width={20}
            />
            <span className="text-white font-poppins text-xs truncate underline">
              {match.player2.name}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`font-bold text-lg min-w-[20px] text-center ${isPlayer2Winner ? 'text-defendrRed' : 'text-white'}`}
            >
              {match.player2.score}
            </span>
          </div>
        </div>

        {/* Pen moved into VS row above for perfect vertical alignment */}

        <div className="text-xs text-white text-center font-poppins mt-2">
          {match.date && match.time ? `${match.date} - ${match.time}` : 'TBD'}
        </div>
      </div>
    )
  },
)

MatchCard.displayName = 'MatchCard'

export default TournamentBracketsDemo

// --- Grand Final (computed) ---

const GrandFinalSection: React.FC<{
  phases: BracketPhases
  placement?: 'between' | 'below' | 'right'
}> = ({ phases, placement = 'below' }) => {
  // Helper to get champion from last non-empty phase on a side
  const getChampion = (sidePhases: Phase[]): Player | null => {
    const nonEmpty = sidePhases.filter(p => p.matches && p.matches.length > 0)
    if (nonEmpty.length === 0) {
      return null
    }
    const last = nonEmpty[nonEmpty.length - 1]
    const final = last.matches[0]
    if (!final) {
      return null
    }
    if (final.player1.score !== final.player2.score) {
      return final.player1.score > final.player2.score ? final.player1 : final.player2
    }
    // No decided scores yet; return a placeholder with identities if available
    return null
  }

  const winnerChamp = getChampion(phases.winners)
  const loserChamp = getChampion(phases.losers)

  // Try to find an existing match that pits these two players (if backend created a GF)
  let gfMatch: Match | null = null
  if (winnerChamp && loserChamp) {
    const allMatches = [...phases.winners, ...phases.losers].flatMap(p => p.matches || [])
    const setIds = new Set([winnerChamp.id, loserChamp.id])
    gfMatch =
      allMatches.find(m => {
        const s = new Set([m.player1.id, m.player2.id])
        return s.size === setIds.size && [...s].every(id => setIds.has(id))
      }) || null
  }

  if (!winnerChamp && !loserChamp) {
    return null
  }

  return (
    <div className={`${placement === 'between' ? 'mt-0' : 'mt-8'} relative`}>
      <h3 className="text-lg font-poppins text-white mb-4">Grand Final</h3>
      <div className="flex items-center gap-8">
        {gfMatch ? (
          <MatchCard
            // highlight by default in GF block
            isHighlighted
            canManage={false}
            match={gfMatch}
            matchIndex={0}
            phaseIndex={0}
            selectedSwap={null}
            swapMode={false}
            onOpenScoreModal={() => {}}
            onParticipantSelectForSwap={() => {}}
            onPlayerHover={() => {}}
          />
        ) : (
          <div
            className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-4 w-80"
            id="grand-final-card"
          >
            <div className="text-center text-white font-poppins text-sm mb-2">
              Awaiting finalists
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg mb-2 bg-defendrBg">
              <div className="text-white font-poppins text-xs truncate">
                {winnerChamp ? winnerChamp.name : 'Winners Bracket Champion'}
              </div>
              <div className="text-white font-bold">0</div>
            </div>
            <div className="flex items-center justify-center py-2">
              <span className="text-white font-poppins text-sm font-bold">VS</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-defendrBg">
              <div className="text-white font-poppins text-xs truncate">
                {loserChamp ? loserChamp.name : 'Losers Bracket Champion'}
              </div>
              <div className="text-white font-bold">0</div>
            </div>
          </div>
        )}
      </div>

      {/* Winner panel next to GF when decided */}
      {gfMatch &&
        gfMatch.status === 'Completed' &&
        gfMatch.player1.score !== gfMatch.player2.score && (
          <div
            className="flex flex-col items-center justify-center bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4 min-w-[200px] mt-6"
            id="winner-display"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-yellow-500 text-2xl">🏆</div>
              <Image
                unoptimized
                alt={
                  (gfMatch.player1.score > gfMatch.player2.score
                    ? gfMatch.player1.name
                    : gfMatch.player2.name) || 'Winner'
                }
                className="rounded-full object-cover"
                height={40}
                src={
                  gfMatch.player1.score > gfMatch.player2.score
                    ? gfMatch.player1.avatar
                    : gfMatch.player2.avatar
                }
                width={40}
              />
            </div>
            <h3 className="text-yellow-500 font-poppins text-lg text-center">WINNER</h3>
            <p className="text-white font-poppins text-sm text-center mt-1">
              {gfMatch.player1.score > gfMatch.player2.score
                ? gfMatch.player1.name
                : gfMatch.player2.name}
            </p>
          </div>
        )}

      {/* connectors disabled */}
    </div>
  )
}
