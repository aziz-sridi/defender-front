import React from 'react'

interface Props {
  size?: number
  color?: string
  className?: string
}

const DownArrow: React.FC<Props> = ({ size = 24, color = 'currentColor', className = '' }) => {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 8 L12 16 L20 8" />
    </svg>
  )
}

export default DownArrow
