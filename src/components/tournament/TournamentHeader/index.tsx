import Image from 'next/image'
import { getServerSession } from 'next-auth'

import { Tournament } from '@/types/tournamentType'
import JoinTournament from '@/components/tournament/JoinTournament'
import CountdownTimer from '@/components/tournament/CountdownTimer'
import { checkIfUserInTournament, getActualUserParticipantId } from '@/services/tournamentService'
import { authOptions } from '@/lib/api/auth'
import { tournamentImageSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'

interface TournamentHeaderProps {
  tournament: Tournament
}

const TournamentHeader = async ({ tournament }: TournamentHeaderProps) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user?._id
  const isInTournament = await checkIfUserInTournament(tournament._id, userId || '')
  const participantId =
    isInTournament && userId ? await getActualUserParticipantId(tournament._id, userId) : null

  const totalPrizes = tournament.prizes?.reduce((acc, prize) => acc + prize.value, 0) || 0
  const defaultImage = DEFAULT_IMAGES.TOURNAMENT
  const hasTournamentStarted = new Date(tournament.startDate) < new Date()
  const hasBracketsGenerated = !!(
    tournament.bracket ||
    tournament.looserBracket ||
    (tournament.swissBrackets && tournament.swissBrackets.length > 0)
  )
  const isTournamentActive = tournament.started || hasTournamentStarted || hasBracketsGenerated

  // Debug tournament cover image
  // (Removed debug log for cover image)

  // Determine tournament status
  const getTournamentStatus = () => {
    // Unpublished tournaments are drafts
    if (!tournament.publishing) {
      return { text: 'Drafted Tournament', color: 'bg-gray-600' }
    }
    if (tournament.isClosed) {
      return { text: 'Tournament Finished', color: 'bg-gray-600' }
    }
    if (isTournamentActive) {
      return { text: 'Tournament Started', color: 'bg-red-600' }
    }
    return { text: 'Starting Soon', color: 'bg-blue-600' }
  }

  const status = getTournamentStatus()
  const entryType = tournament.joinProcess?.entryFee > 0 ? 'Paid Entry' : 'Free Entry'

  return (
    <div className="w-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white overflow-hidden">
      {/* Hero Banner Section */}
      <div className="relative h-80 md:h-96 lg:h-[500px] w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            fill
            priority
            alt="Tournament Banner"
            className="object-cover object-center"
            src={tournamentImageSanitizer(tournament.coverImage, defaultImage)}
            sizes="(min-width: 1024px) 100vw, 100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-end">
          {/* Action Panel Banner */}
          <div className="w-full">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-t-2xl p-4 md:p-6 border-t border-gray-700/20">
              {/* Desktop Layout */}
              <div className="hidden md:flex h-32">
                {/* Left Section: Tournament Name & Tags */}
                <div className="flex-1 flex flex-col justify-center pr-6 border-r border-gray-700/20">
                  <h1 className="text-2xl font-bold text-white leading-tight mb-3">
                    {tournament.name}
                  </h1>
                  <div className="flex gap-3">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${status.color} text-white`}
                    >
                      {status.text}
                    </span>
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        tournament.joinProcess?.entryFee > 0 ? 'bg-pink-600' : 'bg-green-600'
                      } text-white`}
                    >
                      {entryType}
                    </span>
                  </div>
                </div>

                {/* Center Section: Prize Pool & Entry Fee */}
                <div className="flex-1 flex justify-center items-center gap-12 px-6 border-r border-gray-700/20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white mb-2">Tournament prize pool</div>
                    <div className="text-xl text-white">
                      <span>{totalPrizes}</span> TND
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white mb-2">Entry Fee</div>
                    <div className="text-xl text-white">
                      {(tournament.joinProcess?.entryFee || 0) === 0 ? (
                        <span className="text-green-400 font-bold">FREE</span>
                      ) : (
                        <span className="line-through decoration-white/50">
                          {tournament.joinProcess?.entryFee || 0}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section: Join Button & Timer */}
                <div className="flex-1 flex flex-col justify-center items-center pl-6">
                  <div className="text-center space-y-4">
                    {/* Join Button - Only show if tournament is published */}
                    {tournament.publishing && (
                      <div>
                        <JoinTournament
                          isInTournament={isInTournament}
                          participantId={participantId}
                          tournament={tournament}
                        />
                      </div>
                    )}

                    {/* Countdown Timer - Only show if tournament is published */}
                    {tournament.publishing && (
                      <CountdownTimer
                        isClosed={tournament.isClosed}
                        startDate={
                          (tournament as any).registrationEndDate ||
                          tournament.structureProcess?.registrationEndDate ||
                          tournament.startDate
                        }
                        registrationEndDate={
                          (tournament as any).registrationEndDate ||
                          tournament.structureProcess?.registrationEndDate ||
                          tournament.startDate
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden space-y-6 px-4">
                {/* Tournament Name & Tags */}
                <div className="text-center">
                  <h1 className="text-xl font-bold text-white leading-tight mb-4">
                    {tournament.name}
                  </h1>
                  <div className="flex justify-center gap-3">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${status.color} text-white`}
                    >
                      {status.text}
                    </span>
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        tournament.joinProcess?.entryFee > 0 ? 'bg-pink-600' : 'bg-green-600'
                      } text-white`}
                    >
                      {entryType}
                    </span>
                  </div>
                </div>

                {/* Prize Pool & Entry Fee */}
                <div className="flex justify-center items-center gap-8">
                  <div className="text-center">
                    <div className="text-base font-bold text-white mb-2">Prize Pool</div>
                    <div className="text-lg text-white">
                      <span>{totalPrizes}</span> TND
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-white mb-2">Entry Fee</div>
                    <div className="text-lg text-white">
                      {(tournament.joinProcess?.entryFee || 0) === 0 ? (
                        <span className="text-green-400 font-bold">FREE</span>
                      ) : (
                        <span className="line-through decoration-white/50">
                          {tournament.joinProcess?.entryFee || 0}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Join Button & Timer */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Join Button - Only show if tournament is published */}
                  {tournament.publishing && (
                    <div className="flex justify-center">
                      <JoinTournament
                        isInTournament={isInTournament}
                        participantId={participantId}
                        tournament={tournament}
                      />
                    </div>
                  )}
                  {/* Countdown Timer - Only show if tournament is published */}
                  {tournament.publishing && (
                    <div className="flex justify-center">
                      <CountdownTimer
                        isClosed={tournament.isClosed}
                        startDate={
                          (tournament as any).registrationEndDate ||
                          tournament.structureProcess?.registrationEndDate ||
                          tournament.startDate
                        }
                        registrationEndDate={
                          (tournament as any).registrationEndDate ||
                          tournament.structureProcess?.registrationEndDate ||
                          tournament.startDate
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentHeader
