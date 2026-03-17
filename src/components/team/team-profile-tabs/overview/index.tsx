'use client'

import { useState, useEffect } from 'react'
import { BookText, Calendar, Users } from 'lucide-react'

import Button from '@/components/ui/Button'
import Avatar from '@/components/team/helpers/avatar'
import Typo from '@/components/ui/Typo'
import { TournamentImageGradients } from '@/lib/constants'

interface OverviewTabProps {
  teamId: string
  team: any
  teamDescription: string
  onViewAllMembers: () => void
  onViewAllTournaments: () => void
  onAddMember?: () => void
  isUserTeam?: boolean
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  teamId,
  team,
  teamDescription,
  onViewAllMembers,
  onViewAllTournaments,
  onAddMember,
  isUserTeam = false,
}) => {
  console.log('team from overview tab', team)
  const [teamData, setTeamData] = useState<any>(team)
  const [recentMembers, setRecentMembers] = useState<any>([])
  const [teamOwner, setTeamOwner] = useState<any>([])
  const [recentTournaments, setRecentTournaments] = useState<any>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTeamData(team)

    // Debug the data structure
    console.log('Full team object:', team)
    console.log('team.teamowner:', team.teamowner)
    console.log('team.teamroster:', team.teamroster)
    console.log('team.game:', team.game)

    if (Array.isArray(team.teamowner) && team.teamowner.length > 0) {
      console.log('First team owner:', team.teamowner[0])
      setTeamOwner(team.teamowner[0])
      setRecentMembers(team.teamroster || [])
    } else {
      console.log('No team owners found or teamowner is not an array')
      setRecentMembers(team.teamroster || [])
    }

    setRecentTournaments(team?.tournaments?.history || [])
    setLoading(false)
  }, [teamId])

  // Format creation date
  const formatCreationDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  // Get game name
  const getGameName = () => {
    if (team?.game?.name) {
      return team.game.name
    }
    if (typeof team?.game === 'string') {
      return 'Game ID: ' + team.game
    }
    return 'Unknown Game'
  }
  if (loading) {
    return (
      <div className="overview-tab space-y-8">
        <div className="bg-[#212529] p-5 rounded-[19px] w-full">
          <div className="text-center text-white font-poppins">Loading overview...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="overview-tab space-y-8">
      {/* About Section */}
      <div className="bg-[#212529] p-5 rounded-[19px] w-full">
        <Typo as="h3" className="text-white text-lg mb-1" fontFamily="poppins">
          About
        </Typo>
        <Typo as="p" className="text-[#8692aa] text-sm" fontFamily="poppins">
          {teamDescription}
        </Typo>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-[#212529] rounded-[19px] p-3 md:p-5 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-col gap-1">
              <Typo as="h3" className="text-white text-lg" fontFamily="poppins">
                Team members
              </Typo>
              <Typo as="p" className="text-[#8692aa] text-sm md:text-base" fontFamily="poppins">
                {recentMembers.length > 0
                  ? `Current roster of ${recentMembers.length}+ players`
                  : 'No members found'}
              </Typo>
            </div>
            <div className="flex gap-2">
              {isUserTeam && onAddMember && (
                <Button
                  className="font-poppins hidden w-auto sm:flex"
                  label="Add Member"
                  textClassName="text-sm"
                  variant="contained-red"
                  onClick={onAddMember}
                />
              )}
              {recentMembers.length > 2 && (
                <Button
                  className="font-poppins hidden w-auto sm:flex"
                  label="View All"
                  textClassName="text-sm"
                  variant="contained-red"
                  onClick={onViewAllMembers}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                imageUrl={teamOwner?.user?.profileImage || ''}
                name={teamOwner?.user?.nickname || 'Unknown'}
                size={64}
              />
              <div className="flex flex-col">
                <Typo as="p" className="text-white font-medium" fontFamily="poppins">
                  {teamOwner?.user?.nickname || 'Unknown'}
                </Typo>
                <Typo
                  as="p"
                  className="text-[#8692aa] text-sm mt-0.5 hidden sm:block"
                  fontFamily="poppins"
                >
                  {teamOwner?.user?.fullname || ''}
                </Typo>
              </div>
              <Typo
                className="border hidden sm:block  border-[#D62755] text-[#ffffff] text-xs px-3 py-0.5 rounded-full"
                fontFamily="poppins"
              >
                {teamOwner?.role || 'Member'}
              </Typo>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0 flex flex-col sm:gap-1">
              <Typo
                as="p"
                className="text-white text-sm md:text-base font-medium"
                fontFamily="poppins"
              >
                {teamOwner?.winRate ? teamOwner.winRate.toFixed(1) : 0} % Win Rate
              </Typo>
              <div className="w-full sm:hidden" />

              <Typo
                as="p"
                className="text-white text-sm md:text-base font-medium"
                fontFamily="poppins"
              >
                {teamOwner?.matches || 0} Matches
              </Typo>
            </div>
          </div>
          {recentMembers.length > 0 ? (
            <div className="space-y-6 md:space-y-8 mt-8">
              {recentMembers.slice(0, 2).map((member: any) => (
                <div
                  key={member._id}
                  className="flex sm:flex-row items-start mb-1 sm:items-center gap-4"
                >
                  <Avatar
                    imageUrl={member?.user?.profileImage || ''}
                    name={member?.user?.nickname || 'Unknown'}
                    size={64}
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <Typo
                        className="text-white text-sm hidden sm:block  min-w-[150px]"
                        fontFamily="poppins"
                      >
                        {member?.user?.nickname || 'Unknown'}
                      </Typo>
                      <Typo
                        className="border hidden sm:block  border-[#D62755] text-[#ffffff] text-xs px-3 py-0.5 rounded-full"
                        fontFamily="poppins"
                      >
                        {member?.role || 'Member'}
                      </Typo>
                    </div>
                    <Typo className="text-white text-base mt-1" fontFamily="poppins">
                      {member?.user?.fullname || ''}
                    </Typo>
                    <div className="w-full sm:hidden" />
                    <Typo
                      className=" sm:hidden  text-[#8692aa] text-xs py-0.5 rounded-full"
                      fontFamily="poppins"
                    >
                      {member.role}
                    </Typo>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0 flex flex-col gap-2">
                    <Typo
                      className="text-white text-sm md:text-base font-medium"
                      fontFamily="poppins"
                    >
                      {member?.winRate ? member.winRate.toFixed(1) : 0} % Win Rate
                    </Typo>
                    <div className="w-full sm:hidden" />

                    <Typo
                      className="text-white text-sm md:text-base font-medium"
                      fontFamily="poppins"
                    >
                      {member?.matches || 0} Matches
                    </Typo>
                  </div>
                </div>
              ))}
              {recentMembers.length > 2 && (
                <Button
                  className="font-poppins w-full sm:hidden"
                  label="View All"
                  size="s"
                  textClassName="text-sm"
                  variant="contained-red"
                  onClick={onViewAllMembers}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Typo as="p" className="text-[#8692aa]" fontFamily="poppins">
                No team members found
              </Typo>
            </div>
          )}
        </div>

        {/* Recent Tournaments Section */}
        <div className="bg-[#212529] rounded-[19px] p-6 md:p-5 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-col gap-1">
              <Typo as="h3" className="text-white text-lg" fontFamily="poppins">
                Recent Tournaments
              </Typo>
              <Typo as="p" className="text-[#8692aa] text-sm md:text-base" fontFamily="poppins">
                {recentTournaments.length > 0
                  ? 'Latest competitive performances'
                  : `No tournaments found`}
              </Typo>
            </div>
            {recentTournaments.length > 3 && (
              <Button
                className="font-poppins hidden w-auto sm:flex"
                label="View All"
                textClassName="text-sm"
                variant="contained-red"
                onClick={onViewAllTournaments}
              />
            )}
          </div>
          {recentTournaments.length > 0 ? (
            <div className="space-y-6">
              {recentTournaments.map((tournament: any, index: number) => {
                const gradients = TournamentImageGradients

                const gradient = gradients[index % gradients.length]

                return (
                  <div
                    key={tournament._id}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                  >
                    {/* Mobile Layout */}
                    <div className="flex flex-col gap-3 md:hidden">
                      <div className="flex flex-col items-center gap-3">
                        {/* Tournament Image - Mobile */}
                        <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                          <div
                            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative`}
                          >
                            <span className="text-white font-bold text-lg">
                              {tournament.name.charAt(0).toUpperCase()}
                            </span>
                            <div className="absolute inset-0 bg-black/10 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.1)_50%)]" />
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <Typo
                            className="text-white text-sm font-medium truncate"
                            fontFamily="poppins"
                          >
                            {tournament.name}
                          </Typo>
                          <Typo
                            className="text-[#8692aa] text-sm mt-2 text-center"
                            fontFamily="poppins"
                          >
                            {new Date(tournament.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })}
                          </Typo>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 items-center text-xs">
                        <Typo className="text-[#8692aa] text-sm" fontFamily="poppins">
                          {tournament.participants.length} Teams
                        </Typo>
                        <Typo className="text-[#f1f1f1] text-sm" fontFamily="poppins">
                          {tournament?.game?.name || tournament.tournamentType}
                        </Typo>
                      </div>
                      {tournament.description && (
                        <Typo
                          className="text-[#8692aa] text-sm text-center line-clamp-2"
                          fontFamily="poppins"
                        >
                          {tournament.description}
                        </Typo>
                      )}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid md:grid-cols-12 items-center gap-4">
                      <div className="col-span-2">
                        {/* Tournament Image - Desktop */}
                        <div className="w-20 h-16 lg:w-24 lg:h-20 rounded-lg overflow-hidden">
                          <div
                            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative`}
                          >
                            <span className="text-white font-bold text-xl lg:text-2xl">
                              {tournament.name.charAt(0).toUpperCase()}
                            </span>
                            <div className="absolute inset-0 bg-black/10 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.1)_50%)]" />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <Typo className="text-white text-base mb-2" fontFamily="poppins">
                          {tournament.name}
                        </Typo>
                        <div className="flex flex-col items-start gap-4 text-sm">
                          <Typo className="text-[#8692aa] mt-1 text-sm" fontFamily="poppins">
                            <Calendar className="w-5 h-5 inline me-2 text-gray-400" />
                            {new Date(tournament.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                            })}
                          </Typo>
                          <Typo className="text-[#8692aa] text-sm" fontFamily="poppins">
                            <Users className="w-5 h-5 inline me-2 text-gray-400" />
                            {tournament.participants.length} Teams
                          </Typo>
                        </div>
                        {tournament.description && (
                          <Typo
                            className="text-[#8692aa] text-sm mt-2 line-clamp-2"
                            fontFamily="poppins"
                          >
                            <BookText className="w-5 h-5 inline me-2 text-gray-400" />

                            {tournament?.description?.length > 200
                              ? `${tournament.description.slice(0, 200)}...`
                              : tournament.description}
                          </Typo>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {recentTournaments.length > 3 && (
                <Button
                  className="font-poppins sm:hidden w-full"
                  label="View All"
                  textClassName="text-sm"
                  variant="contained-red"
                  onClick={onViewAllTournaments}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Typo as="p" className="text-[#8692aa]" fontFamily="poppins">
                No tournaments found
              </Typo>
            </div>
          )}
        </div>

        {/* Team Achievements Section */}
        <div className="bg-[#212529] w-full p-5 rounded-[19px]">
          <div className="flex flex-col gap-1 mb-6">
            <Typo as="h3" className="text-white text-lg" fontFamily="poppins">
              Team Achievements
            </Typo>
            <Typo as="p" className="text-[#8692aa] text-sm md:text-base" fontFamily="poppins">
              Notable accomplishments and awards
            </Typo>
          </div>
          <div className="text-center py-8">
            <Typo as="p" className="text-[#8692aa]" fontFamily="poppins">
              No achievements found
            </Typo>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
