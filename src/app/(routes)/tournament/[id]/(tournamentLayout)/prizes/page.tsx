import { getTournamentById } from '@/services/tournamentService'
import { Tournament } from '@/types/tournamentType'
import NotFound from '@/app/not-found'
import TournamentPrizes from '@/components/tournament/TournamentPrizes'

const TournamentPrizesSection = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const tournament: Tournament = await getTournamentById(id)
  if (!tournament) {
    return NotFound()
  }
  return <TournamentPrizes tournament={tournament} />
}

export default TournamentPrizesSection
