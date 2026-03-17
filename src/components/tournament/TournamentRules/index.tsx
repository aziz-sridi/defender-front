import { Tournament } from '@/types/tournamentType'

const TournamentRules = ({ tournament }: { tournament: Tournament }) => {
  return (
    <div className="px-6 py-4">
      <div className="bg-gray-80 padding-container py-10 overflow-y-auto defendrScroll h-[60vh] mb-10 rounded">
        {tournament.rules ? (
          <div
            className="prose prose-invert max-w-none text-white"
            dangerouslySetInnerHTML={{ __html: tournament.rules }}
          />
        ) : (
          <p className="text-gray-500 italic">
            No rules have been provided for this tournament{' '}
            <span className="animate-pulse">...</span>{' '}
          </p>
        )}
      </div>
    </div>
  )
}
export default TournamentRules
