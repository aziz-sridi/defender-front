interface TeamStatistics {
  overallWinRate: number
  totalMatches: number
  totalWins: number
  totalLosses: number
  tournamentsEntered: number
  tournamentsWon: number
  top3Finishes: number
  championships: number
  totalPrizeMoney: number
  currentStreak: number
  streakType: 'wins' | 'losses'
  averageMatchDuration: number
  bestWinStreak: number
  monthlyStats: {
    month: string
    matches: number
    wins: number
    winRate: number
  }[]
}

interface StatisticsTabProps {
  teamId: string
}

const StatisticsTab: React.FC<StatisticsTabProps> = ({ teamId }) => {
  const statistics: TeamStatistics = {
    overallWinRate: 68.4,
    totalMatches: 120,
    totalWins: 82,
    totalLosses: 38,
    tournamentsEntered: 15,
    tournamentsWon: 4,
    top3Finishes: 9,
    championships: 2,
    totalPrizeMoney: 12500,
    currentStreak: 5,
    streakType: 'wins',
    averageMatchDuration: 32,
    bestWinStreak: 9,
    monthlyStats: [
      { month: 'Jan 2025', matches: 10, wins: 7, winRate: 70 },
      { month: 'Feb 2025', matches: 12, wins: 8, winRate: 66.7 },
      { month: 'Mar 2025', matches: 9, wins: 6, winRate: 66.7 },
      { month: 'Apr 2025', matches: 11, wins: 8, winRate: 72.7 },
      { month: 'May 2025', matches: 8, wins: 5, winRate: 62.5 },
      { month: 'Jun 2025', matches: 13, wins: 9, winRate: 69.2 },
    ],
  }
  return (
    <div className="mt-6 animate-pulse blur-sm">
      <div className="bg-[#212529] p-6 rounded-[19px] text-white">
        <div className="mb-6">
          <h2 className="text-xl font-poppins">Overall performance</h2>
          <p className="text-gray-400 text-sm font-poppins">
            Team statistics across all competitions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#343a40] border border-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#d62755] mb-2 font-poppins">
              {statistics.overallWinRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300 font-poppins">Win Rate</div>
            <div className="text-xs text-gray-500 mt-1 font-poppins">Last 30 days</div>
          </div>

          <div className="bg-[#343a40] border border-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#d62755] mb-2 font-poppins">
              {statistics.tournamentsWon}
            </div>
            <div className="text-sm text-gray-300 font-poppins">Tournaments Won</div>
            <div className="text-xs text-gray-500 mt-1 font-poppins">All time</div>
          </div>

          <div className="bg-[#343a40] border border-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#d62755] mb-2 font-poppins">
              ${statistics.totalPrizeMoney.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300 font-poppins">Prize Money</div>
            <div className="text-xs text-gray-500 mt-1 font-poppins">Total earned</div>
          </div>

          <div className="bg-[#343a40] border border-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#d62755] mb-2 font-poppins">
              {statistics.currentStreak}
            </div>
            <div className="text-sm text-gray-300 font-poppins">Current Streak</div>
            <div className="text-xs text-gray-500 mt-1 font-poppins">
              {statistics.streakType === 'wins' ? 'Wins' : 'Losses'} in a row
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#343a40] border border-white rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 font-poppins">Match Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Matches Played</span>
                <span className="text-white font-poppins">{statistics.totalMatches}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Matches Won</span>
                <span className="text-white font-poppins">{statistics.totalWins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Matches Lost</span>
                <span className="text-white font-poppins">{statistics.totalLosses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Best Win Streak</span>
                <span className="text-white font-poppins">{statistics.bestWinStreak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Avg Match Duration</span>
                <span className="text-white font-poppins">
                  {statistics.averageMatchDuration} min
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#343a40] border border-white rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 font-poppins">Tournament Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Tournaments Entered</span>
                <span className="text-white font-poppins">{statistics.tournamentsEntered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Top 3 Finishes</span>
                <span className="text-white font-poppins">{statistics.top3Finishes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Championships</span>
                <span className="text-white font-poppins">{statistics.championships}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Tournament Win Rate</span>
                <span className="text-white font-poppins">
                  {((statistics.tournamentsWon / statistics.tournamentsEntered) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-poppins">Top 3 Rate</span>
                <span className="text-white font-poppins">
                  {((statistics.top3Finishes / statistics.tournamentsEntered) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#343a40] border border-white rounded-lg p-4">
          <h4 className="text-white font-medium mb-4 font-poppins">Monthly Performance</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2 font-poppins text-gray-300">Month</th>
                  <th className="text-center py-2 font-poppins text-gray-300">Matches</th>
                  <th className="text-center py-2 font-poppins text-gray-300">Wins</th>
                  <th className="text-center py-2 font-poppins text-gray-300">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {statistics.monthlyStats.map((monthStat, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-2 font-poppins text-white">{monthStat.month}</td>
                    <td className="text-center py-2 font-poppins text-white">
                      {monthStat.matches}
                    </td>
                    <td className="text-center py-2 font-poppins text-white">{monthStat.wins}</td>
                    <td className="text-center py-2 font-poppins text-white">
                      {monthStat.winRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsTab
