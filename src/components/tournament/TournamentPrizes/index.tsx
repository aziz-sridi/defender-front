import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Tabulation'
import Typo from '@/components/ui/Typo'
import { Tournament } from '@/types/tournamentType'

const TournamentPrize = ({ tournament }: { tournament: Tournament }) => {
  const { prizes = [] } = tournament
  const totalPrizes = prizes.reduce((acc, prize) => acc + prize.value, 0)

  // Helper for placement suffix
  const getPlacement = (rank?: number) => {
    if (rank === 1) {
      return '1st'
    }
    if (rank === 2) {
      return '2nd'
    }
    if (rank === 3) {
      return '3rd'
    }
    return `${rank}th`
  }

  // Helper to format currency
  const formatCurrency = (value: number, currency: string = 'TND') => {
    return `${value} ${currency}`
  }

  // Helper to get prize display value based on type
  const getPrizeDisplayValue = (prize: any) => {
    switch (prize.type) {
      case 'CASH':
        return formatCurrency(prize.value, prize.currency || 'TND')
      case 'RED_POINTS':
        return `${prize.value} DF Points`
      case 'VOUCHER':
        return prize.name || 'Voucher'
      default:
        return prize.name || `${prize.value} Points`
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <Typo
            alignment="center"
            className="uppercase tracking-wider"
            color="white"
            fontFamily="poppins"
            fontVariant="h1"
          >
            TOURNAMENT PRIZES
          </Typo>
          <Typo
            alignment="center"
            className="uppercase tracking-wider mt-2"
            color="defendrRed"
            fontFamily="poppins"
            fontVariant="h1"
          >
            {totalPrizes} TND
          </Typo>
        </div>
        <Typo
          alignment="center"
          color="ghostGrey"
          fontFamily="poppins"
          fontVariant="p4"
          className="text-lg"
        >
          Total Prize Pool
        </Typo>
      </div>

      {/* Prize Cards */}
      {prizes.length > 0 ? (
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
            {prizes
              .sort((a, b) => (a.rank || 0) - (b.rank || 0))
              .map((prize, index) => {
                const getPlacementColor = (rank?: number) => {
                  if (rank === 1) return 'bg-yellow-500'
                  if (rank === 2) return 'bg-gray-400'
                  if (rank === 3) return 'bg-orange-500'
                  return 'bg-gray-600'
                }

                return (
                  <div
                    key={prize._id}
                    className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    {/* Placement Badge and Rank */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${getPlacementColor(prize.rank)} shadow-lg`}
                      >
                        <span className="text-white font-bold text-xl">
                          {prize.rank || index + 1}
                        </span>
                      </div>
                      <div>
                        <Typo
                          as="p"
                          color="white"
                          fontFamily="poppins"
                          fontVariant="h3"
                          className="font-bold"
                        >
                          {getPlacement(prize.rank)}
                        </Typo>
                      </div>
                    </div>

                    {/* Prize Details */}
                    <div className="space-y-4">
                      <div>
                        <Typo
                          as="p"
                          color="ghostGrey"
                          fontFamily="poppins"
                          fontVariant="p5"
                          className="uppercase text-xs tracking-wider font-medium"
                        >
                          PRIZE TYPE
                        </Typo>
                        <Typo
                          as="p"
                          color="white"
                          fontFamily="poppins"
                          fontVariant="p3"
                          className="font-semibold mt-1"
                        >
                          {prize.type === 'CASH'
                            ? 'Cash Prize'
                            : prize.type === 'RED_POINTS'
                              ? 'DF Points'
                              : prize.type === 'VOUCHER'
                                ? 'Voucher'
                                : 'Prize'}
                        </Typo>
                      </div>

                      <div>
                        <Typo
                          as="p"
                          color="ghostGrey"
                          fontFamily="poppins"
                          fontVariant="p5"
                          className="uppercase text-xs tracking-wider font-medium"
                        >
                          VALUE
                        </Typo>
                        <Typo
                          as="p"
                          color="white"
                          fontFamily="poppins"
                          fontVariant="h4"
                          className="font-bold mt-1"
                        >
                          {prize.type === 'CASH'
                            ? formatCurrency(prize.value, prize.currency || 'TND')
                            : prize.type === 'RED_POINTS'
                              ? `${prize.value} DF Points`
                              : prize.type === 'VOUCHER'
                                ? prize.name || 'Voucher'
                                : `${prize.value} Points`}
                        </Typo>
                      </div>

                      {prize.name && prize.type !== 'VOUCHER' && (
                        <div>
                          <Typo
                            as="p"
                            color="ghostGrey"
                            fontFamily="poppins"
                            fontVariant="p5"
                            className="uppercase text-xs tracking-wider font-medium"
                          >
                            DESCRIPTION
                          </Typo>
                          <Typo
                            as="p"
                            color="white"
                            fontFamily="poppins"
                            fontVariant="p5"
                            className="text-sm mt-1"
                          >
                            {prize.name}
                          </Typo>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-gray-400 text-4xl">🏆</span>
          </div>
          <Typo
            alignment="center"
            color="white"
            fontFamily="poppins"
            fontVariant="h4"
            className="mb-2"
          >
            No Prizes Available
          </Typo>
          <Typo alignment="center" color="ghostGrey" fontFamily="poppins" fontVariant="p4">
            Prizes will be announced soon
          </Typo>
        </div>
      )}

      {/* Footer Summary */}
      {prizes.length > 0 && (
        <div className="flex justify-center">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl px-12 py-6 border border-gray-700/30">
            <div className="flex items-center gap-16">
              <div className="text-center">
                <Typo
                  as="p"
                  color="white"
                  fontFamily="poppins"
                  fontVariant="p4"
                  className="uppercase tracking-wider font-medium mb-2"
                >
                  TOURNAMENT PRIZE POOL
                </Typo>
                <Typo
                  as="p"
                  color="white"
                  fontFamily="poppins"
                  fontVariant="h4"
                  className="font-bold"
                >
                  {formatCurrency(totalPrizes)}
                </Typo>
              </div>
              <div className="text-center">
                <Typo
                  as="p"
                  color="white"
                  fontFamily="poppins"
                  fontVariant="p4"
                  className="uppercase tracking-wider font-medium mb-2"
                >
                  TOTAL PRIZES
                </Typo>
                <Typo
                  as="p"
                  color="white"
                  fontFamily="poppins"
                  fontVariant="h4"
                  className="font-bold"
                >
                  {prizes.length}
                </Typo>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TournamentPrize
