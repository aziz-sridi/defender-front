import React from 'react'

interface TagProps {
  text: string
  color?: 'defendrRed' | 'defendrBlue' | 'defendrBeige' | 'defendrBlack'
  variant?: 'filled' | 'hollow'
  textSize?: 'small' | 'medium' | 'large' | 'xlarge'
  textColor?: string
}

const Tag: React.FC<TagProps> = ({
  text,
  color = 'defendrRed',
  variant = 'filled',
  textSize = 'medium',
  textColor,
}) => {
  const colorClasses: Record<NonNullable<TagProps['color']>, string> = {
    defendrRed: 'bg-defendrRed text-white border-defendrRed',
    defendrBlack: 'bg-black text-white border-defendrBlack',
    defendrBlue: 'bg-defendrBlue text-white border-defendrBlue',
    defendrBeige: 'bg-defendrBeige text-black border-defendrBeige',
  }

  const hollowColorClasses: Record<NonNullable<TagProps['color']>, string> = {
    defendrBlack: 'text-white border-defendrBlack',
    defendrRed: 'text-defendrRed border-defendrRed',
    defendrBlue: 'text-defendrBlue border-defendrBlue',
    defendrBeige: 'text-defendrBeige border-defendrBeige',
  }

  const textSizeClasses: Record<NonNullable<TagProps['textSize']>, string> = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-lg',
    xlarge: 'text-xl',
  }

  return (
    <span
      className={`inline-flex justify-center items-center w-auto px-4 py-0.5 rounded-[10px] font-poppins border-2 whitespace-nowrap ${
        textSizeClasses[textSize]
      } ${
        variant === 'filled' ? colorClasses[color] : `bg-transparent ${hollowColorClasses[color]}`
      }`}
      style={{
        color: textColor || undefined,
      }}
    >
      {text}
    </span>
  )
}

export default Tag
