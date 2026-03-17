'use client'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import Loader from '@/app/loading'
import About from '@/components/organizations/overview/about'
import CoverOverviewTournaments from '@/components/organizations/overview/CoverOverviewTournaments'
import Memberships from '@/components/organizations/overview/Memberships'
import OverviewFollowers from '@/components/organizations/overview/OverviewFollowers'
import OverviewImpact from '@/components/organizations/overview/OverviewImpact'
import OverviewRanking from '@/components/organizations/overview/OverviewRanking'
import OverviewStats from '@/components/organizations/overview/OverviewStats'
import OverviewTeam from '@/components/organizations/overview/OverviewTeam'
import OverviewTournament from '@/components/organizations/overview/OverviewTournament'
import BannerFollowDefender from '@/components/ui/BannerFollowDefender'
import { getOrganizationById } from '@/services/organizationService'
import { getTournamentById } from '@/services/tournamentService'
{
  /*import Footer from '@/components/home/Footer'*/
}

const navigationButtons = [
  { title: 'Overview', link: 'main' },
  { title: 'Stats', link: 'stats' },
  { title: 'Team', link: 'team' },
  { title: 'Followers', link: 'followers' },
  { title: 'Ranking', link: 'ranking' },
  { title: 'Impact', link: 'impact' },
]

const Page = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const organizationId = params.id as string
  const currentPage = searchParams.get('tab') || 'main'
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [organization, setOrganization] = useState<any>(null)
  const [tournaments, setTournaments] = useState<any[]>([])
  useEffect(() => {
    const fetchData = async () => {
      if (!organizationId) {
        setOrganization(undefined)
        router.replace('/')
        return
      }
      try {
        const org = await getOrganizationById(organizationId)
        if (!org) {
          router.replace('/')
          return
        }
        setOrganization(org)
        if (org?.tournaments?.length > 0) {
          const tList: any[] = []
          for (const id of org.tournaments) {
            try {
              const t = await getTournamentById(id)
              if (t) {
                tList.push(t)
              }
            } catch (err) {
              console.log(`Failed to fetch tournament ${id}:`, err)
            }
          }
          setTournaments(tList)
        }
        setLoading(false)
      } catch (error) {
        router.replace('/organization')
        return
      }
    }
    fetchData()
  }, [organizationId, router])
  const renderComponent = () => {
    switch (currentPage) {
      case 'main':
        return <OverviewTournament tournaments={tournaments} organization={organization} />
      case 'stats':
        return <OverviewStats organization={organization} />
      case 'team':
        return <OverviewTeam organization={organization} />
      case 'followers':
        return <OverviewFollowers organization={organization} />
      case 'ranking':
        return <OverviewRanking organization={organization} />
      case 'impact':
        return <OverviewImpact />
      default:
        return <OverviewTournament tournaments={tournaments} organization={organization} />
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="w-full bg-defendrBg mt-5 pb-40">
        <CoverOverviewTournaments organization={organization} />
        <nav className="px-4 md:px-10 py-4 md:py-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 flex gap-1 overflow-x-auto whitespace-nowrap">
            {navigationButtons.map((btn, i) => (
              <Link
                key={i}
                className={`${
                  btn.link === currentPage
                    ? 'bg-defendrRed text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                } relative px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-200 text-sm md:text-base font-medium capitalize text-center flex-shrink-0`}
                href={`/organization/${organizationId}/Profile?tab=${btn.link}`}
              >
                {btn.title}
              </Link>
            ))}
          </div>
        </nav>

        <section className="px-4 md:px-10 flex flex-col gap-6 md:gap-10 w-full mb-6 md:mb-10">
          {currentPage === 'main' && (
            <div className="w-full flex flex-col gap-2 md:gap-3">
              <About organization={organization} />
            </div>
          )}
          {renderComponent()}
          {currentPage === 'main' && (
            <div className="w-full flex flex-col gap-2 md:gap-3">
              <Memberships />
            </div>
          )}
        </section>

        <BannerFollowDefender />
        {/*<Footer />*/}
      </div>
    </>
  )
}

export default Page
