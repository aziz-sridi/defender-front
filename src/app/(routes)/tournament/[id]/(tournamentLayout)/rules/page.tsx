import { getTournamentById } from '@/services/tournamentService'
import { Tournament } from '@/types/tournamentType'
import TournamentRules from '@/components/tournament/TournamentRules'
import NotFound from '@/app/not-found'

const TournamentRulesSection = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const tournament: Tournament = await getTournamentById(id)
  if (!tournament) {
    return NotFound()
  }
  return <TournamentRules tournament={tournament} />
}

export default TournamentRulesSection
