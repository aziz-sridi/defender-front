'use client'
import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import Typo from '@/components/ui/Typo'
import NoTeamsFound from '@/components/user/userProfileTabs/NoTeamsFound'
import Invitations from '@/components/user/userProfileTabs/helpers/teamInvitation'
import GameSelector from '@/components/user/userProfileTabs/helpers/GameSelector'

interface Team {
  id: string
  name: string
  profileImage: string
  game: string
}

export default function TeamsTab({
  participatedTeams = [],
  ownedTeams = [],
  user = { _id: '', teamInvitations: [] },
}: {
  participatedTeams?: Team[]
  ownedTeams?: Team[]
  user?: any
}) {
  const [selected, setSelected] = useState<'owned' | 'joined'>('owned')
  const [selectedGame, setSelectedGame] = useState<string>('All Games')
  const router = useRouter()

  const safeOwnedTeams = ownedTeams || []
  const safeParticipatedTeams = participatedTeams || []
  const hasNoTeams = safeOwnedTeams.length === 0 && safeParticipatedTeams.length === 0

  const teamsToShow = selected === 'owned' ? safeOwnedTeams : safeParticipatedTeams

  // Filter teams by selected game
  const filteredTeams = useMemo(() => {
    if (!selectedGame || selectedGame === 'All Games') {
      return teamsToShow
    }
    return teamsToShow.filter(team => team.game === selectedGame)
  }, [teamsToShow, selectedGame])

  return (
    <div className="md:mx-40 flex flex-col gap-7 p-2 md:p-10 bg-[#161616]">
      {user ? (
        <Invitations teamInvitations={user.teamInvitations || []} userId={user._id || ''} />
      ) : null}

      {hasNoTeams ? (
        <NoTeamsFound />
      ) : (
        <div className="flex flex-col items-start">
          <Typo as="p" className="md:text-3xl text-xl font-bold">
            Your Teams ({safeOwnedTeams.length + safeParticipatedTeams.length})
          </Typo>

          {/* Game Selector */}
          <GameSelector selectedGame={selectedGame} onGameChange={setSelectedGame} />

          <div className="flex gap-5 mt-4">
            <button
              className={
                selected === 'owned'
                  ? 'bg-[#D627554D] p-3 rounded-3xl text-[#D62555]'
                  : 'rounded-lg text-gray-500'
              }
              onClick={() => setSelected('owned')}
            >
              <Typo as="p" fontFamily="poppins" fontVariant="p4">
                Owned
              </Typo>
            </button>
            <button
              className={
                selected === 'joined'
                  ? 'bg-[#D627554D] p-3 rounded-3xl text-[#D62555]'
                  : 'rounded-lg text-gray-500'
              }
              onClick={() => setSelected('joined')}
            >
              <Typo as="p" fontFamily="poppins" fontVariant="p4">
                Joined In
              </Typo>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 flex-wrap">
            <div className="flex flex-row gap-6 flex-wrap mt-5">
              {filteredTeams.length > 0 ? (
                <>
                  {filteredTeams.map(team => (
                    <div
                      key={team.id}
                      className="flex flex-col items-center cursor-pointer w-20"
                      onClick={() => router.push(`/team/${team.id}/profile`)}
                    >
                      <div className="rounded-full overflow-hidden w-20 h-20 border-2 border-red-700">
                        <Image
                          alt={team.name}
                          className="w-full h-full object-cover"
                          height={80}
                          src={
                            team.profileImage === ''
                              ? 'https://defendr.gg/assets/images/default-team-icon.jpg'
                              : team.profileImage
                          }
                          width={80}
                        />
                      </div>
                      <Typo
                        className="mt-2 text-center truncate w-full"
                        fontFamily="poppins"
                        fontVariant="p4"
                        title={team.name}
                      >
                        {team.name}
                      </Typo>
                    </div>
                  ))}

                  {/* Always show "Create Team" in Owned section */}
                  {selected === 'owned' && (
                    <div className="flex flex-col gap-1 mt-1">
                      <div
                        className="cursor-pointer rounded-full border border-red-700 w-20 h-20 flex justify-center items-center"
                        title="Create a Team"
                        onClick={() => router.push('/team/create')}
                      >
                        <Plus className="w-6 h-6 text-red-700" />
                      </div>
                      <Typo className="text-left" fontFamily="poppins" fontVariant="p4">
                        Create A Team
                      </Typo>
                    </div>
                  )}
                </>
              ) : (
                // When no teams for the selected game
                <div className="flex flex-col items-start gap-3 mt-4">
                  <Typo className="text-gray-400" fontFamily="poppins" fontVariant="p4">
                    No teams found for this game
                  </Typo>

                  {selected === 'owned' && (
                    <div className="flex flex-col gap-1">
                      <div
                        className="cursor-pointer rounded-full border border-red-700 w-20 h-20 flex justify-center items-center"
                        title="Create a Team"
                        onClick={() => router.push('/team/create')}
                      >
                        <Plus className="w-6 h-6 text-red-700" />
                      </div>
                      <Typo className="text-left" fontFamily="poppins" fontVariant="p4">
                        Create A Team
                      </Typo>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
