import { AVATAR_GRADIENTS } from '@/lib/constants'
interface AvatarProps {
  name: string
  size?: number
  className?: string
  imageUrl?: string
}
const Avatar: React.FC<AvatarProps> = ({ name, size = 64, className = '', imageUrl }) => {
  if (!name) {
    throw new Error('Avatar component requires a valid `name` prop.')
  }
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const colors = AVATAR_GRADIENTS

  const colorIndex = name.length % colors.length

  if (imageUrl && imageUrl.trim() !== '') {
    return (
      <div
        className={`rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          alt={name}
          className="w-full h-full object-cover"
          src={imageUrl || '/placeholder.JPG'}
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

  const getGradientStyle = (colorClass: string) => {
    const gradients = {
      'bg-gradient-to-br from-purple-500 to-pink-500':
        'linear-gradient(to bottom right, #8b5cf6, #ec4899)',
      'bg-gradient-to-br from-blue-500 to-cyan-500':
        'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
      'bg-gradient-to-br from-green-500 to-emerald-500':
        'linear-gradient(to bottom right, #22c55e, #10b981)',
      'bg-gradient-to-br from-orange-500 to-red-500':
        'linear-gradient(to bottom right, #f97316, #ef4444)',
      'bg-gradient-to-br from-indigo-500 to-purple-500':
        'linear-gradient(to bottom right, #6366f1, #8b5cf6)',
    }
    return (
      gradients[colorClass as keyof typeof gradients] ||
      'linear-gradient(to bottom right, #6366f1, #8b5cf6)'
    )
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: getGradientStyle(colors[colorIndex]),
      }}
    >
      {initials}
    </div>
  )
}

export default Avatar
