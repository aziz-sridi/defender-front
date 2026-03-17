import React from 'react'

import Button from '@/components/ui/Button'

interface NextButtonProps {
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function NextButton({ onClick, className = '', disabled = false }: NextButtonProps) {
  return (
    <Button
      className={`font-poppins ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      label="Next"
      size="xxs"
      variant="contained-red"
      onClick={onClick}
    />
  )
}
