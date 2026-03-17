'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Calendar, Users, Building2, Lock } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { tournamentImageSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'
import { checkIfUserInTournament, getActualUserParticipantId } from '@/services/tournamentService'
import { isTeamOwner } from '@/utils/teamUtils'
import {
  enrollParticipant,
  cancelParticipation,
  getParticipantById,
} from '@/services/participantService'
import { getTeamById } from '@/services/teamService'

interface TournamentCardProps {
  tournament: any
  statusTag?: { label: string; variant?: 'success' | 'warning' | 'danger' | 'neutral' }
}

const TournamentCard = ({ tournament, statusTag }: TournamentCardProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isJoining, setIsJoining] = useState(false)
  const [isInTournament, setIsInTournament] = useState(false)
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [checkingEnrollment, setCheckingEnrollment] = useState(true)
  const [canLeaveTournament, setCanLeaveTournament] = useState(false)

  // ── Date ──────────────────────────────────────────────────────────────────
  const startDate = new Date(tournament.startDate)
  const day = startDate.getDate()
  const month = startDate.toLocaleString('en-US', { month: 'short' })
  const year = startDate.getFullYear()
  const daySuffix = (d: number) => {
    if (d >= 11 && d <= 13) return 'th'
    switch (d % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }
  const formattedDate = `${day}${daySuffix(day)} ${month} ${year}`

  // Registration end date
  const regEndRaw =
    tournament.registrationEndDate ||
    tournament.structureProcess?.registrationEndDate ||
    tournament.joinProcess?.deadline ||
    tournament.endDate
  const formattedRegEnd = regEndRaw
    ? (() => {
        const d = new Date(regEndRaw)
        const dd = d.getDate()
        return `${dd}${daySuffix(dd)} ${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`
      })()
    : null

  useEffect(() => {
    async function checkEnrollmentAndPermissions() {
      if (!session?.user?._id || !tournament._id) {
        setCheckingEnrollment(false)
        return
      }
      try {
        const enrolled = await checkIfUserInTournament(tournament._id, session.user._id)
        setIsInTournament(enrolled)
        if (enrolled) {
          const pId = await getActualUserParticipantId(tournament._id, session.user._id)
          setParticipantId(pId)
          let canLeave = false
          if (tournament.gameMode === 'Team' && pId) {
            try {
              const participant = await getParticipantById(pId)
              const team = await getTeamById(participant.team)
              if (team) canLeave = isTeamOwner(team, session.user._id)
            } catch {}
          } else if (!tournament.teamParticipant) {
            const soloParticipant = tournament.participants?.find(
              (p: { user: any }) =>
                (typeof p.user === 'string' ? p.user : p.user?._id) === session.user._id,
            )
            canLeave = !!soloParticipant
          }
          setCanLeaveTournament(canLeave)
        } else {
          setParticipantId(null)
          setCanLeaveTournament(false)
        }
      } catch {
        setIsInTournament(false)
        setParticipantId(null)
        setCanLeaveTournament(false)
      } finally {
        setCheckingEnrollment(false)
      }
    }
    checkEnrollmentAndPermissions()
  }, [session?.user?._id, tournament._id, tournament.teamParticipant, tournament.participants])

  // ── Tournament state ──────────────────────────────────────────────────────
  const hasTournamentStarted = new Date(tournament.startDate) < new Date()
  const hasBracketsGenerated = !!(
    tournament.bracket ||
    tournament.looserBracket ||
    (tournament.swissBrackets && tournament.swissBrackets.length > 0)
  )
  const hasTournamentEnded =
    tournament.isClosed ||
    tournament.winner ||
    (tournament.bracket && tournament.bracket.finished) ||
    (tournament.looserBracket && tournament.looserBracket.finished) ||
    (tournament.swissBrackets && tournament.swissBrackets.some((b: any) => b.finished))
  const isTournamentActive = tournament.started || hasTournamentStarted || hasBracketsGenerated

  // ── Button state ──────────────────────────────────────────────────────────
  const getTournamentStatus = () => {
    if (hasTournamentEnded) return { text: 'Ended', variant: 'black' as const }
    if (isTournamentActive) return { text: 'View Bracket', variant: 'black' as const }
    if (isInTournament) return { text: 'Leave Tournament', variant: 'contained-red' as const }
    return { text: 'View Tournament', variant: 'contained-green' as const }
  }
  const status = getTournamentStatus()

  // ── Derived UI ────────────────────────────────────────────────────────────
  const participantCount = tournament.participants?.length ?? 0
  const maxParticipants = tournament.maxParticipants ?? 128
  const isFull = participantCount >= maxParticipants
  const isFreeEntry = !(tournament.joinProcess?.entryFee > 0)
  const organizerName = typeof tournament.createdBy === 'object' ? tournament.createdBy?.name : null

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCardClick = () => {
    if (tournament._id) router.replace(`/tournament/${tournament._id}`)
    else toast.error('An unexpected issue occurred. Please try again shortly.')
  }

  const handleJoinTournament = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!tournament._id) {
      toast.error('Tournament not found')
      return
    }
    if (!session?.user?._id) {
      toast.error('Please log in to join tournaments')
      router.push('/auth/signin')
      return
    }

    if (isInTournament && participantId) {
      if (!canLeaveTournament) {
        toast.error(
          tournament.teamParticipant ? 'Only team owners can leave' : 'Unable to leave tournament',
        )
        return
      }
      setIsJoining(true)
      try {
        await cancelParticipation(tournament._id, participantId)
        setIsInTournament(false)
        setParticipantId(null)
        setCanLeaveTournament(false)
        toast.success('Left tournament successfully')
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Failed to leave tournament'
        if (msg.includes('Authentication token missing')) {
          toast.error('Please log in to perform this action')
          router.push('/auth/signin')
        } else {
          toast.error(msg)
        }
      } finally {
        setIsJoining(false)
      }
    } else {
      router.push(`/tournament/${tournament._id}`)
    }
  }

  return (
    <div
      className="group w-full flex flex-col overflow-hidden rounded-xl bg-[#111114] border border-white/[0.07] hover:border-white/[0.14] transition-all duration-300 cursor-pointer shrink-0 hover:shadow-xl hover:shadow-black/40"
      onClick={handleCardClick}
    >
      {/* ── Cover image ─────────────────────────────────────────────────── */}
      <div className="relative w-full h-36 overflow-hidden">
        <Image
          fill
          alt={tournament.name}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          src={tournamentImageSanitizer(tournament?.coverImage, DEFAULT_IMAGES.TOURNAMENT)}
          onError={e => {
            e.currentTarget.src = DEFAULT_IMAGES.TOURNAMENT
          }}
        />
        {/* Gradient bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent pointer-events-none" />

        {/* Top-left: entry type badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-sm ${
              isFreeEntry
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}
          >
            {!isFreeEntry && <Lock size={9} />}
            {isFreeEntry ? 'Free Entry' : 'Paid Entry'}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${
              isFull
                ? 'bg-red-500/25 text-red-200 border border-red-500/40'
                : 'bg-black/40 text-white border border-white/20'
            }`}
          >
            <Users size={11} />
            {participantCount}/{maxParticipants}
          </span>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 p-3.5 flex-1">
        {/* Name */}
        <Typo
          as="h3"
          className="text-sm font-semibold leading-snug line-clamp-2 text-white group-hover:text-rose-100 transition-colors duration-200"
          fontFamily="poppins"
          fontVariant="p3"
        >
          {tournament.name}
        </Typo>

        {/* Meta rows */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Calendar size={10} />
              Reg. Starts
            </span>
            <span className="text-[11px] text-gray-300 font-medium">{formattedDate}</span>
          </div>

          {formattedRegEnd &&
            (() => {
              const regEnded = regEndRaw ? new Date(regEndRaw) < new Date() : false
              return (
                <div className="flex items-center justify-between">
                  <span
                    className={`flex items-center gap-1.5 text-[11px] ${regEnded ? 'text-gray-600' : 'text-gray-500'}`}
                  >
                    <Calendar
                      size={10}
                      className={regEnded ? 'text-gray-600' : 'text-amber-400/70'}
                    />
                    Reg. Ends
                  </span>
                  <span
                    className={`text-[11px] font-medium ${regEnded ? 'text-gray-600 line-through' : 'text-amber-300/80'}`}
                  >
                    {formattedRegEnd}
                  </span>
                </div>
              )
            })()}
          {organizerName && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Building2 size={10} />
                Organized by
              </span>
              <span className="text-[11px] text-gray-300 font-medium truncate max-w-[110px]">
                {organizerName}
              </span>
            </div>
          )}
        </div>

        {/* Participants progress bar */}
        <div className="space-y-1">
          <div className="w-full h-1 bg-white/[0.07] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (participantCount / maxParticipants) * 100)}%` }}
            />
          </div>
        </div>

        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* ── CTA button ──────────────────────────────────────────────── */}
        <div onClick={e => e.stopPropagation()}>
          {checkingEnrollment ? (
            <div className="w-full py-2.5 rounded-xl bg-white/[0.05] flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : !session?.user?._id ? (
            <Button
              className="w-full"
              fontFamily="poppins"
              label="Login to Join"
              size="xs"
              variant="outlined-grey"
              onClick={() => router.push('/auth/signin')}
            />
          ) : (
            <Button
              className="w-full"
              disabled={
                hasTournamentEnded ||
                isTournamentActive ||
                isJoining ||
                (isInTournament && !canLeaveTournament)
              }
              fontFamily="poppins"
              label={isJoining ? 'Processing…' : status.text}
              size="xs"
              variant={status.variant}
              onClick={handleJoinTournament}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default TournamentCard
