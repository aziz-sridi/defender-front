import React from 'react'

interface DocumentProps {
  size?: number
  fileColor?: string
  foldColor?: string
  imageColor?: string // Color for the image representation
  className?: string
}

const Document: React.FC<DocumentProps> = ({
  size = 24,
  fileColor = '#ffffffff',
  foldColor = '#D62755', // Lighter blue for fold
  imageColor = '#D62755', // Pink for the image placeholder
  className = '',
}) => {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      stroke={fileColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* File outline */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="white" />

      {/* Folded corner */}
      <polyline fill="white" points="14 2 14 8 20 8" stroke={foldColor} />

      {/* Image representation inside file */}
      <rect
        fill={imageColor}
        height="6"
        stroke={imageColor}
        strokeWidth="0.5"
        width="8"
        x="8"
        y="10"
      />
      <circle cx="12" cy="13" fill="white" r="1.5" />
      <line stroke="white" strokeWidth="1" x1="9" x2="15" y1="16" y2="16" />
    </svg>
  )
}

export default Document
