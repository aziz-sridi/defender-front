import React, { useEffect, useState } from 'react'

import Loader from '@/app/loading'
import { getGeneralStats } from '@/components/organizations/overview/generalStats'
import Button from '@/components/ui/Button'
import { DiscordWB } from '@/components/ui/Icons/DiscordWB'
import { FacebookWB } from '@/components/ui/Icons/FacebookWB'
import { InstagramWB } from '@/components/ui/Icons/InstgramWB'
import { TwitterWB } from '@/components/ui/Icons/TwitterWB'
import Typo from '@/components/ui/Typo'
import { getTournamentById } from '@/services/tournamentService'

interface OrganizationOverviewProps {
  organization: any
}

const iconMapping: Record<string, React.ElementType> = {
  facebook: FacebookWB,
  twitter: TwitterWB,
  instagram: InstagramWB,
  discord: DiscordWB,
}

const OrganizationOverview: React.FC<OrganizationOverviewProps> = ({ organization }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [tournaments, setTournaments] = useState<any[]>([])

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const ids = Array.isArray(organization?.tournaments) ? organization.tournaments : []
        const promises = ids.map((id: string) => getTournamentById(id).catch(() => null))
        const data = await Promise.all(promises)
        setTournaments(data.filter(Boolean))
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchTournaments()
  }, [organization])

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center p-6">
        <Loader />
      </div>
    )
  }
  if (!organization || organization === 'undefined') {
    return
  }
  if (error) {
    return (
      <div className="flex w-full items-center justify-center p-6">
        <Typo as="p" color="red" fontVariant="p2">
          Error: {error}
        </Typo>
      </div>
    )
  }
  const { organizedTournaments, totalParticipants, totalPrizeMoney } = getGeneralStats(
    organization,
    tournaments,
  )

  const socialMediaLinks = organization?.socialMedia || organization?.socialMediaLinks

  return (
    <div className="w-full text-white grid grid-cols-1 mt-6 md:grid-cols-2 gap-6 md:gap-8">
      <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/10 p-6 md:p-7 shadow-lg">
        <div className="mb-4">
          <Typo as="h3" color="white" fontVariant="h3">
            About {organization?.name || 'Organisation'}
          </Typo>
          <Typo as="p" color="grey" fontFamily="poppins" fontVariant="p5">
            Organization details and mission
          </Typo>
        </div>
        <Typo
          as="p"
          className="leading-relaxed"
          color="white"
          fontFamily="poppins"
          fontVariant="p3"
        >
          {organization?.bio || ``}
        </Typo>

        <div className="mt-6">
          <Typo as="p" color="white" fontVariant="p3b">
            Social Media
          </Typo>
          <div className="mt-3 flex flex-wrap gap-3">
            {Object.keys(socialMediaLinks).map(key => {
              const url = (socialMediaLinks as Record<string, string>)[key]
              const Icon = iconMapping[key]
              if (url && Icon) {
                return (
                  <Button
                    key={key}
                    className="rounded-xl bg-zinc-800 hover:bg-zinc-700/80"
                    href={url}
                    icon={
                      <span className="relative block h-6 w-6">
                        <Icon height={24} width={24} />
                      </span>
                    }
                    iconOrientation="left"
                    size="xxxs"
                    variant="contained-ghostRed"
                  />
                )
              }
              return null
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/10 p-6 md:p-7 shadow-lg">
          <div className="mb-4">
            <Typo as="h3" color="white" fontVariant="h3">
              Quick Stats
            </Typo>
            <Typo as="p" color="grey" fontFamily="poppins" fontVariant="p5">
              Performance metrics and achievements
            </Typo>
          </div>
          <div className="grid grid-cols-3 divide-x divide-zinc-800 text-center">
            <div className="px-2">
              <Typo as="p" color="white" fontFamily="poppins" fontVariant="h4" fontWeight="bold">
                {organizedTournaments}
              </Typo>
              <Typo as="p" className="mt-1" color="grey" fontFamily="poppins" fontVariant="p6">
                Organized
                <br />
                Tournaments
              </Typo>
            </div>
            <div className="px-2">
              <Typo as="p" color="white" fontFamily="poppins" fontVariant="h4" fontWeight="bold">
                {totalParticipants}+
              </Typo>
              <Typo as="p" className="mt-1" color="grey" fontFamily="poppins" fontVariant="p6">
                Participation
                <br />
                in Tournament
              </Typo>
            </div>
            <div className="px-2">
              <Typo as="p" color="white" fontFamily="poppins" fontVariant="h4" fontWeight="bold">
                ${totalPrizeMoney}+
              </Typo>
              <Typo as="p" className="mt-1" color="grey" fontFamily="poppins" fontVariant="p6">
                Prize
                <br />
                Money
              </Typo>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/10 p-6 md:p-7 shadow-lg">
          <Typo as="h3" className="mb-6" color="white" fontVariant="h3">
            Earned Badges
          </Typo>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🏆</span>
            </div>
            <Typo as="p" color="grey" fontFamily="poppins" fontVariant="p4">
              No earned badges yet
            </Typo>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationOverview
