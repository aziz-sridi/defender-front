import React from 'react'

interface BracketTypeBoxProps {
  id: string
  label: string
  icon: React.ReactNode
  isSelected: boolean
  onClick: (id: string) => void
  className?: string
}

export default function BracketTypeBox({
  id,
  label,
  icon,
  isSelected,
  onClick,
  className = '',
}: BracketTypeBoxProps) {
  return (
    <button
      className={`
        w-48 h-40 rounded-2xl border-2 transition-all duration-200
        flex flex-col items-center justify-center gap-4 p-6
        font-poppins hover:scale-105
        ${
          isSelected
            ? 'border-defendrRed bg-defendrRed'
            : 'border-defendrGrey bg-defendrLightBlack hover:border-defendrLightGrey'
        }
        ${className}
      `}
      onClick={() => onClick(id)}
    >
      <div className="flex items-center justify-center h-16">{icon}</div>
      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white'}`}>
        {label}
      </span>
    </button>
  )
}
