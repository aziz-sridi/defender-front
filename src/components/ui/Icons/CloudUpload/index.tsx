import React from 'react'

interface CloudUploadProps {
  size?: number
  color?: string
  className?: string
  arrowColor?: string
}

const CloudUpload: React.FC<CloudUploadProps> = ({
  size = 32,
  color = '#94a3b8',
  arrowColor = '#D62755',
  className = '',
}) => {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.5 15.5C24.5 12.5 22 10 19 10C18.5 7.5 16 6 13.5 6C9.5 6 6.5 9.5 6.5 13C3.5 13.5 2 16 2 18.5C2 21.5 4 23.5 7 23.5H24C26.5 23.5 28.5 21.5 28.5 19C28.5 16.5 26.5 15 24.5 15.5Z"
        fill={color}
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />

      <path d="M15 12V20" stroke={arrowColor} strokeLinecap="round" strokeWidth="2" />
      <path d="M15 12L12 15" stroke={arrowColor} strokeLinecap="round" strokeWidth="2" />
      <path d="M15 12L18 15" stroke={arrowColor} strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

export default CloudUpload
