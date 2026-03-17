import { Gift } from 'lucide-react'

export default function GiftSubscription() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#D62555] to-[#b81f47] rounded-2xl p-5 sm:p-6">
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white font-poppins">Gift a Subscription</p>
            <p className="text-xs text-white/60 font-poppins">
              Share premium benefits with a friend
            </p>
          </div>
        </div>
        <button className="w-full sm:w-auto px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-semibold rounded-xl transition-all font-poppins shrink-0">
          Send Gift
        </button>
      </div>
    </div>
  )
}
