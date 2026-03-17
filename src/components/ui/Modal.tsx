'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
  showCloseButton?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`
        relative bg-defendrLightBlack border border-defendrGrey rounded-lg
        max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto
        ${className}
      `}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-defendrGrey">
            {title && <h2 className="text-xl font-bold text-white font-poppins">{title}</h2>}
            {showCloseButton && (
              <button
                className="text-defendrGrey hover:text-white transition-colors p-1"
                onClick={onClose}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="p-4">{children}</div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
