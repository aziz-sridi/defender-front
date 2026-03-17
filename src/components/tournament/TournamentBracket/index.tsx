import { Tournament } from '@/types/tournamentType'
// import TournamentBracketsDemo, { TournamentBracketsDemoProps } from '../ui/TournamentBracketsDemo'
import TournamentBracket from '../../ui/TournamentBracket/TournamentBracket'

interface Props {
  tournament: Tournament
}

const TournamentBrackets: React.FC<Props> = ({ tournament }) => {
  console.log(tournament)
  return <TournamentBracket tournament={tournament} />
  // return <div className='h-screen'><TournamentBracketsDemo tournament={({tournament} as TournamentBracketsDemoProps).tournament} /></div>
}

export default TournamentBrackets
