'use client'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import TeamModal from '../../team/TeamModal'
import { Edit, Expand, Shrink } from 'lucide-react'
import { getTeamById } from '@/services/teamService'
import { imageUrlSanitizer, teamImageSanitizer } from '@/utils/imageUrlSanitizer'
import type { BracketType, Tournament } from '@/types/tournamentType'
import { toast } from 'sonner'
import { setScore, swapParticipants } from '@/services/matchService'
import ScoreModal from '@/components/ui/matchListModal/scoreModal'
import {
  ApiBracket,
  ApiParticipant,
  ApiRound,
  LineData,
  ParticipantWithScore,
  Bracket,
  Match,
  BracketShow,
} from './types'
import useTournamentBracket from './hook/useTournamentBracket'
import { useBracketContainer } from './hook/bracker-container'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../SelectBracket'
import type { ManageableTournamentInput } from './types'
import { cn } from '@/lib/utils'

const getParticipantId = (participant: ApiParticipant | ParticipantWithScore | null) =>
  participant?.team?._id || participant?.user?._id || participant?._id || null

// Transform API data to internal format
const transformApiData = (apiData: ApiBracket | ApiRound[] | undefined | null): Bracket => {
  if (!apiData) {
    return { rounds: [] }
  }

  // Handle case where API returns array of rounds directly
  const rounds = Array.isArray(apiData)
    ? apiData.filter(Boolean)
    : Array.isArray(apiData.rounds)
      ? apiData.rounds.filter(Boolean)
      : []

  if (!rounds.length) {
    return { rounds: [] }
  }

  return {
    rounds: rounds.map(round => ({
      round: round?.number ?? 0,
      matches: Array.isArray(round?.matches)
        ? round.matches.map((match, index) => {
            // Helper function to add score to participant
            const addScore = (participant: ApiParticipant | null): ParticipantWithScore | null => {
              if (!participant) return null
              const score = match?.scores?.find(s => s.participant === participant._id)?.score ?? 0
              return { ...participant, score }
            }

            return {
              id: match?._id ?? `${round?.number ?? 0}-${index}`,
              round: round?.number ?? 0,
              position: index + 1,
              participantA: addScore(match?.participantA ?? null),
              participantB: addScore(match?.participantB ?? null),
              winner: match?.winner,
              previousMatchA: match?.previousMatchA,
              previousMatchB: match?.previousMatchB,
              createdAt: match?.createdAt ?? '',
            }
          })
        : [],
    })),
  }
}

const EliminationBracket = ({
  tournament,
  canManage = false,
  bracketType,
}: {
  tournament: Tournament | ManageableTournamentInput
  canManage: boolean
  bracketType?: BracketType
}) => {
  const resolvedBracketType = (bracketType ||
    tournament.BracketType ||
    'SINGLE_ELIMINATION') as BracketType
  const { bracketData, loading, error, refetch } = useTournamentBracket(
    tournament.bracket,
    tournament.looserBracket,
    resolvedBracketType,
  )

  console.log('Test ===============>', bracketData)
  // All hooks must be declared before any conditional returns
  const {
    containerRef,
    handlers,
    fullscreenContainerRef,
    isDragging,
    isFullscreen,
    toggleFullscreen,
  } = useBracketContainer()
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [mainRosterMembers, setMainRosterMembers] = useState<any[]>([])
  const [substituteRosterMembers, setSubstituteRosterMembers] = useState<any[]>([])
  const [loadingTeam, setLoadingTeam] = useState(false)
  const [winnerBracketLines, setWinnerBracketLines] = useState<LineData[]>([])
  const [loserBracketLines, setLoserBracketLines] = useState<LineData[]>([])
  const [championLine, setChampionLine] = useState<LineData | null>(null)
  const [loserChampionLine, setLoserChampionLine] = useState<LineData | null>(null)
  const [grandFinalLine, setGrandFinalLine] = useState<LineData | null>(null)
  const [winnerToGrandFinalLine, setWinnerToGrandFinalLine] = useState<LineData | null>(null)
  const [loserToGrandFinalLine, setLoserToGrandFinalLine] = useState<LineData | null>(null)
  const [bracketShow, setBracketShow] = useState<BracketShow>('BOTH')
  // Score modal states
  const [scoreModalOpen, setScoreModalOpen] = useState(false)
  const [scoreMatch, setScoreMatch] = useState<Match | null>(null)
  const [scoreTeam1, setScoreTeam1] = useState(0)
  const [scoreTeam2, setScoreTeam2] = useState(0)
  // Swap mode states
  const [swapMode, setSwapMode] = useState(false)
  const [firstSwap, setFirstSwap] = useState<{ matchId: string; participantId: string } | null>(
    null,
  )
  // console.log('Bracket data from client: ', bracketData)

  useEffect(() => {
    console.log(tournament)
  }, [bracketData])

  // Transform bracket data
  const processedWinnerBracketData =
    bracketData.length > 0
      ? transformApiData(bracketData[0])
          .rounds.filter(r => r.round !== undefined && r.round !== null)
          .sort((a, b) => a.round - b.round)
      : []
  const processedLoserBracketData =
    bracketData.length > 0
      ? transformApiData(bracketData[1])
          .rounds.filter(r => r.round !== undefined && r.round !== null)
          .sort((a, b) => a.round - b.round)
      : []

  const MAX_ROUNDS = processedWinnerBracketData.length
  const loserBracketIsExist = processedLoserBracketData.length > 0

  // Get champion participants before useEffect
  const finalMatch = processedWinnerBracketData[processedWinnerBracketData.length - 1]?.matches[0]
  const championParticipant = finalMatch?.winner
    ? finalMatch.participantA?._id === finalMatch.winner
      ? finalMatch.participantA
      : finalMatch.participantB
    : null
  const championParticipantId = getParticipantId(championParticipant)

  // Get loser bracket final winner
  const loserFinalMatch =
    processedLoserBracketData[processedLoserBracketData.length - 1]?.matches[0]
  const loserBracketWinner = loserFinalMatch?.winner
    ? loserFinalMatch.participantA?._id === loserFinalMatch.winner
      ? loserFinalMatch.participantA
      : loserFinalMatch.participantB
    : null
  const loserBracketWinnerId = getParticipantId(loserBracketWinner)

  // Open score modal for a match
  const openScoreModal = useCallback((match: Match) => {
    setScoreMatch(match)
    setScoreTeam1(match.participantA?.score || 0)
    setScoreTeam2(match.participantB?.score || 0)
    setScoreModalOpen(true)
  }, [])

  // Submit score changes
  const submitScoreModal = useCallback(async () => {
    if (!scoreMatch) return

    const participantAId = scoreMatch.participantA?._id
    const participantBId = scoreMatch.participantB?._id

    if (!participantAId || !participantBId) {
      toast.error('Missing participant IDs')
      return
    }

    try {
      await setScore(scoreMatch.id, participantAId, scoreTeam1)
      await setScore(scoreMatch.id, participantBId, scoreTeam2)

      toast.success('Scores updated')
      setScoreModalOpen(false)
      setScoreMatch(null)

      // Refetch bracket data to get updated scores
      refetch()
    } catch (error) {
      toast.error('Failed to update scores')
    }
  }, [scoreMatch, scoreTeam1, scoreTeam2, refetch])

  // Toggle swap mode
  const toggleSwapMode = useCallback(() => {
    if (!canManage) return
    setSwapMode(m => !m)
    setFirstSwap(null)
  }, [canManage])

  // Handle participant selection for swap
  const handleParticipantSelectForSwap = useCallback(
    async (match: Match, participantId?: string) => {
      if (!swapMode || !participantId) return

      if (!firstSwap) {
        setFirstSwap({ matchId: match.id, participantId })
        return
      }

      if (firstSwap.matchId === match.id) {
        toast.error('Select a participant from a different match')
        return
      }

      // Find which round both matches belong to
      const findMatchRound = (
        matchId: string,
      ): { bracket: 'winner' | 'loser'; round: number } | null => {
        for (let i = 0; i < processedWinnerBracketData.length; i++) {
          if (processedWinnerBracketData[i].matches.some(m => m.id === matchId)) {
            return { bracket: 'winner', round: i }
          }
        }
        for (let i = 0; i < processedLoserBracketData.length; i++) {
          if (processedLoserBracketData[i].matches.some(m => m.id === matchId)) {
            return { bracket: 'loser', round: i }
          }
        }
        return null
      }

      const firstMatchRound = findMatchRound(firstSwap.matchId)
      const secondMatchRound = findMatchRound(match.id)

      if (!firstMatchRound || !secondMatchRound) {
        toast.error('Could not find match rounds')
        return
      }

      if (
        firstMatchRound.bracket !== secondMatchRound.bracket ||
        firstMatchRound.round !== secondMatchRound.round
      ) {
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

        // Refetch bracket data
        refetch()
      } catch (error) {
        toast.error('Failed to swap participants')
      } finally {
        setFirstSwap(null)
        setSwapMode(false)
      }
    },
    [swapMode, firstSwap, processedWinnerBracketData, processedLoserBracketData, refetch],
  )

  // Calculate lines - must be before early returns
  useEffect(() => {
    const calculateLines = () => {
      const newLines: LineData[] = []

      processedWinnerBracketData.forEach((round, i) => {
        if (i >= MAX_ROUNDS - 1) return

        round.matches.forEach((match: Match, j: number) => {
          const currentEl = document.getElementById(match.id)
          const nextRoundMatches = processedWinnerBracketData[i + 1].matches
          const linkedMatch = nextRoundMatches.find(
            m => m.previousMatchA === match.id || m.previousMatchB === match.id,
          )
          const linkedTbdMatch = nextRoundMatches.find(
            m =>
              (m.previousMatchA === match.id || m.previousMatchB === match.id) &&
              (!m.participantA || !m.participantB),
          )
          const nextMatch =
            i === 0
              ? linkedTbdMatch || linkedMatch || nextRoundMatches[Math.floor(j / 2)]
              : linkedMatch
          const resolvedNextMatch = nextMatch || nextRoundMatches[Math.floor(j / 2)]
          if (!resolvedNextMatch) return
          const nextMatchId = resolvedNextMatch.id
          const nextEl = document.getElementById(nextMatchId)

          if (currentEl && nextEl) {
            const currentRect = {
              x: currentEl.offsetLeft,
              y: currentEl.offsetTop,
              w: currentEl.offsetWidth,
              h: currentEl.offsetHeight,
            }
            const nextRect = {
              x: nextEl.offsetLeft,
              y: nextEl.offsetTop,
              w: nextEl.offsetWidth,
              h: nextEl.offsetHeight,
            }

            const currentTeams = [
              getParticipantId(match.participantA),
              getParticipantId(match.participantB),
            ].filter(Boolean) as string[]
            const nextTeams = [
              getParticipantId(resolvedNextMatch.participantA),
              getParticipantId(resolvedNextMatch.participantB),
            ].filter(Boolean) as string[]
            const sharedTeams = currentTeams.filter(id => nextTeams.includes(id))
            const teamIds = sharedTeams.length > 0 ? sharedTeams : currentTeams

            const isRoundZero = i === 0
            const roundZeroOffset = isRoundZero ? (j - (round.matches.length - 1) / 2) * 6 : 0
            newLines.push({
              id: `line-${match.id}`,
              x1: currentRect.x + currentRect.w,
              y1: currentRect.y + currentRect.h / 2,
              x2: nextRect.x,
              y2: nextRect.y + nextRect.h / 2,
              teamIds,
              elbowOffset: roundZeroOffset,
            })
          }
        })
      })

      setWinnerBracketLines(newLines)

      // Calculate loser bracket lines
      const loserBracketNewLines: LineData[] = []
      processedLoserBracketData.forEach((round, i) => {
        if (i >= processedLoserBracketData.length - 1) return

        round.matches.forEach((match: Match, j: number) => {
          const currentEl = document.getElementById(match.id)
          const nextRoundMatches = processedLoserBracketData[i + 1].matches
          const linkedMatch = nextRoundMatches.find(
            m => m.previousMatchA === match.id || m.previousMatchB === match.id,
          )
          const linkedTbdMatch = nextRoundMatches.find(
            m =>
              (m.previousMatchA === match.id || m.previousMatchB === match.id) &&
              (!m.participantA || !m.participantB),
          )
          const nextMatch =
            i === 0
              ? linkedTbdMatch || linkedMatch || nextRoundMatches[Math.floor(j / 2)]
              : linkedMatch
          const resolvedNextMatch = nextMatch || nextRoundMatches[Math.floor(j / 2)]
          if (!resolvedNextMatch) return
          const nextMatchId = resolvedNextMatch.id
          const nextEl = document.getElementById(nextMatchId)

          if (currentEl && nextEl) {
            const currentRect = {
              x: currentEl.offsetLeft,
              y: currentEl.offsetTop,
              w: currentEl.offsetWidth,
              h: currentEl.offsetHeight,
            }
            const nextRect = {
              x: nextEl.offsetLeft,
              y: nextEl.offsetTop,
              w: nextEl.offsetWidth,
              h: nextEl.offsetHeight,
            }

            const currentTeams = [
              getParticipantId(match.participantA),
              getParticipantId(match.participantB),
            ].filter(Boolean) as string[]
            const nextTeams = [
              getParticipantId(resolvedNextMatch.participantA),
              getParticipantId(resolvedNextMatch.participantB),
            ].filter(Boolean) as string[]
            const sharedTeams = currentTeams.filter(id => nextTeams.includes(id))
            const teamIds = sharedTeams.length > 0 ? sharedTeams : currentTeams

            const isRoundZero = i === 0
            const roundZeroOffset = isRoundZero ? (j - (round.matches.length - 1) / 2) * 6 : 0
            loserBracketNewLines.push({
              id: `loser-line-${match.id}`,
              x1: currentRect.x + currentRect.w,
              y1: currentRect.y + currentRect.h / 2,
              x2: nextRect.x,
              y2: nextRect.y + nextRect.h / 2,
              teamIds,
              elbowOffset: roundZeroOffset,
            })
          }
        })
      })

      setLoserBracketLines(loserBracketNewLines)

      // Calculate champion line from final match to champion display
      if (processedWinnerBracketData.length > 0) {
        const finalRound = processedWinnerBracketData[processedWinnerBracketData.length - 1]
        if (finalRound.matches.length > 0) {
          const finalMatch = finalRound.matches[0]
          const finalMatchEl = document.getElementById(finalMatch.id)
          const championEl = document.getElementById('champion-display')

          if (finalMatchEl && championEl) {
            const finalRect = {
              x: finalMatchEl.offsetLeft,
              y: finalMatchEl.offsetTop,
              w: finalMatchEl.offsetWidth,
              h: finalMatchEl.offsetHeight,
            }
            const championRect = {
              x: championEl.offsetLeft,
              y: championEl.offsetTop,
              w: championEl.offsetWidth,
              h: championEl.offsetHeight,
            }

            const finalTeams = [
              getParticipantId(finalMatch.participantA),
              getParticipantId(finalMatch.participantB),
            ].filter(Boolean) as string[]

            setChampionLine({
              id: 'champion-line',
              x1: finalRect.x + finalRect.w,
              y1: finalRect.y + finalRect.h / 2,
              x2: championRect.x,
              y2: championRect.y + championRect.h / 2,
              teamIds: finalTeams,
            })
          }
        }
      }

      // Calculate loser bracket champion line from final match to loser champion display
      if (processedLoserBracketData.length > 0) {
        const loserFinalRound = processedLoserBracketData[processedLoserBracketData.length - 1]
        if (loserFinalRound.matches.length > 0) {
          const loserFinalMatch = loserFinalRound.matches[0]
          const loserFinalMatchEl = document.getElementById(loserFinalMatch.id)
          const loserChampionEl = document.getElementById('loser-champion-display')

          if (loserFinalMatchEl && loserChampionEl) {
            const loserFinalRect = {
              x: loserFinalMatchEl.offsetLeft,
              y: loserFinalMatchEl.offsetTop,
              w: loserFinalMatchEl.offsetWidth,
              h: loserFinalMatchEl.offsetHeight,
            }
            const loserChampionRect = {
              x: loserChampionEl.offsetLeft,
              y: loserChampionEl.offsetTop,
              w: loserChampionEl.offsetWidth,
              h: loserChampionEl.offsetHeight,
            }

            const loserFinalTeams = [
              getParticipantId(loserFinalMatch.participantA),
              getParticipantId(loserFinalMatch.participantB),
            ].filter(Boolean) as string[]

            setLoserChampionLine({
              id: 'loser-champion-line',
              x1: loserFinalRect.x + loserFinalRect.w,
              y1: loserFinalRect.y + loserFinalRect.h / 2,
              x2: loserChampionRect.x,
              y2: loserChampionRect.y + loserChampionRect.h / 2,
              teamIds: loserFinalTeams,
            })
          }
        }
      }

      // Calculate grand final lines when BOTH brackets are shown
      if (bracketShow === 'BOTH' && loserBracketIsExist) {
        // Winner champion to grand final
        const winnerChampEl = document.getElementById('champion-display')
        const grandFinalEl = document.getElementById('grand-final-match')

        if (winnerChampEl && grandFinalEl) {
          const winnerRect = {
            x: winnerChampEl.offsetLeft,
            y: winnerChampEl.offsetTop,
            w: winnerChampEl.offsetWidth,
            h: winnerChampEl.offsetHeight,
          }
          const grandFinalRect = {
            x: grandFinalEl.offsetLeft,
            y: grandFinalEl.offsetTop,
            w: grandFinalEl.offsetWidth,
            h: grandFinalEl.offsetHeight,
          }

          setWinnerToGrandFinalLine({
            id: 'winner-to-gf',
            x1: winnerRect.x + winnerRect.w,
            y1: winnerRect.y + winnerRect.h / 2,
            x2: grandFinalRect.x,
            y2: grandFinalRect.y + grandFinalRect.h / 2,
            teamIds: championParticipantId ? [championParticipantId] : [],
          })
        }

        // Loser champion to grand final
        const loserChampEl = document.getElementById('loser-champion-display')

        if (loserChampEl && grandFinalEl) {
          const loserRect = {
            x: loserChampEl.offsetLeft,
            y: loserChampEl.offsetTop,
            w: loserChampEl.offsetWidth,
            h: loserChampEl.offsetHeight,
          }
          const grandFinalRect = {
            x: grandFinalEl.offsetLeft,
            y: grandFinalEl.offsetTop,
            w: grandFinalEl.offsetWidth,
            h: grandFinalEl.offsetHeight,
          }

          setLoserToGrandFinalLine({
            id: 'loser-to-gf',
            x1: loserRect.x + loserRect.w,
            y1: loserRect.y + loserRect.h / 2,
            x2: grandFinalRect.x,
            y2: grandFinalRect.y + grandFinalRect.h / 2,
            teamIds: loserBracketWinnerId ? [loserBracketWinnerId] : [],
          })
        }

        // Grand final to tournament champion
        const tournamentChampEl = document.getElementById('tournament-champion-display')

        if (grandFinalEl && tournamentChampEl) {
          const grandFinalRect = {
            x: grandFinalEl.offsetLeft,
            y: grandFinalEl.offsetTop,
            w: grandFinalEl.offsetWidth,
            h: grandFinalEl.offsetHeight,
          }
          const championRect = {
            x: tournamentChampEl.offsetLeft,
            y: tournamentChampEl.offsetTop,
            w: tournamentChampEl.offsetWidth,
            h: tournamentChampEl.offsetHeight,
          }

          setGrandFinalLine({
            id: 'gf-to-champion',
            x1: grandFinalRect.x + grandFinalRect.w,
            y1: grandFinalRect.y + grandFinalRect.h / 2,
            x2: championRect.x,
            y2: championRect.y + championRect.h / 2,
            teamIds: [],
          })
        }
      }
    }

    const timer = setTimeout(calculateLines, 100)
    window.addEventListener('resize', calculateLines)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateLines)
    }
  }, [
    MAX_ROUNDS,
    processedWinnerBracketData,
    processedLoserBracketData,
    bracketShow,
    loserBracketIsExist,
    championParticipantId,
    loserBracketWinnerId,
  ])

  // Early returns after all hooks
  if (loading) return <div>Loading bracket...</div>
  if (error) return <div>Error loading bracket: {error.message}</div>
  if (processedWinnerBracketData.length === 0) return <div>No bracket data available</div>

  // console.dir(processedWinnerBracketData, { depth: Infinity })

  // Handle team click - fetch and display team details
  const handleTeamClick = async (participant: ParticipantWithScore) => {
    if (!participant.team?._id) return

    setLoadingTeam(true)
    try {
      const teamData = await getTeamById(participant.team._id)
      setSelectedTeam(teamData)

      // Extract members from team data
      const allMembers: any[] = []

      // Add team owner
      if (teamData.teamowner && teamData.teamowner.length > 0) {
        teamData.teamowner.forEach((owner: any) => {
          const ownerData = typeof owner.user === 'string' ? { _id: owner.user } : owner.user
          allMembers.push({
            ...ownerData,
            role: 'Owner',
            joinedAt: teamData.datecreation,
          })
        })
      }

      // Add team roster members
      if (teamData.teamroster && teamData.teamroster.length > 0) {
        teamData.teamroster.forEach((member: any) => {
          const memberData = typeof member.user === 'string' ? { _id: member.user } : member.user
          allMembers.push({
            ...memberData,
            role: 'Member',
            joinedAt: member.joinedAt,
          })
        })
      }

      setTeamMembers(allMembers)
      setMainRosterMembers(allMembers.slice(0, Math.ceil(allMembers.length / 2)))
      setSubstituteRosterMembers(allMembers.slice(Math.ceil(allMembers.length / 2)))
      setShowTeamModal(true)
    } catch (error) {
      console.error('Failed to fetch team details:', error)
    } finally {
      setLoadingTeam(false)
    }
  }

  // Helper function to validate image URLs
  const getValidImageSrc = (imageSrc: string | undefined): string | null => {
    if (!imageSrc) return null
    return imageUrlSanitizer(imageSrc, 'user')
  }

  return (
    <div
      ref={fullscreenContainerRef}
      className={`bg-defendrBg text-defendrWhite ${isFullscreen ? 'overflow-y-scroll h-screen' : ''}`}
    >
      <div className="flex items-center justify-end">
        {canManage && (
          <div className="flex-1 text-xs px-4 space-x-2">
            <button
              className={`px-3 py-1 rounded border ${swapMode ? 'bg-defendrRed border-defendrRed text-white' : 'border-defendrGhostGrey text-defendrGhostGrey hover:border-defendrRed hover:text-defendrRed'}`}
              type="button"
              onClick={toggleSwapMode}
            >
              {swapMode ? 'Exit Swap Mode' : 'Swap Mode'}
            </button>
            <span className="text-white">
              {swapMode
                ? 'Swap mode: select two participants from the same round to swap.'
                : 'Click the pen icon to edit scores.'}
            </span>
            {firstSwap && swapMode && (
              <span className="text-defendrRed">First selected. Choose second participant…</span>
            )}
          </div>
        )}
        {resolvedBracketType === 'DOUBLE_ELIMINATION' && loserBracketIsExist && (
          <>
            <Select value={bracketShow} onValueChange={v => setBracketShow(v as BracketShow)}>
              <SelectTrigger className="w-45 border-defendrRed text-white text-sm">
                <SelectValue placeholder="Select bracket" />
              </SelectTrigger>
              <SelectContent className=" border-defendrRed">
                <SelectItem
                  className="text-white hover:bg-defendrRed text-sm"
                  value="WINNER_BRACKET"
                >
                  Winner's bracket
                </SelectItem>
                <SelectItem
                  className="text-white hover:bg-defendrRed text-sm"
                  value="LOSER_BRACKET"
                >
                  Loser's bracket
                </SelectItem>
                <SelectItem className="text-white hover:bg-defendrRed text-sm" value="BOTH">
                  Both Brackets
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        <button
          type="button"
          className="px-6 py-1 rounded-md text-sm hover:bg-defendrGhostGrey hover:text-black flex items-center justify-center gap-2"
        >
          <div className="size-2 bg-red-500 rounded-full" /> Live
        </button>
        <button
          type="button"
          className="px-6 py-1 rounded-md text-sm hover:bg-defendrGhostGrey hover:text-black"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Expand size={18} /> : <Shrink size={18} />}
        </button>
        {/* <button
          type="button"
          className="px-6 py-1 rounded-md text-sm hover:bg-defendrGhostGrey hover:text-black"
        >
          <Printer size={18} />
        </button>
        <button
          type="button"
          className="px-6 py-1 rounded-md text-sm hover:bg-defendrGhostGrey hover:text-black"
        >
          <CodeXml size={18} />
        </button> */}
      </div>
      <div
        ref={containerRef}
        {...handlers}
        tabIndex={0}
        className={`p-4 rounded-xl overflow-x-auto overflow-y-hidden relative select-none border-none! outline-none! cursor-move ${
          isFullscreen ? 'min-h-screen' : ''
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-defendrRed [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-0 w-full h-full pointer-events-none"
          style={{ minWidth: '100%', minHeight: '100%', overflow: 'visible' }}
        >
          {[...winnerBracketLines, ...loserBracketLines].map(line => {
            const isLineHighlighted = hoveredTeamId ? line.teamIds.includes(hoveredTeamId) : false
            const strokeColor = isLineHighlighted ? '#FFD54F' : '#d62755'
            const baseStrokeWidth = line.strokeWidth ?? 2
            const strokeWidth = isLineHighlighted
              ? Math.max(baseStrokeWidth + 2, 4)
              : baseStrokeWidth

            // Curved elbow path (rounded corners) instead of sharp lines
            const elbowX = line.x1 + 40 + (line.elbowOffset ?? 0)
            const dy = line.y2 - line.y1
            const sign = dy >= 0 ? 1 : -1
            const radius = Math.min(15, Math.abs(dy) / 2)

            const pathD = [
              // Move to start
              `M ${line.x1} ${line.y1}`,
              // Horizontal towards elbow minus corner radius
              `H ${elbowX - radius}`,
              // First rounded corner using quadratic Bezier
              `Q ${elbowX} ${line.y1} ${elbowX} ${line.y1 + sign * radius}`,
              // Vertical towards destination minus corner radius
              `V ${line.y2 - sign * radius}`,
              // Second rounded corner using quadratic Bezier
              `Q ${elbowX} ${line.y2} ${elbowX + radius} ${line.y2}`,
              // Final horizontal to destination
              `H ${line.x2}`,
            ].join(' ')

            return (
              <path
                key={line.id}
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )
          })}
          {(loserBracketIsExist ? ['WINNER_BRACKET', 'BOTH'].includes(bracketShow) : true) &&
            championLine && (
              <line
                key={championLine.id}
                x1={championLine.x1}
                y1={championLine.y1}
                x2={championLine.x2}
                y2={championLine.y2}
                stroke={
                  hoveredTeamId && championParticipantId === hoveredTeamId ? '#FFD54F' : '#FFD700'
                }
                strokeWidth={hoveredTeamId && championParticipantId === hoveredTeamId ? 5 : 3}
              />
            )}
          {resolvedBracketType === 'DOUBLE_ELIMINATION' &&
            ['LOSER_BRACKET', 'BOTH'].includes(bracketShow) &&
            loserChampionLine && (
              <line
                key={loserChampionLine.id}
                x1={loserChampionLine.x1}
                y1={loserChampionLine.y1}
                x2={loserChampionLine.x2}
                y2={loserChampionLine.y2}
                stroke={
                  hoveredTeamId && loserBracketWinnerId === hoveredTeamId ? '#FFD54F' : '#FB923C'
                }
                strokeWidth={hoveredTeamId && loserBracketWinnerId === hoveredTeamId ? 5 : 3}
              />
            )}
          {winnerToGrandFinalLine &&
            bracketShow === 'BOTH' &&
            (() => {
              const line = winnerToGrandFinalLine
              const isLineHighlighted = hoveredTeamId ? line.teamIds.includes(hoveredTeamId) : false
              const strokeColor = isLineHighlighted ? '#FFD54F' : '#d62755'
              const strokeWidth = isLineHighlighted ? 4 : 2

              const elbowX = line.x1 + 40
              const dy = line.y2 - line.y1
              const sign = dy >= 0 ? 1 : -1
              const radius = Math.min(15, Math.abs(dy) / 2)

              const pathD = [
                `M ${line.x1} ${line.y1}`,
                `H ${elbowX - radius}`,
                `Q ${elbowX} ${line.y1} ${elbowX} ${line.y1 + sign * radius}`,
                `V ${line.y2 - sign * radius}`,
                `Q ${elbowX} ${line.y2} ${elbowX + radius} ${line.y2}`,
                `H ${line.x2}`,
              ].join(' ')

              return (
                <path
                  key={line.id}
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            })()}
          {resolvedBracketType === 'DOUBLE_ELIMINATION' &&
            loserToGrandFinalLine &&
            bracketShow === 'BOTH' &&
            (() => {
              const line = loserToGrandFinalLine
              const isLineHighlighted = hoveredTeamId ? line.teamIds.includes(hoveredTeamId) : false
              const strokeColor = isLineHighlighted ? '#FFD54F' : '#D62755'
              const strokeWidth = isLineHighlighted ? 4 : 2

              const elbowX = line.x1 + 40
              const dy = line.y2 - line.y1
              const sign = dy >= 0 ? 1 : -1
              const radius = Math.min(15, Math.abs(dy) / 2)

              const pathD = [
                `M ${line.x1} ${line.y1}`,
                `H ${elbowX - radius}`,
                `Q ${elbowX} ${line.y1} ${elbowX} ${line.y1 + sign * radius}`,
                `V ${line.y2 - sign * radius}`,
                `Q ${elbowX} ${line.y2} ${elbowX + radius} ${line.y2}`,
                `H ${line.x2}`,
              ].join(' ')

              return (
                <path
                  key={line.id}
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            })()}
          {grandFinalLine && bracketShow === 'BOTH' && (
            <line
              key={grandFinalLine.id}
              x1={grandFinalLine.x1}
              y1={grandFinalLine.y1}
              x2={grandFinalLine.x2}
              y2={grandFinalLine.y2}
              stroke="#FFD700"
              strokeWidth={3}
            />
          )}
        </svg>
        <div className="flex pb-10">
          <div style={{ minWidth: 'max-content' }}>
            {(loserBracketIsExist ? ['WINNER_BRACKET', 'BOTH'].includes(bracketShow) : true) && (
              <>
                {resolvedBracketType === 'DOUBLE_ELIMINATION' && loserBracketIsExist && (
                  <h6 className="text-2xl font-bold text-defendrRed text-center p-4">
                    Winner bracket
                  </h6>
                )}
                <div className="flex shrink-0 gap-20">
                  {processedWinnerBracketData.map((round, i) => (
                    <RoundColumn
                      key={i}
                      title={`Round ${round.round}`}
                      isFullscreen={isFullscreen}
                      className={round.round === 0 ? '[&_>div]:flex-col-reverse' : ''}
                    >
                      {round.matches.map((match: Match, j: number) => (
                        <MatchCard
                          key={j}
                          date={match.createdAt}
                          slot1={
                            <TeamSlot
                              participant={match.participantA}
                              winner={match.winner === match.participantA?._id}
                              direction="LEFT"
                              onHoverTeam={setHoveredTeamId}
                              isHighlighted={hoveredTeamId === getParticipantId(match.participantA)}
                              onTeamClick={swapMode ? undefined : handleTeamClick}
                              swapMode={swapMode}
                              onParticipantSelectForSwap={() =>
                                handleParticipantSelectForSwap(match, match.participantA?._id)
                              }
                              isSelectedForSwap={
                                firstSwap?.participantId === match.participantA?._id
                              }
                            />
                          }
                          slot2={
                            <TeamSlot
                              participant={match.participantB}
                              winner={match.winner === match.participantB?._id}
                              direction="RIGHT"
                              onHoverTeam={setHoveredTeamId}
                              isHighlighted={hoveredTeamId === getParticipantId(match.participantB)}
                              onTeamClick={swapMode ? undefined : handleTeamClick}
                              swapMode={swapMode}
                              onParticipantSelectForSwap={() =>
                                handleParticipantSelectForSwap(match, match.participantB?._id)
                              }
                              isSelectedForSwap={
                                firstSwap?.participantId === match.participantB?._id
                              }
                            />
                          }
                          round={round.round}
                          id={match.id}
                          match={match}
                          canManage={canManage}
                          swapMode={swapMode}
                          onOpenScoreModal={openScoreModal}
                        />
                      ))}
                    </RoundColumn>
                  ))}
                  <div
                    className={`w-fit shrink-0 ${isFullscreen ? 'min-h-screen' : 'min-h-full'} flex flex-col`}
                  >
                    <h4 className="text-center text-xl p-4 font-bold uppercase text-defendrGhostGrey">
                      Champion
                    </h4>
                    <div className="flex flex-col justify-around gap-5 flex-1">
                      <div id="champion-display">
                        <ChampionCard
                          participant={championParticipant}
                          title={
                            resolvedBracketType === 'DOUBLE_ELIMINATION' && loserBracketIsExist
                              ? 'Winner Bracket Champion'
                              : 'Tournament Champion'
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {resolvedBracketType === 'DOUBLE_ELIMINATION' &&
              ['LOSER_BRACKET', 'BOTH'].includes(bracketShow) && (
                <>
                  <h6 className="text-2xl font-bold text-defendrRed text-center p-4">
                    Loser bracket
                  </h6>
                  <div className="flex shrink-0 gap-20 w-full">
                    {processedLoserBracketData.map((round, i) => (
                      <RoundColumn
                        key={i}
                        title={`Round ${round.round}`}
                        isFullscreen={isFullscreen}
                      >
                        {round.matches.map((match: Match, j: number) => (
                          <MatchCard
                            key={j}
                            date={(match as any).createdAt as string}
                            slot1={
                              <TeamSlot
                                participant={match.participantA}
                                winner={match.winner === match.participantA?._id}
                                direction="LEFT"
                                onHoverTeam={setHoveredTeamId}
                                isHighlighted={
                                  hoveredTeamId === getParticipantId(match.participantA)
                                }
                                onTeamClick={swapMode ? undefined : handleTeamClick}
                                swapMode={swapMode}
                                onParticipantSelectForSwap={() =>
                                  handleParticipantSelectForSwap(match, match.participantA?._id)
                                }
                                isSelectedForSwap={
                                  firstSwap?.participantId === match.participantA?._id
                                }
                              />
                            }
                            slot2={
                              <TeamSlot
                                participant={match.participantB}
                                winner={match.winner === match.participantB?._id}
                                direction="RIGHT"
                                onHoverTeam={setHoveredTeamId}
                                isHighlighted={
                                  hoveredTeamId === getParticipantId(match.participantB)
                                }
                                onTeamClick={swapMode ? undefined : handleTeamClick}
                                swapMode={swapMode}
                                onParticipantSelectForSwap={() =>
                                  handleParticipantSelectForSwap(match, match.participantB?._id)
                                }
                                isSelectedForSwap={
                                  firstSwap?.participantId === match.participantB?._id
                                }
                              />
                            }
                            round={round.round}
                            id={match.id}
                            match={match}
                            canManage={canManage}
                            swapMode={swapMode}
                            onOpenScoreModal={openScoreModal}
                          />
                        ))}
                      </RoundColumn>
                    ))}
                    <div
                      className={`w-fit shrink-0 ${isFullscreen ? 'min-h-screen' : 'min-h-full'} flex flex-col`}
                    >
                      <h4 className="text-center text-xl p-4 font-bold uppercase text-defendrGhostGrey">
                        Loser Bracket Winner
                      </h4>
                      <div className="flex flex-col justify-around gap-5 flex-1">
                        <div id="loser-champion-display">
                          <ChampionCard
                            participant={loserBracketWinner}
                            title="Loser Bracket Champion"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>
          {bracketShow === 'BOTH' &&
            loserBracketIsExist &&
            resolvedBracketType === 'DOUBLE_ELIMINATION' && (
              <>
                <div
                  className={`pt-12 px-20 shrink-0 ${isFullscreen ? 'min-h-screen' : 'min-h-full'} flex flex-col justify-center`}
                >
                  <h4 className="text-center text-xl p-4 font-bold uppercase text-yellow-500">
                    Grand Final
                  </h4>
                  <div className="flex flex-col justify-around gap-5 flex-1">
                    <div id="grand-final-match">
                      <MatchCard
                        date={new Date().toISOString()}
                        slot1={
                          <TeamSlot
                            participant={championParticipant}
                            winner={(championParticipant?.score || 0) > loserBracketWinner?.score!}
                            direction="LEFT"
                            onHoverTeam={setHoveredTeamId}
                            isHighlighted={hoveredTeamId === championParticipantId}
                            onTeamClick={handleTeamClick}
                          />
                        }
                        slot2={
                          <TeamSlot
                            participant={loserBracketWinner}
                            winner={
                              (loserBracketWinner?.score || 0) > (championParticipant?.score || 0)
                            }
                            direction="RIGHT"
                            onHoverTeam={setHoveredTeamId}
                            isHighlighted={hoveredTeamId === loserBracketWinnerId}
                            onTeamClick={handleTeamClick}
                          />
                        }
                        round={999}
                        id="grand-final-match-card"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`pt-12 px-20 w-fit shrink-0 ${isFullscreen ? 'min-h-screen' : 'min-h-full'} flex flex-col justify-center`}
                >
                  <h4 className="text-center text-xl p-4 font-bold uppercase text-yellow-500">
                    Tournament Champion
                  </h4>
                  <div className="flex flex-col justify-around gap-5 flex-1">
                    <div id="tournament-champion-display">
                      <ChampionCard
                        participant={championParticipant}
                        title="Tournament Champion"
                        isTournamentChampion={true}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
      <TeamModal
        show={showTeamModal}
        team={selectedTeam}
        teamMembers={teamMembers}
        mainRosterMembers={mainRosterMembers}
        substituteRosterMembers={substituteRosterMembers}
        onClose={() => setShowTeamModal(false)}
        onViewProfile={() => {}}
        teamImageSanitizer={teamImageSanitizer}
        getValidImageSrc={getValidImageSrc}
      />
      <ScoreModal
        isOpen={scoreModalOpen}
        match={
          scoreMatch
            ? {
                team1: {
                  name:
                    scoreMatch.participantA?.team?.name ||
                    scoreMatch.participantA?.user?.nickname ||
                    'Team 1',
                  logo:
                    scoreMatch.participantA?.team?.profileImage ||
                    scoreMatch.participantA?.user?.profileImage ||
                    '/assets/organization/default_org_icon.jpg',
                },
                team2: {
                  name:
                    scoreMatch.participantB?.team?.name ||
                    scoreMatch.participantB?.user?.nickname ||
                    'Team 2',
                  logo:
                    scoreMatch.participantB?.team?.profileImage ||
                    scoreMatch.participantB?.user?.profileImage ||
                    '/assets/organization/default_org_icon.jpg',
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
    </div>
  )
}

const RoundColumn = ({
  title,
  className = '',
  children,
  isFullscreen = false,
}: {
  title: string
  className?: string
  children: React.ReactNode
  isFullscreen?: boolean
}) => {
  return (
    <div
      className={cn(
        `w-fit shrink-0 ${isFullscreen ? 'min-h-screen' : 'min-h-full'} flex flex-col`,
        className,
      )}
    >
      <h4 className="text-center text-xl p-4 font-bold uppercase text-defendrGhostGrey">{title}</h4>
      <div className="flex flex-col justify-around gap-16 flex-1">{children}</div>
    </div>
  )
}
const MatchCard = ({
  slot1,
  slot2,
  id,
  round,
  date = '',
  match,
  canManage = false,
  swapMode = false,
  onOpenScoreModal,
}: {
  id: string
  slot1: React.ReactNode
  slot2: React.ReactNode
  round: number
  date: string
  match?: Match
  canManage?: boolean
  swapMode?: boolean
  onOpenScoreModal?: (match: Match) => void
}) => {
  return (
    <div className="relative" id={id}>
      <div
        className="relative overflow-hidden min-w-75 rounded-2xl bg-defendrBg border-2 border-defendrRed flex flex-col items-center justify-between after:absolute after:h-px after:w-1/2 after:bg-defendrRed after:top-1/2 after:left-1/2 after:translate-x-4 before:absolute before:h-px before:w-1/2 before:bg-defendrRed before:top-1/2 before:right-1/2 before:-translate-x-4"
        title={`Match ID: ${id}, Round: ${round}`}
      >
        {slot1}
        <div className="text-sm text-neutral-500 group-hover:text-defendrRed absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <span>VS</span>
        </div>
        {slot2}
      </div>
      <div
        className={`flex items-center ${canManage ? 'justify-between' : 'justify-center'} p-2 text-xs text-defendrGhostGrey absolute left-0 top-full w-full`}
      >
        <p>
          {new Date(date).toLocaleDateString('en', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
          })}
        </p>
        {canManage && !swapMode && match && onOpenScoreModal && (
          <button
            aria-label="Edit score"
            className="flex items-center justify-center gap-2 hover:text-defendrRed"
            type="button"
            onClick={e => {
              e.stopPropagation()
              onOpenScoreModal(match)
            }}
          >
            EDIT <Edit size={12} />
          </button>
        )}
      </div>
    </div>
  )
}

const TeamSlot = ({
  participant,
  direction = 'LEFT',
  winner = false,
  onHoverTeam,
  isHighlighted = false,
  onTeamClick,
  swapMode = false,
  onParticipantSelectForSwap,
  isSelectedForSwap = false,
}: {
  participant: ParticipantWithScore | null
  direction?: 'LEFT' | 'RIGHT'
  winner?: boolean
  onHoverTeam?: (teamId: string | null) => void
  isHighlighted?: boolean
  onTeamClick?: (participant: ParticipantWithScore) => void
  swapMode?: boolean
  onParticipantSelectForSwap?: () => void
  isSelectedForSwap?: boolean
}) => {
  if (!participant) {
    return (
      <div className="flex items-center justify-between gap-2 flex-1 p-6 w-full">
        <div className="text-lg font-semibold text-neutral-500">TBD</div>
        <div className="text-2xl font-bold text-neutral-600">0</div>
      </div>
    )
  }

  const name = participant.team?.name || participant.user?.nickname || 'Unknown Player'
  const image = participant.team?.profileImage || participant.user?.profileImage

  const teamId = getParticipantId(participant)

  const handleClick = () => {
    if (swapMode && onParticipantSelectForSwap) {
      onParticipantSelectForSwap()
    } else if (participant.team && onTeamClick) {
      onTeamClick(participant)
    }
  }

  return (
    <div
      className={`group overflow-hidden flex self-stretch items-center gap-4 sm:gap-5 2xl:gap-10 flex-1 transition-all duration-150 p-2 lg:p-4 2xl:p-6 cursor-pointer ${isHighlighted ? 'bg-[#d6275661]' : ''} ${isSelectedForSwap ? 'ring-2 ring-defendrRed' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => onHoverTeam?.(teamId)}
      onMouseLeave={() => onHoverTeam?.(null)}
      aria-selected={isHighlighted}
      title={participant.team?.name || 'Click to view team'}
    >
      <div className={`flex items-center justify-center text-center flex-1 gap-2`}>
        {image && (
          <Image
            src={image}
            width={45}
            height={45}
            alt={name}
            draggable={false}
            className={`flex h-full min-h-full! w-auto aspect-square rounded-xl border-2 object-cover ${
              isHighlighted
                ? 'border-defendrRed ring-1 ring-defendrRed/30'
                : 'border-transparent group-hover:border-defendrRed'
            }`}
            onError={e => {
              e.currentTarget.src = '/assets/organization/default_org_icon.jpg'
            }}
          />
        )}

        <p
          className={`flex items-center line-clamp-2 max-sm:w-25 sm:text-xs md:text-sm lg:text-base 2xl:text-lg flex-1`}
        >
          {name}
        </p>
      </div>
      <div
        className={`flex items-center font-bold sm:font-extrabold text-3xl ${
          winner ? 'text-defendrGreen' : 'text-defendrRed'
        } ${isHighlighted ? 'drop-shadow-[0_0_8px_rgba(214,39,85,0.5)] brightness-110' : ''}`}
      >
        {participant.score}
      </div>
    </div>
  )
}

const ChampionCard = ({
  participant,
  title,
  isTournamentChampion = false,
}: {
  participant: ParticipantWithScore | null
  title: string
  isTournamentChampion?: boolean
}) => {
  if (!participant) {
    return (
      <div className="rounded-2xl bg-linear-to-br from-[#d62755] to-[#a01f40] border-2 border-yellow-400 p-6 flex flex-col items-center justify-center gap-4 min-h-75">
        <div className="text-6xl">👑</div>
        <div className="text-2xl font-bold text-white">No Champion Yet</div>
        <div className="text-sm text-yellow-200">Tournament in progress</div>
      </div>
    )
  }

  const name = participant.team?.name || participant.user?.nickname || 'Unknown'
  const image = participant.team?.profileImage || participant.user?.profileImage

  return (
    <div className="relative py-4 px-8 bg-amber-400/20 border-amber-400 border-2 rounded-2xl flex flex-col items-center justify-center gap-4">
      {image && (
        <Image
          src={image}
          width={45}
          height={45}
          alt={name}
          className="h-17.5 w-auto aspect-square rounded-xl border-2 border-transparent group-hover:border-defendrRed object-cover"
          onError={e => {
            e.currentTarget.src = '/assets/organization/default_org_icon.jpg'
          }}
        />
      )}
      <div className="text-center">
        <p className="text-xl font-bold">{name}</p>
        <p className="text-amber-400">{title}</p>
      </div>
      <div className="text-7xl absolute bottom-full translate-y-4">
        {isTournamentChampion ? '🏆' : '👑'}
      </div>
    </div>
  )
}

export default EliminationBracket
