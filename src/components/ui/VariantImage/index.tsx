import Image from 'next/image'

import { imageUrlSanitizer, DEFAULT_IMAGES } from '@/utils/imageUrlSanitizer'
import { cn } from '@/lib/utils'

export interface VariantImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  variant?: 'default' | 'rounded' | 'circle' | 'bordered' | 'shadowed' | 'highlighted'
  className?: string
  onClick?: () => void
}

export const VariantImage = ({
  src = '/placeholder.png',
  alt,
  width = 300,
  height = 200,
  variant = 'default',
  className,
  onClick,
}: VariantImageProps) => {
  // SSR-friendly fallback selection without client state
  const isProfile = alt.toLowerCase().includes('profile')
  const isBackground = alt.toLowerCase().includes('background')
  const isTeam = alt.toLowerCase().includes('team')
  const isTournament = alt.toLowerCase().includes('tournament')
  const isOrganization = alt.toLowerCase().includes('organization')

  // Determine image type based on alt text
  let imageType: 'user' | 'team' | 'tournament' | 'organization' | 'general' = 'general'
  if (isProfile) imageType = 'user'
  else if (isTeam) imageType = 'team'
  else if (isTournament) imageType = 'tournament'
  else if (isOrganization) imageType = 'organization'

  const fallback = isProfile
    ? DEFAULT_IMAGES.USER
    : isBackground
      ? DEFAULT_IMAGES.USER_BANNER
      : DEFAULT_IMAGES.USER

  const safeSrc = imageUrlSanitizer(src, imageType, fallback)

  const variantClasses = cn(
    {
      'object-cover': true,
      'transition-all duration-300': true,
      'rounded-none': variant === 'default',
      'rounded-lg': variant === 'rounded',
      'rounded-full': variant === 'circle',
      'border-2 border-gray-300': variant === 'bordered',
      'shadow-md': variant === 'shadowed',
      'hover:scale-105 hover:shadow-lg': variant === 'highlighted',
    },
    className,
  )

  return (
    <div className="inline-block" onClick={onClick}>
      <Image
        unoptimized
        alt={alt}
        className={variantClasses}
        height={height}
        src={safeSrc}
        width={width}
      />
    </div>
  )
}
