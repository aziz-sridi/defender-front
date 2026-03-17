import Image, { ImageProps } from 'next/image'

type AppImageProps = ImageProps & {
  className?: string
  alt: string
}

export default function AppImage({ className = '', alt, ...props }: AppImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      className={`object-contain ${className}`}
      loading="lazy"
      placeholder="empty"
    />
  )
}
