'use client'

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend as ChartLegend,
  Tooltip as ChartTooltip,
  LinearScale,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

import Loader from '@/app/loading'
import Typo from '@/components/ui/Typo'
import type { Organization } from '@/types/organizationType'

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, ChartLegend)

interface OverviewFollowersProps {
  organization: Organization
}

const OverviewFollowers = ({ organization }: OverviewFollowersProps) => {
  const [totalFollowers, setTotalFollowers] = useState(0)
  const [premiumMembers, setPremiumMembers] = useState(0)
  const [followerGrowth, setFollowerGrowth] = useState(0)
  const [premiumGrowth, setPremiumGrowth] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)
  const followerChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: '#d62755',
        borderRadius: 8,
        barPercentage: 0.9,
        categoryPercentage: 0.7,
        maxBarThickness: 32,
      },
    ],
  }

  const gridColor = '#2a2a2a'
  const tickColor = '#d4d4d8'

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (ctx: { parsed: { y: number } }) {
            const v = ctx.parsed.y
            return `${v}k`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: gridColor,
        },
        ticks: {
          color: tickColor,
        },
      },
      y: {
        grid: {
          display: false,
          color: gridColor,
        },
        ticks: {
          display: false,
          color: tickColor,
        },
      },
    },
  }

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!organization?._id) {
        return
      }
      setTotalFollowers(organization.nbFollowers || 0)
      // premiumMembers/followerGrowth/premiumGrowth aren't part of Organization type;
      // use available fields with safe defaults.
      setPremiumMembers(organization.memberCount || 0)
      setFollowerGrowth(0)
      setPremiumGrowth(0)
      setLoading(false)
    }
    fetchFollowers()
  }, [organization])

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M'
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const GrowthBadge = ({ value }: { value: number }) => {
    const positive = value >= 0
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
          positive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
        }`}
      >
        <span>{positive ? '▲' : '▼'}</span>
        <span>{Math.abs(value)}%</span>
      </span>
    )
  }

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
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-2 md:gap-4">
        <div>
          <Typo as="h2" className="md:text-2xl text-xl font-semibold" fontVariant="h2">
            Followers
          </Typo>
          <Typo as="p" className="mt-1 text-xs md:text-sm" color="grey" fontVariant="p5">
            Audience and membership insights
          </Typo>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-zinc-900/60 ring-1 ring-white/10 hover:ring-white/20 transition rounded-xl p-4 md:p-6 shadow-lg flex flex-col items-start">
          <div className="flex items-start justify-between w-full">
            <div>
              <Typo as="p" className="text-sm" color="grey" fontVariant="p5">
                Total Followers
              </Typo>
              <Typo
                as="span"
                className="mt-1 tracking-tight text-3xl md:text-4xl font-bold text-pink-400"
                fontVariant="h2"
              >
                {formatNumber(totalFollowers)}
              </Typo>
            </div>
            <GrowthBadge value={followerGrowth} />
          </div>
          <Typo as="p" className="mt-2 text-[11px]" color="grey" fontVariant="p6">
            Compared to last month
          </Typo>
        </div>

        <div className="bg-zinc-900/60 ring-1 ring-white/10 hover:ring-white/20 transition rounded-xl p-4 md:p-6 shadow-lg flex flex-col items-start">
          <div className="flex items-start justify-between w-full">
            <div>
              <Typo as="p" className="text-sm" color="grey" fontVariant="p5">
                Premium Members
              </Typo>
              <Typo
                as="span"
                className="mt-1 tracking-tight text-3xl md:text-4xl font-bold text-pink-400"
                fontVariant="h2"
              >
                {formatNumber(premiumMembers)}
              </Typo>
            </div>
            <GrowthBadge value={premiumGrowth} />
          </div>
          <Typo as="p" className="mt-2 text-[11px]" color="grey" fontVariant="p6">
            Compared to last month
          </Typo>
        </div>
      </div>
      <div className="bg-zinc-900/60 ring-1 ring-white/10 rounded-xl p-4 md:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <Typo as="h2" className="text-lg font-semibold" fontVariant="p2b">
            Follower Growth
          </Typo>
          <Typo as="span" className="text-xs" color="grey" fontVariant="p6">
            Monthly acquisition (k)
          </Typo>
        </div>
        <Typo as="p" className="mb-4 text-xs" color="grey" fontVariant="p6">
          Monthly follower acquisition across DEFENDR
        </Typo>
        {followerChartData &&
        followerChartData.datasets[0].data.some(v => typeof v === 'number' && v > 0) ? (
          <div style={{ height: '260px' }}>
            <Bar data={followerChartData} options={options} />
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-zinc-500 text-sm">
            Don't have enough data yet
          </div>
        )}
      </div>
    </div>
  )
}

export default OverviewFollowers
