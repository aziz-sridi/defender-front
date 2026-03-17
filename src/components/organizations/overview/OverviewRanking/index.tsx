import { useEffect, useState } from 'react'

import Typo from '@/components/ui/Typo'
import { getOrganizationById } from '@/services/organizationService'
import type { Organization } from '@/types/organizationType'
import Loader from '@/app/loading'
interface OverviewRankingProps {
  organization: Organization
}

const OverviewRanking = ({ organization }: OverviewRankingProps) => {
  const [ranking, setRanking] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRanking = async () => {
      if (!organization?._id) {
        return
      }
      setLoading(false)
      setError(null)
      try {
        const data = await getOrganizationById(organization._id)
        setRanking(data.ranking ?? null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch ranking')
      } finally {
        setLoading(false)
      }
    }
    fetchRanking()
  }, [organization])

  if (loading) {
    return (
      <div className="p-6 rounded-xl flex-1 flex items-center justify-center text-white bg-zinc-900/60 ring-1 ring-white/10">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl flex-1 flex items-center justify-center text-red-400 bg-red-950/20 ring-1 ring-red-900/40">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-black text-white p-6 md:p-8 rounded-xl">
      <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-2 md:gap-4">
        <div>
          <Typo as="h2" className="md:text-2xl text-xl font-semibold" fontVariant="h2">
            Ranking
          </Typo>
          <Typo as="p" className="mt-1 text-xs md:text-sm" color="grey" fontVariant="p5">
            Organization leaderboard position
          </Typo>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[200px]">
        {ranking !== null ? (
          <>
            <Typo
              as="span"
              className="text-5xl md:text-7xl font-bold text-yellow-400"
              fontVariant="h1"
            >
              #{ranking}
            </Typo>
            <Typo as="p" className="mt-2 text-lg md:text-xl" color="grey" fontVariant="p4">
              Current national ranking
            </Typo>
          </>
        ) : (
          <Typo as="span" className="text-center" color="grey" fontVariant="h3">
            No ranking data available
          </Typo>
        )}
      </div>
    </div>
  )
}

export default OverviewRanking
