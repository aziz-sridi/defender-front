'use client'
import React from 'react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'

interface ConfirmationModalProps {
  message: string
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
  disabled?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  isOpen,
  onCancel,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  disabled = false,
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-[#000] p-6 rounded-2xl leading-tight w-96 text-center">
        <Typo as="p" className="text-white mb-4" fontFamily="poppins" fontVariant="p4">
          {message}
        </Typo>
        <div className="flex justify-center gap-4 mt-6">
          <Button
            className="rounded-lg text-white w-auto"
            label={cancelLabel}
            variant="outlined-grey"
            onClick={onCancel}
          />
          <Button
            className="rounded-lg w-auto text-white"
            disabled={disabled}
            label={confirmLabel}
            variant="contained-red"
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
