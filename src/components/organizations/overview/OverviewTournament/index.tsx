'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import Input from '@/components/ui/Inputs'
import ServerTournamentCard from '@/components/ui/ServerTournamentCard'

interface Tournament {
  _id?: string
  name: string
  description?: string
  coverImage?: string
  startDate: string | Date
  participants?: unknown[]
  maxParticipants?: number
  publishing?: boolean
  createdAt?: string | Date
  [key: string]: unknown
}

interface OverviewTournamentProps {
  tournaments: Tournament[]
  organization?: any
}

const STAFF_ROLES = ['Founder', 'Admin', 'Bracket Manager', 'Moderator']

const OverviewTournament = ({ tournaments, organization }: OverviewTournamentProps) => {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Check if current user is org staff (Founder, Admin, Bracket Manager, Moderator)
  const isOrganizationStaff = (): boolean => {
    if (!session?.user?._id || !organization) return false

    const creatorId =
      typeof organization.createdBy === 'string'
        ? organization.createdBy
        : organization.createdBy?._id
    if (creatorId === session.user._id) return true

    if (!organization.staff) return false
    return organization.staff.some((s: any) => {
      const staffUserId = typeof s.user === 'string' ? s.user : s.user?._id || s.user?.id
      return staffUserId === session.user?._id && STAFF_ROLES.includes(s.role)
    })
  }

  const isStaff = isOrganizationStaff()

  // Update scroll arrow visibility
  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [filteredTournaments])

  useEffect(() => {
    const filtered = (tournaments || [])
      .filter(t => (isStaff ? true : t?.publishing))
      .filter(t => (t?.name || '').toString().toLowerCase().includes(searchQuery.toLowerCase()))
      // Sort by newest first
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.startDate).getTime()
        const dateB = new Date(b.createdAt || b.startDate).getTime()
        return dateB - dateA
      })

    setFilteredTournaments(filtered)
  }, [searchQuery, tournaments, organization, session])

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    // Scroll by roughly one card width + gap
    const cardWidth = el.querySelector(':scope > div > div')?.clientWidth || 360
    const amount = direction === 'left' ? -(cardWidth + 24) : cardWidth + 24
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  // Empty state
  if (!tournaments || tournaments.filter(t => (isStaff ? true : t?.publishing)).length === 0) {
    return (
      <div className="flex-1 mt-5 space-y-6">
        <div className="flex items-center justify-center w-full min-h-[160px] text-gray-400 font-poppins px-4">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-gray-500" />
            </div>
            <Typo as="h2" className="font-semibold text-lg" color="white" fontVariant="h4">
              {isStaff ? 'No tournaments created yet.' : 'No published tournaments yet.'}
            </Typo>
            <p className="text-sm text-gray-500 font-poppins">
              {isStaff
                ? 'Create your first tournament to get started.'
                : 'Check back later for upcoming tournaments.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 mt-5 space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#D62555]/15 rounded-xl flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4 text-[#D62555]" />
          </div>
          <Typo as="h2" color="white" fontVariant="h3" className="font-bold font-poppins">
            Featured Tournaments
          </Typo>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Input
            size="xs"
            placeholder="Search tournaments ..."
            value={searchQuery}
            onChange={(v: string) => setSearchQuery(v)}
            backgroundColor="#1f2937"
            borderColor="rgba(255,255,255,0.08)"
            className="w-full sm:w-48 rounded-xl"
          />

          {isStaff && (
            <Link
              href="/myTournaments"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all duration-200 whitespace-nowrap"
            >
              View All My Tournaments
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Horizontal scrollable row with arrows */}
      {filteredTournaments.length > 0 ? (
        <div className="relative group/scroll">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollBy('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 rounded-full bg-[#212529] border border-white/10 hover:border-white/25 hover:bg-[#2c3036] flex items-center justify-center text-white shadow-lg shadow-black/40 transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollBy('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 rounded-full bg-[#212529] border border-white/10 hover:border-white/25 hover:bg-[#2c3036] flex items-center justify-center text-white shadow-lg shadow-black/40 transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth px-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex gap-5" style={{ width: 'max-content' }}>
              {filteredTournaments.map(tournament => (
                <div
                  key={tournament._id}
                  className="w-[calc(33.333vw-3.5rem)] min-w-[280px] max-w-[380px] shrink-0"
                >
                  <ServerTournamentCard
                    tournament={{
                      _id: tournament._id || '',
                      name: tournament.name,
                      description: tournament.description,
                      startDate:
                        typeof tournament.startDate === 'string'
                          ? tournament.startDate
                          : new Date(tournament.startDate).toISOString(),
                      participants: tournament.participants,
                      maxParticipants: tournament.maxParticipants,
                      coverImage: tournament.coverImage,
                    }}
                    view={isStaff ? 'organized' : 'joined'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full min-h-[120px] text-gray-400 text-base font-poppins px-4 bg-[#212529] rounded-2xl border border-white/5">
          No tournaments match your search.
        </div>
      )}
    </div>
  )
}

export default OverviewTournament
