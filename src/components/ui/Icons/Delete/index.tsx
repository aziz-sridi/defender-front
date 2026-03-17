import React from 'react'

interface DeleteProps {
  size?: number
  color?: string
  className?: string
  lidColor?: string
}

const Delete: React.FC<DeleteProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  lidColor,
}) => {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 7h16" stroke={lidColor || color} />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

export default Delete
