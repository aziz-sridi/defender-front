import { cn } from '@/lib/utils'
import React from 'react'

interface GlowingCircleProps {
  color: 'yellow' | 'blue' | 'red' | 'green' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const GlowingCircle: React.FC<GlowingCircleProps> = ({
  color = 'yellow',
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const colorClasses = {
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  }

  const glowColors = {
    yellow: 'shadow-[0_0_25px_10px_rgba(250,204,21,0.4)]',
    blue: 'shadow-[0_0_25px_10px_rgba(59,130,246,0.4)]',
    red: 'shadow-[0_0_25px_10px_rgba(239,68,68,0.4)]',
    green: 'shadow-[0_0_25px_10px_rgba(34,197,94,0.4)]',
    purple: 'shadow-[0_0_25px_10px_rgba(168,85,247,0.4)]',
  }

  return (
    <div
      className={cn(
        'rounded-full',
        sizeClasses[size],
        colorClasses[color],
        glowColors[color],
        'opacity-70',
        'z-0',
        className,
      )}
    />
  )
}

export default GlowingCircle
