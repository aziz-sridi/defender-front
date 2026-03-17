'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image, { StaticImageData } from 'next/image'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { initSocket, getSocket } from '@/lib/socket'
import { scheduleMatch, setScore, getMatchById, getMatchesByRound } from '@/services/matchService'
import { changeRoundSets } from '@/services/roundService'
import { sendMessageToMatch } from '@/services/messagesService'
import { getBracketById, getBracketByTournamentId } from '@/services/bracketService'
import { getUserById } from '@/services/userService'
import { getParticipantById } from '@/services/participantService'
import { getTournamentById } from '@/services/tournamentService'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import ScoreModal from '@/components/ui/matchListModal/scoreModal'
import MessageModal from '@/components/ui/matchListModal/messageModal'
import Modal from '@/components/ui/Modal'
import FormSelect from '@/components/ui/FormSelect'
import MessageIcon from '@/components/assets/tournament/matchlist/messageIcon.svg'
import ScoreIcon from '@/components/assets/tournament/matchlist/score.svg'
import ScreenshotIcon from '@/components/assets/tournament/matchlist/screenshotIcon.svg'
import ninjaImage from '@/components/assets/tournament/ninja.jpg'
import skullImage from '@/components/assets/tournament/skull.jpg'
import { getTeamById } from '@/services/teamService'

interface Match {
  id: string
  participantAId?: string | null
  participantBId?: string | null
  date?: string
  round?: string
  roundStartDate?: string | null
  roundEndDate?: string | null
  roundStatus?: 'scheduled' | 'in-progress' | 'finished'
  team1: {
    name: string
    logo: string | StaticImageData
    score?: number
  }
  team2: {
    name: string
    logo: string | StaticImageData
    score?: number
  }
  status: 'pending' | 'in-progress' | 'completed'
  isLive?: boolean
}

// NOTE: Removed unused DatabaseMatch interface

interface DatabaseRound {
  _id: string
  bracket: string
  number: number
  matches: string[]
  status: string
  sets: number
}

interface DatabaseBracket {
  _id: string
  tournament: string
  type: string
  rounds: any[]
  swissRound: string | null
  swiss_winners: unknown[]
  participants: unknown[]
  status: string
  consolationRound: string | null
  finalRound: string | null
}

export default function MatchListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [bracket, setBracket] = useState<DatabaseBracket | null>(null)
  // Replace direct localStorage access with state
  const [tournamentId, setTournamentId] = useState<string | null>(null)
  const [rounds, setRounds] = useState<string[]>([])
  const [bracketType, setBracketType] = useState<'winners' | 'losers' | 'grandfinal'>('winners')
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roundsData, setRoundsData] = useState<DatabaseRound[]>([])
  const [activeRound, setActiveRound] = useState('')
  const [scoreModalOpen, setScoreModalOpen] = useState(false)
  const [messageModalOpen, setMessageModalOpen] = useState(false)

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [team1Score, setTeam1Score] = useState(0)
  const [team2Score, setTeam2Score] = useState(0)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Mortals', message: 'Good luck!', time: '10:30' },
    { id: 2, user: 'You', message: 'Thanks, you too!', time: '10:31' },
  ])
  const [matchScheduleModalOpen, setMatchScheduleModalOpen] = useState(false)
  const [roundSetsModalOpen, setRoundSetsModalOpen] = useState(false)
  const [finalScoreModalOpen, setFinalScoreModalOpen] = useState(false)
  // removed unused selectedRound state
  const [scheduleDate, setScheduleDate] = useState('')
  const [roundSets, setRoundSets] = useState<1 | 3 | 5>(1)
  const [finalTeam1Score, setFinalTeam1Score] = useState(0)
  const [finalTeam2Score, setFinalTeam2Score] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // viewMode removed; use bracketType to include 'grandfinal'

  useEffect(() => {
    // Prefer tid in URL, else localStorage
    const tidFromUrl = searchParams?.get('tid')
    const tidFromStorage =
      typeof window !== 'undefined' ? localStorage.getItem('createdTournamentId') : null
    const effectiveTid = tidFromUrl || tidFromStorage
    if (effectiveTid) {
      setTournamentId(effectiveTid)
      // keep localStorage in sync if URL has tid
      if (tidFromUrl) {
        localStorage.setItem('createdTournamentId', tidFromUrl)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (session?.accessToken && tournamentId) {
      void loadBracketData()
    }
  }, [session?.accessToken, tournamentId, bracketType])

  useEffect(() => {
    if (activeRound && bracket && roundsData.length > 0) {
      void loadMatchesForRound(activeRound)
    }
  }, [activeRound, bracket, roundsData])

  // Live updates via socket (must be before any early return to keep hook order stable)
  useEffect(() => {
    const userDetails = session?.user as { _id?: string; id?: string } | undefined
    const userId = userDetails?._id || userDetails?.id
    if (!userId) {
      return
    }
    const sock = initSocket(userId)
    const refresh = () => {
      if (activeRound) {
        loadMatchesForRound(activeRound)
      }
    }
    sock.on('update-bracket', refresh)
    sock.on('updateLiveBracket', refresh)
    sock.on('update-match', refresh)
    sock.on('updateLiveMatch', refresh)
    return () => {
      const s = getSocket()
      s?.off('update-bracket', refresh)
      s?.off('updateLiveBracket', refresh)
      s?.off('update-match', refresh)
      s?.off('updateLiveMatch', refresh)
    }
  }, [session, activeRound])

  if (!tournamentId) {
    return (
      <div className="h-screen bg-defendrBg text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-defendrRed text-xl font-poppins mb-4">No Tournament Found</div>
          <div className="text-defendrGrey">Please create or select a tournament first.</div>
        </div>
      </div>
    )
  }

  const getRoundName = (roundNumber: number, totalRounds: number): string => {
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

  const loadBracketData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // loading bracket data

      let bracketResponse: any = null
      try {
        bracketResponse = await getBracketByTournamentId(tournamentId)
      } catch {
        // primary getBracketByTournamentId failed; will try fallback via tournament -> bracket id
      }

      let bracket = null
      let roundsFromResponse = null

      if (bracketResponse && bracketResponse.brackets && bracketResponse.brackets.length > 0) {
        // Support winners + losers
        if (bracketType === 'losers') {
          const losers = bracketResponse.brackets.find((b: any) =>
            (b?.type || '').toLowerCase().includes('loser'),
          )
          bracket = losers || bracketResponse.brackets[1] || bracketResponse.brackets[0]
        } else {
          const winners = bracketResponse.brackets.find((b: any) =>
            (b?.type || '').toLowerCase().includes('winner'),
          )
          bracket = winners || bracketResponse.brackets[0]
        }
        roundsFromResponse = bracket.rounds
      } else if (bracketResponse && (bracketResponse.bracket || bracketResponse._id)) {
        // Some backends return a single object
        bracket = bracketResponse.bracket || bracketResponse
        roundsFromResponse = bracket.rounds
      }

      // Fallback: fetch tournament, then bracket by id
      if (!bracket) {
        try {
          const t = await getTournamentById(tournamentId)
          const winnerId = t?.bracket
          const loserId = t?.looserBracket || t?.loserBracket
          const chosenId = bracketType === 'losers' ? loserId : winnerId
          if (chosenId) {
            const b = await getBracketById(chosenId)
            if (b) {
              bracket = b
              roundsFromResponse = b.rounds
            }
          }
        } catch {
          // fallback failed
        }
      }

      // extracted bracket and rounds

      if (!bracket) {
        setError(
          `No bracket found for tournament ${tournamentId}. Please generate a bracket first from the Publish page.`,
        )
        return
      }
      setBracket(bracket)

      if (roundsFromResponse && roundsFromResponse.length > 0) {
        const sortedRounds = (roundsFromResponse as DatabaseRound[]).sort(
          (a: DatabaseRound, b: DatabaseRound) => a.number - b.number,
        )

        if (bracketType === 'grandfinal') {
          // Attempt to locate the explicit final round from the bracket, fallback to the last round
          const finalId = (bracket as any)?.finalRound
          const gfRound =
            (finalId && sortedRounds.find(r => r._id === finalId)) ||
            sortedRounds[sortedRounds.length - 1]

          if (gfRound) {
            setRoundsData([gfRound])
            setRounds(['Grand Final'])
            setActiveRound('Grand Final')
          } else {
            // Should not happen, but keep a sensible fallback
            setRoundsData([])
            setRounds([])
            setActiveRound('')
            setError('No Grand Final round found')
          }
        } else {
          setRoundsData(sortedRounds)

          const totalRounds = sortedRounds.length
          const roundNames = sortedRounds.map((round: DatabaseRound) =>
            getRoundName(round.number, totalRounds),
          )

          setRounds(roundNames)

          if (roundNames.length > 0) {
            setActiveRound(roundNames[0])
          }
        }
      } else {
        setError('No rounds found for this bracket')
      }
    } catch {
      setError('Failed to load bracket data. Please check if the tournament has a bracket.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMatchesForRound = async (roundName: string) => {
    if (!bracket || roundsData.length === 0) {
      return
    }

    try {
      const roundIndex = rounds.indexOf(roundName)
      if (roundIndex === -1) {
        return
      }

      const roundData = roundsData[roundIndex]
      if (!roundData) {
        setMatches([])
        return
      }

      let matchesData = []

      try {
        const matchesResponse = await getMatchesByRound(roundData._id)
        if (matchesResponse && Array.isArray(matchesResponse) && matchesResponse.length > 0) {
          matchesData = matchesResponse
        }
      } catch {
        // fallback to individual match fetch below
      }

      if (matchesData.length === 0 && roundData.matches && roundData.matches.length > 0) {
        try {
          const matchIds = roundData.matches
            .map((match: any) => {
              return typeof match === 'string' ? match : match._id || match.id || match.$oid
            })
            .filter(id => id)

          if (matchIds.length > 0) {
            const matchPromises = matchIds.map((matchId: string) => getMatchById(matchId))
            matchesData = await Promise.all(matchPromises)
          }
        } catch {
          // failed to load individual matches
        }
      }

      if (matchesData && matchesData.length > 0) {
        const uiMatches: Match[] = await Promise.all(
          matchesData.map(async (matchResponse: any) => {
            const matchData = matchResponse.match || matchResponse

            const participantAId =
              matchData.participantA?.$oid || matchData.participantA?._id || matchData.participantA
            const participantBId =
              matchData.participantB?.$oid || matchData.participantB?._id || matchData.participantB

            let team1Name = 'TBD'
            let team2Name = 'TBD'
            // default logos (static imports)
            let team1Logo: any = ninjaImage
            let team2Logo: any = skullImage

            try {
              if (participantAId) {
                try {
                  const participantA = await getParticipantById(participantAId)
                  if (participantA && participantA.team) {
                    // Team tournament: show team name and logo
                    const team = await getTeamById(participantA.team)
                    team1Name = team?.name || 'Player A'
                    if (team?.profileImage) {
                      team1Logo = team.profileImage
                    } else if (team?.coverImage) {
                      team1Logo = team.coverImage
                    }
                  } else if (participantA && participantA.user) {
                    // Solo tournament: show user name and avatar
                    const userAId =
                      participantA.user._id || participantA.user.id || participantA.user
                    const userA = await getUserById(userAId)
                    team1Name =
                      userA?.nickname ||
                      userA?.fullname ||
                      userA?.username ||
                      userA?.name ||
                      (userA?.firstName && userA?.lastName
                        ? userA.firstName + ' ' + userA.lastName
                        : null) ||
                      'Player A'
                    if (userA?.profileImage) {
                      team1Logo = userA.profileImage
                    }
                  }
                } catch {
                  team1Name = `Player ${participantAId.substring(participantAId.length - 4)}`
                }
              }

              if (participantBId) {
                try {
                  const participantB = await getParticipantById(participantBId)
                  if (participantB && participantB.team) {
                    const team = await getTeamById(participantB.team)
                    team2Name = team?.name || 'Player B'
                    if (team?.profileImage) {
                      team2Logo = team.profileImage
                    } else if (team?.coverImage) {
                      team2Logo = team.coverImage
                    }
                  } else if (participantB && participantB.user) {
                    const userBId =
                      participantB.user._id || participantB.user.id || participantB.user
                    const userB = await getUserById(userBId)
                    team2Name =
                      userB?.nickname ||
                      userB?.fullname ||
                      userB?.username ||
                      userB?.name ||
                      (userB?.firstName && userB?.lastName
                        ? userB.firstName + ' ' + userB.lastName
                        : null) ||
                      'Player B'
                    if (userB?.profileImage) {
                      team2Logo = userB.profileImage
                    }
                  }
                } catch {
                  team2Name = `Player ${participantBId.substring(participantBId.length - 4)}`
                }
              }
            } catch {
              team1Name = participantAId
                ? `Player ${participantAId.substring(participantAId.length - 4)}`
                : 'TBD'
              team2Name = participantBId
                ? `Player ${participantBId.substring(participantBId.length - 4)}`
                : 'TBD'
            }

            let team1Score = 0
            let team2Score = 0

            if (matchData.scores && Array.isArray(matchData.scores)) {
              const scoreA = matchData.scores.find((s: any) => {
                const scoreParticipantId =
                  s.participant?.$oid || s.participant?._id || s.participant
                return scoreParticipantId === participantAId
              })

              const scoreB = matchData.scores.find((s: any) => {
                const scoreParticipantId =
                  s.participant?.$oid || s.participant?._id || s.participant
                return scoreParticipantId === participantBId
              })

              const a = typeof scoreA?.score === 'number' ? scoreA.score : 0
              const b = typeof scoreB?.score === 'number' ? scoreB.score : 0
              team1Score = a
              team2Score = b
            }

            return {
              id: matchData._id,
              round: roundName,
              // Placeholder round schedule (could be replaced with real round data if available)
              roundStartDate: matchData.roundStartDate || null,
              roundEndDate: matchData.roundEndDate || null,
              roundStatus: (() => {
                // Derive from match status first; fallback to dates if present
                if (matchData.status === 'In Progress') {
                  return 'in-progress'
                }
                if (matchData.status === 'Completed') {
                  return 'finished'
                }
                // If we have dates derive
                const now = Date.now()
                const start = matchData.roundStartDate ? Date.parse(matchData.roundStartDate) : NaN
                const end = matchData.roundEndDate ? Date.parse(matchData.roundEndDate) : NaN
                if (!isNaN(start) && now < start) {
                  return 'scheduled'
                }
                if (!isNaN(start) && !isNaN(end) && now >= start && now <= end) {
                  return 'in-progress'
                }
                if (!isNaN(end) && now > end) {
                  return 'finished'
                }
                return 'scheduled'
              })(),
              participantAId: participantAId || null,
              participantBId: participantBId || null,
              team1: {
                name: team1Name,
                logo: team1Logo,
                score: team1Score,
              },
              team2: {
                name: team2Name,
                logo: team2Logo,
                score: team2Score,
              },
              status:
                matchData.status === 'Not Started'
                  ? 'pending'
                  : matchData.status === 'In Progress'
                    ? 'in-progress'
                    : matchData.status === 'Completed'
                      ? 'completed'
                      : 'pending',
              isLive: matchData.status === 'In Progress',
              date: matchData.createdAt?.$date || matchData.createdAt || new Date().toISOString(),
            }
          }),
        )

        setMatches(uiMatches)
      } else {
        setMatches([])
      }
    } catch {
      setMatches([])
    }
  }

  const handleIconClick = (type: 'score' | 'message' | 'screenshot', match: Match) => {
    setSelectedMatch(match)
    if (type === 'score') {
      // prefill with current scores
      setTeam1Score(match.team1.score || 0)
      setTeam2Score(match.team2.score || 0)
      setScoreModalOpen(true)
    } else if (type === 'message') {
      setMessageModalOpen(true)
    } else if (type === 'screenshot') {
      toast.info('Screenshot action coming soon')
    }
  }
  const handleBarIconClick = (type: 'schedule' | 'roundSets' | 'setScore', _round: string) => {
    if (type === 'schedule') {
      setMatchScheduleModalOpen(true)
    } else if (type === 'roundSets') {
      setRoundSetsModalOpen(true)
    } else if (type === 'setScore') {
      if (!selectedMatch) {
        toast.error('Open a match score panel first')
        return
      }
      setFinalScoreModalOpen(true)
    }
  }

  const handleMatchProfileClick = (match: Match) => {
    router.push(`/tournament/setup/matchProfile?matchId=${match.id}`)
  }

  const handleSetScore = async () => {
    if (!selectedMatch) {
      return
    }

    try {
      setIsSubmitting(true)

      if (!selectedMatch.participantAId || !selectedMatch.participantBId) {
        toast.error('Missing participant IDs for this match')
        return
      }

      await setScore(selectedMatch.id, selectedMatch.participantAId, team1Score)
      await setScore(selectedMatch.id, selectedMatch.participantBId, team2Score)

      toast.success('Scores set successfully')
      setScoreModalOpen(false)
      setTeam1Score(0)
      setTeam2Score(0)
      // auto refresh list
      await loadMatchesForRound(activeRound)
    } catch {
      toast.error('Failed to set scores. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !selectedMatch) {
      return
    }

    try {
      setIsSubmitting(true)

      await sendMessageToMatch(selectedMatch.id, chatMessage)

      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          user: 'You',
          message: chatMessage,
          time: new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ])
      setChatMessage('')

      // message sent
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // duplicate removed below

  const handleScheduleSubmit = async () => {
    if (!scheduleDate) {
      toast.error('Please select a date and time')
      return
    }

    setIsSubmitting(true)
    try {
      const matchId = 'match123'

      await scheduleMatch(matchId, scheduleDate)

      toast.success('Match scheduled successfully')
      setMatchScheduleModalOpen(false)
      setScheduleDate('')
    } catch {
      toast.error('Failed to schedule match. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRoundSetsSubmit = async () => {
    setIsSubmitting(true)
    try {
      // derive current round id from activeRound name
      const roundIndex = rounds.indexOf(activeRound)
      const rd = roundsData[roundIndex]
      if (!rd) {
        toast.error('Could not determine current round')
        return
      }
      await changeRoundSets(rd._id, roundSets)

      toast.success('Round sets updated successfully')
      setRoundSetsModalOpen(false)
      // reload matches for the round
      await loadMatchesForRound(activeRound)
    } catch {
      toast.error('Failed to update round sets. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetScoreSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (!selectedMatch || !selectedMatch.participantAId || !selectedMatch.participantBId) {
        toast.error('Select a match (score icon) before setting final scores')
        return
      }

      await setScore(selectedMatch.id, selectedMatch.participantAId, finalTeam1Score)
      await setScore(selectedMatch.id, selectedMatch.participantBId, finalTeam2Score)

      toast.success('Scores set successfully')
      setFinalScoreModalOpen(false)
      setFinalTeam1Score(0)
      setFinalTeam2Score(0)
      await loadMatchesForRound(activeRound)
    } catch {
      toast.error('Failed to set scores. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Detect double elimination (has losers bracket)

  // Only show Grand Final button if there is a real grand final round
  const hasGrandFinal = Boolean(bracket && bracket.finalRound)
  // Only show Winners if there are rounds
  const hasWinners = rounds && rounds.length > 0

  return (
    <div className="max-w-6xl text-white">
      <h1 className="text-3xl font-bold mb-8 font-poppins">Matchup List</h1>
      <div className="flex gap-2 mb-8">
        {rounds.map(round => (
          <button
            key={round}
            className={`
                px-4 py-2 rounded-full font-poppins text-sm font-medium transition-colors
                ${
                  activeRound === round
                    ? 'bg-defendrRed text-white'
                    : 'bg-defendrLightBlack text-white hover:text-white border border-white/20'
                }
              `}
            onClick={() => setActiveRound(round)}
          >
            {round}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {hasGrandFinal && (
            <button
              className={`px-4 py-2 rounded-full font-poppins text-sm ${
                bracketType === 'losers'
                  ? 'bg-defendrRed text-white'
                  : 'bg-defendrLightBlack text-white border border-white/20'
              }`}
              type="button"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setBracketType('losers')
              }}
            >
              Losers
            </button>
          )}
          {hasWinners && (
            <button
              className={`px-4 py-2 rounded-full font-poppins text-sm ${
                bracketType === 'winners'
                  ? 'bg-defendrRed text-white'
                  : 'bg-defendrLightBlack text-white border border-white/20'
              }`}
              onClick={() => {
                setBracketType('winners')
              }}
            >
              Winners
            </button>
          )}
          {hasGrandFinal && (
            <button
              className={`px-4 py-2 rounded-full font-poppins text-sm ${
                bracketType === 'grandfinal'
                  ? 'bg-defendrRed text-white'
                  : 'bg-defendrLightBlack text-white border border-white/20'
              }`}
              type="button"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setBracketType('grandfinal')
              }}
            >
              Grand Final
            </button>
          )}
        </div>
      </div>

      <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4" />

          <div className="flex items-center gap-4">
            <button
              className="p-3 hover:bg-defendrGrey rounded-lg transition-colors"
              title="Schedule Match"
              type="button"
              onClick={() => handleBarIconClick('schedule', activeRound)}
            >
              <svg
                className="w-6 h-6 text-defendrRed"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>

            {/* Round Sets Icon */}
            <button
              className="p-3 hover:bg-defendrGrey rounded-lg transition-colors"
              title="Round Sets"
              type="button"
              onClick={() => handleBarIconClick('roundSets', activeRound)}
            >
              <svg
                className="w-6 h-6 text-defendrRed"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area: Always render matches; bracketType controls which round(s) are shown */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center text-white py-8">
            <div className="text-xl font-poppins">Loading matches...</div>
          </div>
        ) : error ? (
          <div className="text-center text-defendrRed py-8">
            <div className="text-xl font-poppins">{error}</div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center text-defendrGrey py-8">
            <div className="text-xl font-poppins">No matches found for {activeRound}</div>
          </div>
        ) : (
          matches.map((match: Match) => (
            <div
              key={match.id}
              className="bg-defendrLightBlack border-2 border-defendrRed rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Round tag with status */}
                  {match.round && (
                    <span className="bg-defendrGrey/30 border border-defendrGrey text-white px-3 py-1 rounded-full text-xs font-poppins flex items-center gap-2">
                      <span>{match.round}</span>
                      {match.roundStatus === 'in-progress' && (
                        <span className="text-yellow-400">IN PROGRESS</span>
                      )}
                      {match.roundStatus === 'finished' && (
                        <span className="text-defendrRed">FINISHED</span>
                      )}
                      {match.roundStatus === 'scheduled' && (
                        <span className="text-defendrBlue">SCHEDULED</span>
                      )}
                    </span>
                  )}
                  <span className="text-white text-sm font-poppins">
                    {match.date
                      ? new Date(match.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          timeZoneName: 'short',
                        })
                      : 'No date'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {match.status === 'completed' && (
                    <span className="bg-defendrRed text-white px-3 py-1 rounded-full text-xs font-poppins">
                      FINISHED
                    </span>
                  )}
                  {match.isLive && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-poppins">
                      LIVE
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 hover:bg-defendrGrey rounded transition-colors"
                      onClick={() => handleIconClick('score', match)}
                    >
                      <Image alt="Score" height={20} src={ScoreIcon} width={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 border-2 border-defendrRed rounded" />
                    <Image
                      alt={match.team1.name}
                      className="rounded-full"
                      height={50}
                      src={match.team1.logo}
                      width={50}
                    />
                    <div className="text-center">
                      <div className="text-white font-poppins font-medium text-sm">
                        {match.team1.name}
                      </div>
                      <div className="text-white text-2xl font-bold">{match.team1.score || 0}</div>
                    </div>
                  </div>
                  <span className="text-white text-2xl font-bold font-poppins mx-8">VS</span>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-white font-poppins font-medium text-sm">
                        {match.team2.name}
                      </div>
                      <div className="text-white text-2xl font-bold">{match.team2.score || 0}</div>
                    </div>
                    <Image
                      alt={match.team2.name}
                      className="rounded-full"
                      height={50}
                      src={match.team2.logo}
                      width={50}
                    />
                    <div className="w-4 h-4 border-2 border-defendrRed rounded" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  className="w-full"
                  label="Match Profile"
                  size="m"
                  textClassName="font-poppins"
                  variant="contained-red"
                  onClick={() => handleMatchProfileClick(match)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <ScoreModal
        isOpen={scoreModalOpen}
        match={selectedMatch}
        setTeam1Score={setTeam1Score}
        setTeam2Score={setTeam2Score}
        team1Score={team1Score}
        team2Score={team2Score}
        onClose={() => setScoreModalOpen(false)}
        onSubmit={handleSetScore}
      />

      {/* Match Schedule Modal */}
      <Modal isOpen={matchScheduleModalOpen} onClose={() => setMatchScheduleModalOpen(false)}>
        <div className="bg-defendrLightBlack p-6 rounded-lg max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Typo as="h2" color="white" fontFamily="poppins" fontVariant="h4">
              Match Schedule
            </Typo>
          </div>

          <div className="mb-6">
            <Typo as="p" className="mb-3" color="white" fontVariant="p2">
              Select Date & Time
            </Typo>
            <input
              className="w-full px-4 py-3 bg-defendrBg border border-defendrGrey rounded-lg text-white focus:border-defendrRed focus:outline-none"
              type="datetime-local"
              value={scheduleDate}
              onChange={e => setScheduleDate(e.target.value)}
            />
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              label="Cancel"
              size="xxs"
              textClassName="font-poppins"
              variant="outlined-grey"
              onClick={() => setMatchScheduleModalOpen(false)}
            />
            <Button
              disabled={isSubmitting}
              label="Submit"
              size="xxs"
              textClassName="font-poppins"
              variant="contained-red"
              onClick={handleScheduleSubmit}
            />
          </div>
        </div>
      </Modal>

      {/* Round Sets Modal */}
      <Modal isOpen={roundSetsModalOpen} onClose={() => setRoundSetsModalOpen(false)}>
        <div className="bg-defendrLightBlack p-6 rounded-lg max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Typo as="h2" color="white" fontFamily="poppins" fontVariant="h4">
              Rounds Sets
            </Typo>
          </div>

          <div className="mb-6">
            <Typo as="p" className="mb-3" color="white" fontVariant="p2">
              Select Best of
            </Typo>
            <FormSelect
              label=""
              options={[
                { value: '1', label: 'Best of 1' },
                { value: '3', label: 'Best of 3' },
                { value: '5', label: 'Best of 5' },
              ]}
              placeholder="Select Best of"
              value={roundSets.toString()}
              onChange={value => setRoundSets(parseInt(value) as 1 | 3 | 5)}
            />
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              label="Cancel"
              size="xxs"
              textClassName="font-poppins"
              variant="outlined-grey"
              onClick={() => setRoundSetsModalOpen(false)}
            />
            <Button
              disabled={isSubmitting}
              label="Submit"
              size="xxs"
              textClassName="font-poppins"
              variant="contained-red"
              onClick={handleRoundSetsSubmit}
            />
          </div>
        </div>
      </Modal>

      {/* Set Score Modal */}
      <Modal isOpen={finalScoreModalOpen} onClose={() => setFinalScoreModalOpen(false)}>
        <div className="bg-defendrLightBlack p-6 rounded-lg max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Typo as="h2" color="white" fontFamily="poppins" fontVariant="h4">
              Set Score
            </Typo>
            <button
              className="text-white hover:text-defendrRed transition-colors"
              onClick={() => setFinalScoreModalOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <Typo as="p" className="mb-3" color="white" fontVariant="p2">
                Team 1 Score
              </Typo>
              <input
                className="w-full px-4 py-3 bg-defendrBg border border-defendrGrey rounded-lg text-white focus:border-defendrRed focus:outline-none"
                min="0"
                type="number"
                value={finalTeam1Score}
                onChange={e => setFinalTeam1Score(parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Typo as="p" className="mb-3" color="white" fontVariant="p2">
                Team 2 Score
              </Typo>
              <input
                className="w-full px-4 py-3 bg-defendrBg border border-defendrGrey rounded-lg text-white focus:border-defendrRed focus:outline-none"
                min="0"
                type="number"
                value={finalTeam2Score}
                onChange={e => setFinalTeam2Score(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              label="Cancel"
              size="xxs"
              textClassName="font-poppins"
              variant="outlined-grey"
              onClick={() => setFinalScoreModalOpen(false)}
            />
            <Button
              disabled={isSubmitting}
              label="Submit"
              size="xxs"
              textClassName="font-poppins"
              variant="contained-red"
              onClick={handleSetScoreSubmit}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
