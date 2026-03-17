'use client'

import React from 'react'
import { X, AlertTriangle } from 'lucide-react'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: 'text-red-500',
          confirmButtonVariant: 'contained-red' as const,
        }
      case 'warning':
        return {
          iconColor: 'text-yellow-500',
          confirmButtonVariant: 'contained-yellow' as const,
        }
      case 'info':
        return {
          iconColor: 'text-blue-500',
          confirmButtonVariant: 'contained-blue' as const,
        }
      default:
        return {
          iconColor: 'text-red-500',
          confirmButtonVariant: 'contained-red' as const,
        }
    }
  }

  const { iconColor, confirmButtonVariant } = getVariantStyles()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-defendrLightBlack to-defendrGrey rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-600/50 backdrop-blur-sm">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon and Title */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-full bg-red-500/20 ${iconColor}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
          <Typo
            as="h3"
            className="text-2xl font-bold"
            color="white"
            fontFamily="poppins"
            fontVariant="h2"
          >
            {title}
          </Typo>
        </div>

        {/* Message */}
        <div className="mb-8">
          <Typo
            as="p"
            className="text-gray-200 leading-relaxed text-lg"
            fontFamily="poppins"
            fontVariant="p1"
          >
            {message}
          </Typo>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            label={cancelText}
            size="m"
            variant="outlined-white"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            label={confirmText}
            size="m"
            variant={confirmButtonVariant}
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
