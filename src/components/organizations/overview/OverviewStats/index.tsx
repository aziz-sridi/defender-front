'use client'

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend as ChartLegend,
  Tooltip as ChartTooltip,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from 'chart.js'
import React, { useEffect, useState } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'

import Loader from '@/app/loading'
import Star from '@/components/ui/Icons/Star'
import Typo from '@/components/ui/Typo'
import { getTournamentById } from '@/services/tournamentService'
import { getGeneralStats } from '@/components/organizations/overview/generalStats'
import { Tournament } from '@/types/tournamentType'
import { Organization } from '@/types/organizationType'

ChartJS.register(
  ArcElement,
  ChartTooltip,
  ChartLegend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
)

interface OverviewStatsProps {
  organization: Organization
}

const COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
]

const OverviewStats: React.FC<OverviewStatsProps> = ({ organization }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  //we are using this bcz chartjs doesn't understand  css var only if it's js
  const root = document.documentElement
  const defendrRed = getComputedStyle(root).getPropertyValue('--defendr-red').trim()
  const defendrBg = getComputedStyle(root).getPropertyValue('--defendr-bg').trim()
  const defendrLightBlack = getComputedStyle(root).getPropertyValue('--defendr-lightBlack').trim()
  const defendrSilver = getComputedStyle(root).getPropertyValue('--defendr-silver').trim()

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const ids = Array.isArray(organization?.tournaments) ? organization.tournaments : []
        const promises = ids.map((id: string) => getTournamentById(id).catch(() => null))
        const data = await Promise.all(promises)
        setTournaments(data.filter(Boolean) as Tournament[])
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchTournaments()
  }, [organization])

  if (!organization || isLoading) {
    return (
      <div className="p-6 rounded-xl flex-1 flex items-center justify-center text-white bg-defendrBg/60 ring-1 ring-white/10">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl flex-1 flex items-center justify-center text-defendrRed bg-defendrRed/20 ring-1 ring-defendrRed/40">
        Error: {error}
      </div>
    )
  }
  const generalStats = getGeneralStats(organization, tournaments) || {}
  const { organizedTournaments = 0, totalParticipants = 0, totalPrizeMoney = '0' } = generalStats
  const gameParticipationMap = new Map<string, number>()
  const tournamentGrowthMap = new Map<string, number>()

  tournaments.forEach(tournament => {
    if (tournament) {
      const gameName = tournament.game?.name || (tournament.game as string) || 'Unknown'
      gameParticipationMap.set(
        gameName,
        (gameParticipationMap.get(gameName) || 0) + (tournament.participants?.length || 0),
      )
      const year = new Date(tournament.createdAt).getFullYear().toString()
      tournamentGrowthMap.set(year, (tournamentGrowthMap.get(year) || 0) + 1)
    }
  })

  const gameParticipationData = Array.from(gameParticipationMap).map(([name, value]) => ({
    name,
    value,
  }))

  const tournamentGrowthData = Array.from(tournamentGrowthMap)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => Number(a.year) - Number(b.year))

  const rating = organization?.rating || 0
  const renderStars = (starRating: number) => {
    const stars = [] as React.ReactNode[]
    const fullStars = Math.floor(starRating)
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-yellow-400" />)
    }
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`star-empty-${i}`} className="text-defendrGrey" />)
    }
    return stars
  }

  const pieChartData =
    gameParticipationData.length > 0
      ? {
          labels: gameParticipationData.map(g => g.name),
          datasets: [
            {
              data: gameParticipationData.map(g => g.value),
              backgroundColor: COLORS,
              borderWidth: 0,
            },
          ],
        }
      : null

  const barChartData =
    gameParticipationData.length > 0
      ? {
          labels: gameParticipationData.map(g => g.name),
          datasets: [
            {
              data: gameParticipationData.map(g => g.value),
              backgroundColor: COLORS.slice(0, gameParticipationData.length),
              borderRadius: 8,
              barPercentage: 0.8,
              categoryPercentage: 0.7,
              maxBarThickness: 32,
            },
          ],
        }
      : null

  const lineChartData =
    tournamentGrowthData.length > 0
      ? {
          labels: tournamentGrowthData.map(t => t.year),
          datasets: [
            {
              data: tournamentGrowthData.map(t => t.count),
              borderColor: defendrRed,
              backgroundColor: defendrBg,
              tension: 0.35,
              fill: true,
              pointRadius: 2,
              pointBackgroundColor: defendrRed,
              pointHoverRadius: 4,
            },
          ],
        }
      : null

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    rotation: -90,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  } as const

  const commonGridColor = defendrLightBlack
  const tickColor = defendrSilver

  const growthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { grid: { color: commonGridColor }, ticks: { color: tickColor } },
      y: { grid: { color: commonGridColor }, ticks: { color: tickColor } },
    },
  } as const

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { grid: { display: false }, ticks: { color: tickColor } },
      y: { grid: { display: true, color: commonGridColor }, ticks: { color: tickColor } },
    },
  } as const

  const hasGameData = gameParticipationData.length > 0 && totalParticipants > 0
  const hasGrowthData = tournamentGrowthData.length > 0
  return (
    <div className="bg-gradient-to-b from-zinc-900 to-black text-white p-6 md:p-8 rounded-xl">
      <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-2 md:gap-4">
        <div>
          <Typo as="h2" className="md:text-2xl text-xl font-semibold" fontVariant="h2">
            {organization?.name || 'Organization'}
          </Typo>
          <Typo as="p" className="mt-1 text-xs md:text-sm" color="grey" fontVariant="p5">
            Overview and insights
          </Typo>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-zinc-900/60 ring-1 ring-white/10 hover:ring-white/20 transition rounded-xl p-4 md:p-6 shadow-lg flex flex-col items-start">
          <Typo as="h3" className="text-sm" color="grey" fontVariant="p3">
            Organized Tournaments
          </Typo>
          <Typo
            as="span"
            className="mt-2 tracking-tight text-3xl md:text-4xl font-bold"
            fontVariant="h2"
          >
            {organizedTournaments.toLocaleString()}
          </Typo>
          <Typo as="p" className="mt-1 text-[11px]" color="grey" fontVariant="p6">
            All-time count
          </Typo>
        </div>
        <div className="bg-zinc-900/60 ring-1 ring-white/10 hover:ring-white/20 transition rounded-xl p-4 md:p-6 shadow-lg flex flex-col items-start">
          <Typo as="h3" className="text-sm" color="grey" fontVariant="p3">
            Number of Participants
          </Typo>
          <Typo
            as="span"
            className="mt-2 tracking-tight text-3xl md:text-4xl font-bold"
            fontVariant="h2"
          >
            {totalParticipants.toLocaleString()}
          </Typo>
          <Typo as="p" className="mt-1 text-[11px]" color="grey" fontVariant="p6">
            Across tournaments
          </Typo>
        </div>
        <div className="bg-zinc-900/60 ring-1 ring-white/10 hover:ring-white/20 transition rounded-xl p-4 md:p-6 shadow-lg flex flex-col items-start">
          <Typo as="h3" className="text-sm" color="grey" fontVariant="p3">
            Rating
          </Typo>
          <div className="flex items-center mt-2">
            <Typo as="span" className="text-3xl md:text-4xl font-bold" fontVariant="h2">
              {rating.toFixed(1)}
            </Typo>
            <div className="flex ml-2">{renderStars(rating)}</div>
          </div>
          <Typo as="p" className="mt-1 text-[11px]" color="grey" fontVariant="p6">
            Based on recent reviews
          </Typo>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-zinc-900/60 ring-1 ring-white/10 rounded-xl p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Typo as="h3" className="text-lg font-semibold" fontVariant="p2b">
              Game Participation
            </Typo>
            {!hasGameData && (
              <Typo as="span" className="text-xs" color="grey" fontVariant="p6">
                No data
              </Typo>
            )}
          </div>

          {hasGameData && pieChartData && barChartData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative aspect-square w-full max-w-[240px] mx-auto">
                <Pie data={pieChartData} options={pieOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Typo as="span" className="text-sm" color="grey" fontVariant="p5">
                    Participants
                  </Typo>
                  <Typo as="span" className="text-xl font-semibold text-white" fontVariant="h4">
                    {totalParticipants.toLocaleString()}
                  </Typo>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                {gameParticipationData.map((entry, index) => {
                  const percent = Math.round((entry.value / (totalParticipants || 1)) * 100)
                  return (
                    <div key={index} className="mb-2 last:mb-0">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span
                            className="w-2.5 h-2.5 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <Typo as="span" className="text-zinc-200" fontVariant="p5">
                            {entry.name}
                          </Typo>
                        </div>
                        <Typo as="span" color="grey" fontVariant="p6">
                          {percent}%
                        </Typo>
                      </div>
                      <div className="mt-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg text-zinc-500 text-sm">
              Not enough data yet
            </div>
          )}

          {/* No fake data for success/retention charts. Show message instead. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="bg-zinc-800/60 ring-1 ring-white/10 p-4 rounded-lg text-center relative h-36 flex items-center justify-center">
              <Typo as="span" className="text-zinc-400 text-base" fontVariant="p5">
                Not enough data yet
              </Typo>
            </div>
            <div className="bg-zinc-800/60 ring-1 ring-white/10 p-4 rounded-lg text-center relative h-36 flex items-center justify-center">
              <Typo as="span" className="text-zinc-400 text-base" fontVariant="p5">
                Not enough data yet
              </Typo>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10 ring-1 ring-white/10 rounded-xl p-4 md:p-6 shadow-lg flex flex-col justify-between">
          <div>
            <Typo as="h2" className="text-2xl font-bold text-white mb-1" fontVariant="h2">
              Rewards Overview
            </Typo>
            <Typo as="p" className="text-sm text-zinc-300" color="grey" fontVariant="p5">
              Total prize value awarded
            </Typo>
          </div>
          <div className="flex gap-3 mt-6">
            <div className="bg-indigo-600/30 ring-1 ring-indigo-400/30 p-4 rounded-lg text-center flex-1">
              <Typo as="p" className="text-sm text-white/90 font-medium" fontVariant="p5">
                Cash Prizes
              </Typo>
              <Typo as="p" className="text-xl font-bold text-white mt-1" fontVariant="h4">
                {totalPrizeMoney && totalPrizeMoney !== '0'
                  ? `${totalPrizeMoney} Dinar`
                  : 'Not enough data yet'}
              </Typo>
            </div>
            <div className="bg-rose-600/30 ring-1 ring-rose-400/30 p-4 rounded-lg text-center flex-1">
              <Typo as="p" className="text-sm text-white/90 font-medium" fontVariant="p5">
                Rewards
              </Typo>
              <Typo as="p" className="text-xl font-bold text-white mt-1" fontVariant="h4">
                Not enough data yet
              </Typo>
            </div>
          </div>
          <Typo as="p" className="text-[11px] mt-3" color="grey" fontVariant="p6">
            Updated monthly
          </Typo>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-zinc-900/60 ring-1 ring-white/10 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <Typo as="h3" className="text-md font-semibold" fontVariant="p2b">
              Tournament Growth
            </Typo>
            {!hasGrowthData && (
              <Typo as="span" className="text-xs" color="grey" fontVariant="p6">
                No data
              </Typo>
            )}
          </div>
          {hasGrowthData && lineChartData ? (
            <div className="h-56">
              <Line data={lineChartData} options={growthOptions} />
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg text-zinc-500 text-sm">
              Not enough data yet
            </div>
          )}
        </div>
        <div className="bg-zinc-900/60 ring-1 ring-white/10 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <Typo as="h3" className="text-md font-semibold" fontVariant="p2b">
              Game Participants
            </Typo>
            {!hasGameData && (
              <Typo as="span" className="text-xs" color="grey" fontVariant="p6">
                No data
              </Typo>
            )}
          </div>
          {hasGameData && barChartData ? (
            <div className="h-56">
              <Bar data={barChartData} options={barOptions} />
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg text-zinc-500 text-sm">
              Not enough data yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OverviewStats
