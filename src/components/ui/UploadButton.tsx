import React from 'react'
import { Icon } from '@iconify/react'

interface UploadButtonProps {
  variant: 'upload' | 'remove'
  onClick?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export default function UploadButton({
  variant,
  onClick,
  children,
  className = '',
  disabled = false,
}: UploadButtonProps) {
  const baseClasses =
    'px-4 py-2 rounded-lg font-medium text-sm transition-colors font-poppins flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed'

  const variantClasses = {
    upload: 'border border-defendrGrey text-white hover:border-defendrLightGrey bg-transparent',
    remove:
      'bg-transparent border border-defendrRed text-defendrRed hover:bg-defendrRed hover:text-white',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {variant === 'remove' && <Icon className="w-4 h-4" icon="mdi:trash-can-outline" />}
      {children}
    </button>
  )
}
