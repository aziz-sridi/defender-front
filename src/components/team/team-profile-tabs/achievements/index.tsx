'use client'
import { useState, useEffect } from 'react'

import { getTierBorderColor, getTierColor } from '@/lib/helper'
import Typo from '@/components/ui/Typo'
import { getPrizeByTeamId } from '@/services/prizeService'

interface Achievement {
  id: string
  title: string
  description: string
  type: 'tournament' | 'milestone' | 'special'
  tier: 'bronze' | 'silver' | 'gold' | 'legendary' | 'elite'
  achievedDate: Date
  icon: string
}

interface AchievementsTabProps {
  team: any
  teamId: string
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ team, teamId }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [teamAchievements, setTeamAchievements] = useState<any[]>([])
  const mockAchievements: Achievement[] = [
    {
      id: 'a1',
      title: 'MVP Award',
      description: 'Awarded for outstanding performance in the finals.',
      type: 'special',
      tier: 'gold',
      achievedDate: new Date('2024-05-10'),
      icon: '🏅',
    },
    {
      id: 'a2',
      title: 'First Blood',
      description: 'First team to score in the tournament.',
      type: 'milestone',
      tier: 'silver',
      achievedDate: new Date('2024-04-20'),
      icon: '🥈',
    },
  ]

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        console.log('Fetching achievements for team:', team._id)
        const response = await getPrizeByTeamId(team._id)
        console.log('Response from getPrizeByTeamId:', response)
        setAchievements(response) // or whatever you want to set here
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  /* useEffect(() => {
    const fetchAchievements = async () => {
      try {
        // This would be replaced with actual API call
        // const apiAchievements = await achievementsApi.getTeamAchievements(teamId)
        const apiAchievements: any = [] // Replace with actual API call
        const transformAchievement = (achievement: any) => {
          return {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            type: achievement.type,
            tier: achievement.tier,
            achievedDate: new Date(achievement.achievedDate),
            icon: achievement.icon,
          }
        }
        const transformedAchievements = apiAchievements.map(transformAchievement)
        setAchievements(transformedAchievements)
      } catch (error) {
        console.error('Failed to fetch achievements:', error)
        // Leave achievements empty instead of setting mock data
        setAchievements([])
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [teamId]) */

  if (loading) {
    return (
      <div className="mt-6">
        <div className="bg-[#212529] p-6 rounded-[19px] text-white">
          <div className="text-center font-poppins">Loading achievements...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-0 sm:mt-6">
      <div className="bg-[#212529] p-6 rounded-[19px] text-white">
        <div className="mb-6">
          <Typo className="md:text-lg text-sm " fontFamily="poppins">
            Team Achievements
          </Typo>
          <Typo className="text-gray-400 text-sm ps-3" fontFamily="poppins">
            Trophies, medals, and recognition
          </Typo>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockAchievements.map(achievement => (
            <div
              key={achievement.id}
              className="flex sm:flex-col lg:flex-row items-center gap-6 bg-[#212529] border border-white rounded-xl p-3"
            >
              <div className="relative">
                <div
                  className={`rounded-full p-1 bg-gradient-to-r ${getTierColor(achievement.tier)}`}
                >
                  <div className="md:w-14 md:h-14 h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center">
                    <Typo className="text-2xl">{achievement.icon}</Typo>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <Typo className="text-white font-medium sm:text-md text-sm" fontFamily="poppins">
                    {achievement.title}
                  </Typo>
                  <Typo
                    className={`bg-transparent border ${getTierBorderColor(
                      achievement.tier,
                    )} text-xs text-gray-300 px-3 py-1 rounded-full font-poppins capitalize`}
                  >
                    {achievement.tier}
                  </Typo>
                </div>
                <Typo className="text-gray-400 text-sm" fontFamily="poppins">
                  {achievement.description}
                </Typo>
                <Typo className="text-gray-400 text-sm mt-1" fontFamily="poppins">
                  Achieved on{' '}
                  {achievement.achievedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typo>
              </div>
            </div>
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="text-center text-gray-400 py-12 font-poppins">
            <div className="text-4xl mb-4">🏆</div>
            <Typo as="h3" className="text-lg mb-2" fontFamily="poppins" fontVariant="h3">
              No achievements yet
            </Typo>
            <Typo as="p" fontFamily="poppins" fontVariant="p3">
              Start competing in tournaments to earn your first achievement!
            </Typo>
          </div>
        )}
      </div>
    </div>
  )
}

export default AchievementsTab
