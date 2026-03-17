'use client'
import { BarChart3, Zap } from 'lucide-react'

export default function StatsTab({ stats }: { stats: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="bg-[#212529] rounded-2xl p-10 max-w-lg w-full flex flex-col items-center gap-6 border border-white/5">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#D62555]/10 flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-[#D62555]" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-500/15 flex items-center justify-center animate-pulse">
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h3 className="text-white text-xl font-bold font-poppins">Stats Coming Soon</h3>
          <p className="text-gray-400 text-sm font-poppins leading-relaxed max-w-sm">
            We&apos;re working on bringing you detailed player statistics — tournament wins, match
            history, rankings and more.
          </p>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 bg-[#D62555]/10 border border-[#D62555]/20 rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-[#D62555] animate-pulse" />
          <span className="text-[#D62555] text-xs font-semibold font-poppins">In Development</span>
        </div>
      </div>
    </div>
  )
}
