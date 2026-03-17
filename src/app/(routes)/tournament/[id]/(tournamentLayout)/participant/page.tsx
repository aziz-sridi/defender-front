import { getTournamentById } from '@/services/tournamentService'
import { Tournament } from '@/types/tournamentType'
import NotFound from '@/app/not-found'
import TournamentParticipant from '@/components/tournament/TournamentParticipant'

const TournamentParticipantSection = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const tournament: Tournament = await getTournamentById(id)
  if (!tournament) {
    return NotFound()
  }
  return <TournamentParticipant tournament={tournament} />
}

export default TournamentParticipantSection
