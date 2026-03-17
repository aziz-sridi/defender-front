'use client'

import { useMemo } from 'react'

import TournamentModal from '@/components/tournament/TournamentModal'
import type { Tournament } from '@/types/tournamentType'

interface PaymentOptionsModalProps {
  open: boolean
  onClose: () => void
  tournament: Tournament
  mode: 'solo' | 'team'
  onProceed: () => void
}

const PaymentOptionsModal = ({
  open,
  onClose,
  tournament,
  mode,
  onProceed,
}: PaymentOptionsModalProps) => {
  const fee = useMemo(() => tournament?.joinProcess?.entryFee || 0, [tournament])
  const title = fee > 0 ? 'Complete your entry' : 'Confirm your entry'
  const description =
    fee > 0
      ? `Entry fee is ${fee} DT. Choose a payment option to complete your ${mode} enrollment.`
      : `No entry fee required. Confirm to join ${mode}.`

  return (
    <TournamentModal
      confirmLabel={fee > 0 ? 'Proceed to payment' : 'Confirm'}
      description={description}
      open={open}
      title={title}
      onClose={onClose}
      onConfirm={onProceed}
    >
      {fee > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="p-4 rounded-md border border-defendrGrey hover:bg-white/5 text-left">
            <div className="font-semibold">Card</div>
            <div className="text-xs text-gray-400">Pay securely with your card</div>
          </button>
          <button className="p-4 rounded-md border border-defendrGrey hover:bg-white/5 text-left">
            <div className="font-semibold">Wallet</div>
            <div className="text-xs text-gray-400">Use DEFENDR wallet balance</div>
          </button>
        </div>
      ) : (
        <div className="text-center text-sm text-gray-300">
          No payment required for this tournament.
        </div>
      )}
    </TournamentModal>
  )
}

export default PaymentOptionsModal
