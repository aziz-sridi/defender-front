'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Users } from 'lucide-react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import Loader from '@/app/loading'
import { VariantImage } from '@/components/ui/VariantImage'
import { getTournamentsByOrganizerId } from '@/services/tournamentService'
import { imageUrlSanitizer } from '@/utils/imageUrlSanitizer'

export default function MyTournamentsPage() {
  const router = useRouter()
  const { userId } = useParams<{ userId: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tournaments, setTournaments] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    async function fetchData() {
      setLoading(true)
      try {
        const res = await getTournamentsByOrganizerId(userId)
        if (!mounted) {
          return
        }
        const list = Array.isArray(res?.tournaments)
          ? res.tournaments
          : Array.isArray(res)
            ? res
            : []
        setTournaments(list)
        setError(null)
      } catch (e: any) {
        setError(e?.message || 'Failed to load tournaments')
        setTournaments([])
      } finally {
        setLoading(false)
      }
    }
    if (userId) {
      fetchData()
    }
    return () => {
      mounted = false
    }
  }, [userId])

  const goSettings = (tid: string) => {
    router.push(`/tournament/setup?tid=${tid}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-height-[60vh] text-white">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        <Typo as="h2" fontFamily="poppins" fontVariant="h2">
          My Tournaments
        </Typo>
        <div className="mt-6 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-[#161616] text-white">
      <Typo as="h1" className="mb-6" color="white" fontFamily="poppins" fontVariant="h1">
        My Tournaments
      </Typo>

      {tournaments.length === 0 ? (
        <div className="text-gray-400">No tournaments created yet.</div>
      ) : (
        <div className="flex flex-col gap-4 max-w-4xl">
          {tournaments.map(tournament => (
            <div
              key={tournament._id}
              className="flex flex-col gap-2 overflow-hidden bg-[#212529] p-5 rounded-lg shadow-red-900 shadow-md"
            >
              <div className="flex justify-between p-2">
                <Typo as="p" className="mb-1" color="red" fontVariant="p5">
                  {new Date(tournament.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typo>
                <div className="flex items-center gap-2">
                  <Users className="text-ghostGrey" size={18} />
                  <Typo as="span" color="ghostGrey" fontVariant="p5">
                    {tournament.participants?.length || 0}/{tournament.maxParticipants || 0}
                  </Typo>
                  <VariantImage
                    alt={tournament.name}
                    className="w-12 h-11 ms-4 hidden sm:block"
                    src={imageUrlSanitizer(
                      tournament.coverImage,
                      'https://defendr.gg/assets/images/defualt-tournament-cover.jpg',
                    )}
                  />
                </div>
              </div>
              <Typo as="p" className="text-sm lg:text-base mb-1" color="white" fontVariant="p2">
                {tournament.name}
              </Typo>
              <Typo
                as="p"
                className="mb-1"
                color="custom868484"
                fontFamily="poppins"
                fontVariant="p4"
              >
                {(tournament.description || '').length > 100
                  ? `${(tournament.description || '').slice(0, 100)}...`
                  : tournament.description || ''}
              </Typo>
              <div className="flex flex-col justify-end items-end gap-3">
                <VariantImage
                  alt={tournament.name}
                  className="w-10 h-10 ms-4 sm:hidden"
                  src={imageUrlSanitizer(
                    tournament.coverImage,
                    'https://defendr.gg/assets/images/defualt-tournament-cover.jpg',
                  )}
                />
                <Button
                  className="bg-defendrRed text-white text-center rounded-lg"
                  label="Settings"
                  size="xxs"
                  onClick={() => goSettings(tournament._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
