import { getTournamentById } from '@/services/tournamentService'
import { Tournament } from '@/types/tournamentType'
import NotFound from '@/app/not-found'
import TournamentBracket from '@/components/ui/TournamentBracket/TournamentBracket'

const TournamentBracketSection = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const tournament: Tournament = await getTournamentById(id)
  if (!tournament) {
    return NotFound()
  }
  return <TournamentBracket tournament={tournament} />
}

export default TournamentBracketSection
