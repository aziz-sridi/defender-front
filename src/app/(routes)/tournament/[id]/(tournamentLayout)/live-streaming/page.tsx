import { getTournamentById } from '@/services/tournamentService'
import { Tournament } from '@/types/tournamentType'
import NotFound from '@/app/not-found'
import TournamentLiveStreaming from '@/components/tournament/TournamantLivestream'

const TournamentLiveStreamingSection = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const tournament: Tournament = await getTournamentById(id)
  if (!tournament) {
    return NotFound()
  }
  return <TournamentLiveStreaming tournament={tournament} />
}

export default TournamentLiveStreamingSection
