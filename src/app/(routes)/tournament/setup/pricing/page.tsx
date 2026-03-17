'use client'

// Modal temporarily disabled; keeping imports commented for future re-enable
// import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import PricingTournament from '@/components/organizations/Tournament/PricingTournament'

// const CreateTournamentModel = dynamic(
//   () => import('@/components/organizations/CreateTournamentModel'),
//   { ssr: false },
// )

export default function TournamentPricingStep() {
  const router = useRouter()

  const handleContinue = (type: 'free' | 'paid', fee: number) => {
    try {
      localStorage.setItem('tournamentPaymentType', type)
      localStorage.setItem('tournamentEntryFee', String(fee))
    } catch {}
    toast.success(`${type === 'paid' ? 'Paid' : 'Free'} selected`)
    // Skip modal for now, go straight to setup
    router.push('/tournament/setup')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <PricingTournament onContinue={handleContinue} />
      {/**
        Modal disabled temporarily:
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#161819] border border-defendrRed shadow-xl">
              <button
                aria-label="Close"
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
              <CreateTournamentModel />
            </div>
          </div>
        )}
      */}
    </div>
  )
}
