import React from 'react'

import Button from '@/components/ui/Button'
import ParticipationIcon from '@/components/ui/Icons/ParticipationIcon'

interface ParticipationTypeButtonProps {
  type: 'Team' | 'Solo'
  isSelected: boolean
  onClick: () => void
  className?: string
}

export default function ParticipationTypeButton({
  type,
  isSelected,
  onClick,
  className = '',
}: ParticipationTypeButtonProps) {
  return (
    <Button
      className={`!w-full !justify-center gap-3 font-poppins ${className}`}
      icon={<ParticipationIcon type={type} />}
      iconOrientation="left"
      label={type}
      size="xxs"
      variant={isSelected ? 'contained-red' : 'outlined-grey'}
      onClick={onClick}
    />
  )
}
