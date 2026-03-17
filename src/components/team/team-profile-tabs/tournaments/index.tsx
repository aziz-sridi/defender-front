import { Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

interface TournamentsTabProps {
  teamId: string
  team: any
}

const TournamentsTab: React.FC<TournamentsTabProps> = ({ teamId, team }) => {
  const router = useRouter()
  return (
    <div className="mt-0 sm:mt-6">
      <div className="flex flex-col gap-6 bg-[#212529] text-white p-4 rounded-[19px]">
        {/* Upcoming Tournaments Section */}
        <div>
          <div className="p-3 flex flex-col items-start">
            <Typo className="md:text-lg text-sm mb-1" fontFamily="poppins">
              Upcoming Tournaments
            </Typo>
            <Typo className="text-gray-400 text-sm mb-4 mt-2 sm:mt-0" fontFamily="poppins">
              Tournaments the team is registered for
            </Typo>
          </div>

          <div className="flex flex-col gap-4">
            {team.tournaments.upcoming.map((tournament, index) => (
              <div
                key={tournament._id}
                className="flex flex-col lg:flex-row items-center justify-center md:items-start md:justify-between gap-4  bg-transparent border border-white p-4 rounded-lg"
              >
                <div className="flex gap-4">
                  <img
                    alt={tournament.name}
                    className="w-16 h-16 rounded-md "
                    src={'https://defendr.gg/assets/images/defualt-tournament-cover.jpg'}
                  />
                  <div className="flex space-y-3 flex-col justify-center items-start md:items-start">
                    <Typo className="text-xs md:text-sm font-medium leading-tight" fontVariant="p2">
                      {tournament.name}
                    </Typo>
                    <div className="flex space-y-3 flex-col md:items-start items-center text-white mt-1">
                      <div className="flex gap-2">
                        <Calendar className="mr-1 h-4 w-4" color="#d62755" fill="#d62755" />
                        <Typo className="text-sm" fontFamily="poppins">
                          {new Date(tournament.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })}
                        </Typo>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-auto min-w-0 btn-defendr-red mt-2 sm:mt-5 md:mt-0"
                  iconOrientation="left"
                  label="View Tournament"
                  size="xs"
                  textClassName="text-xs text-center "
                  variant="contained-red"
                  onClick={() => router.push(`/tournament/${tournament._id}`)}
                />
              </div>
            ))}

            {team.tournaments.upcoming.length === 0 && (
              <Typo className="text-center text-gray-400 text-sm sm:text-md  py-8 font-poppins">
                No upcoming tournaments
              </Typo>
            )}
          </div>
        </div>

        <div>
          <div className="p-3 flex flex-col items-start">
            <Typo className="md:text-lg text-sm mb-1" fontFamily="poppins">
              completed Tournaments
            </Typo>
            <Typo className="text-gray-400 text-sm mb-4 mt-2 sm:mt-0" fontFamily="poppins">
              Past tournament performances
            </Typo>
          </div>

          <div className="flex flex-col gap-4">
            {team.tournaments.history.map((tournament, index) => (
              <div
                key={tournament._id}
                className="flex flex-col lg:flex-row items-center justify-center md:items-start md:justify-between gap-4  bg-transparent border border-white p-4 rounded-lg"
              >
                <div className="flex gap-4">
                  <img
                    alt={tournament.name}
                    className="w-28 h-20 rounded-xl "
                    src={'https://defendr.gg/assets/images/defualt-tournament-cover.jpg'}
                  />

                  <div className="flex space-y-3 flex-col justify-center items-start md:items-start">
                    <Typo className="text-xs md:text-sm font-medium leading-tight" fontVariant="p2">
                      {tournament.name}
                    </Typo>
                    <div className="flex space-y-3 flex-col md:items-start items-center text-white mt-1">
                      <div className="flex gap-2">
                        <Calendar className="mr-1 h-4 w-4" color="#d62755" fill="#d62755" />
                        <Typo className="text-sm" fontFamily="poppins">
                          {new Date(tournament.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })}
                        </Typo>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex xl:ps-10 justify-between flex-col md:flex-row">
                  <Button
                    className="w-auto min-w-0 btn-defendr-red mt-2 md:mt-0"
                    iconOrientation="left"
                    label="View Tournament"
                    size="xs"
                    textClassName="text-xs text-center "
                    variant="contained-red"
                    onClick={() => router.push(`/tournament/${tournament._id}`)}
                  />
                </div>
              </div>
            ))}
            {team.tournaments.history.length > 3 && (
              <Button
                className="btn-defendr-red w-full sm:hidden"
                label="expand"
                size="s"
                textClassName="sm:text-lg text-sm"
                variant="contained-red"
              />
            )}

            {team.tournaments.history.length === 0 && (
              <Typo
                className="text-center text-gray-400 py-8 text-sm sm:text-md"
                fontFamily="poppins"
              >
                No tournament history
              </Typo>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentsTab
