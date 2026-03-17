'use client'

import type React from 'react'

import { imageUrlSanitizer } from '@/utils/imageUrlSanitizer'

interface AvatarProps {
  name: string
  size?: number
  className?: string
  imageUrl?: string
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 64, className = '', imageUrl }) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const colors = [
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-green-500 to-emerald-500',
    'bg-gradient-to-br from-orange-500 to-red-500',
    'bg-gradient-to-br from-indigo-500 to-purple-500',
  ]

  const colorIndex = name.length % colors.length

  if (imageUrl) {
    const safeImageUrl = imageUrlSanitizer(imageUrl, 'user')

    return (
      <div
        className={`rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          alt={name}
          className="w-full h-full object-cover"
          src={safeImageUrl}
          onError={e => {
            // Fallback to initials if image fails
            const target = e.target as HTMLImageElement
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `<div class="${colors[colorIndex]} w-full h-full flex items-center justify-center text-white font-bold" style="font-size: ${size * 0.4}px">${initials}</div>`
            }
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  )
}

export default Avatar
