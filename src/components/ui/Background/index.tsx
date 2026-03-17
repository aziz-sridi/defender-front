import React from 'react'
import type { StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'

interface BackgroundProps {
  image: string | StaticImageData
  overlay?: boolean | string
  position?: string | { x?: string; y?: string }
  video?: string[]
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const Background: React.FC<BackgroundProps> = ({
  image,
  overlay,
  position,
  video,
  className,
  style,
  children,
}) => {
  let imageUrl: string
  if (typeof image === 'string') {
    imageUrl = image
  } else {
    imageUrl = image.src
  }
  const bgStyle: React.CSSProperties = { backgroundImage: `url(${imageUrl})`, ...style }
  if (typeof position === 'string') {
    bgStyle.backgroundPosition = position
  } else if (typeof position === 'object' && position !== null) {
    if (position.x) {
      bgStyle.backgroundPositionX = position.x
    }
    if (position.y) {
      bgStyle.backgroundPositionY = position.y
    }
  }

  return (
    <div
      className={cn(
        'bg-holder',
        {
          overlay: !!overlay,
          [`overlay-${overlay}`]: typeof overlay === 'string',
        },
        className,
      )}
      style={bgStyle}
    >
      {video && (
        <video autoPlay loop muted playsInline className="bg-video">
          {video.map((src, index) => (
            <source key={index} src={src} type={`video/${src.split('.').pop()}`} />
          ))}
        </video>
      )}
      {children}
    </div>
  )
}

export default Background
