// components/layout/TournamentLayout.tsx
import TournamentHeader from '@/components/tournament/TournamentHeader'
import { NavigationBar } from '@/components/ui/NavigationBar'
import TournamentOverview from '@/components/tournament/TournamentOverview'
import { Tournament } from '@/types/tournamentType'
import TournamentRules from '@/components/tournament/TournamentRules'
import TournamentPrizes from '@/components/tournament/TournamentPrizes'
import TournamentParticipant from '@/components/tournament/TournamentParticipant'
import TournamentLiveStreaming from '@/components/tournament/TournamantLivestream'
import TournamentBracket from '@/components/tournament/TournamentBracket'
import TournamentMatches from '@/components/tournament/TournamentMatches'

interface TournamentLayoutProps {
  tournament: Tournament
  activeTab: string
}

const TournamentLayout = ({ tournament, activeTab }: TournamentLayoutProps) => {
  // Determine if tournament is active (cannot newly join) if it started OR brackets exist OR it is closed
  const hasTournamentStarted = new Date(tournament.startDate) <= new Date() || !!tournament.started
  const hasBracketsGenerated = Boolean(
    tournament.bracket ||
      tournament.looserBracket ||
      (tournament.swissBrackets && tournament.swissBrackets.length > 0),
  )
  const isTournamentActive = tournament.isClosed || hasTournamentStarted || hasBracketsGenerated

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rules', label: 'Rules' },
    { id: 'prizes', label: 'Prizes' },
    { id: 'participant', label: 'Participant' },
    { id: 'brackets', label: 'Brackets', disabled: !isTournamentActive },
    { id: 'matches', label: 'Matches', disabled: !isTournamentActive },
    { id: 'live-streaming', label: 'Live Streaming' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <TournamentOverview tournament={tournament} />
      case 'rules':
        return <TournamentRules tournament={tournament} />
      case 'prizes':
        return <TournamentPrizes tournament={tournament} />
      case 'participant':
        return <TournamentParticipant tournament={tournament} />
      case 'brackets':
        return <TournamentBracket tournament={tournament} />
      case 'matches':
        return <TournamentMatches tournament={tournament} />

      case 'live-streaming':
        return <TournamentLiveStreaming tournament={tournament} />

      default:
        return <TournamentOverview tournament={tournament} />
    }
  }

  return (
    <div className="w-full">
      <TournamentHeader tournament={tournament} />
      <NavigationBar activeId={activeTab} items={tabs} />
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  )
}

export default TournamentLayout
