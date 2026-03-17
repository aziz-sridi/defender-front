export const getTierColor = (tier: string) => {
  switch (tier) {
    case 'bronze':
      return 'from-orange-500 to-amber-600'
    case 'silver':
      return 'from-gray-400 to-gray-600'
    case 'gold':
      return 'from-yellow-400 to-yellow-600'
    case 'legendary':
      return 'from-purple-500 to-pink-500'
    case 'elite':
      return 'from-green-500 to-emerald-500'
    default:
      return 'from-gray-400 to-gray-600'
  }
}
export const getTierBorderColor = (tier: string) => {
  switch (tier) {
    case 'bronze':
      return 'border-amber-500'
    case 'silver':
      return 'border-gray-500'
    case 'gold':
      return 'border-yellow-500'
    case 'legendary':
      return 'border-purple-500'
    case 'elite':
      return 'border-green-500'
    default:
      return 'border-gray-500'
  }
}

export const getBadgeIcon = (type: string) => {
  switch (type) {
    case 'bronze':
      return (
        <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-800" />
        </div>
      )
    case 'silver':
      return (
        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-500" />
        </div>
      )
    case 'gold':
      return (
        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-600" />
        </div>
      )
    case 'trophy':
      return (
        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
          <span className="w-6 h-6 flex items-center justify-center text-xl">🏆</span>
        </div>
      )
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gray-400 border border-gray-500" />
        </div>
      )
  }
}
