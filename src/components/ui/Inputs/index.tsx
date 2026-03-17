'use client'
import { cn } from '@/lib/utils'
import { FC, ReactNode, useState } from 'react'
import { Eye } from '@/components/ui/Icons/Eye'
import { EyeSlash } from '@/components/ui/Icons/EyeSlash'

type InputSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'
type IconOrientation = 'left' | 'right'

interface IInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  size?: InputSize
  className?: string
  textClassName?: string
  icon?: ReactNode
  iconOrientation?: IconOrientation
  type?: string
  disabled?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  name?: string
  autoComplete?: string

  fontColor?: string
  backgroundColor?: string
  backgroundHoverColor?: string
  borderColor?: string
  onFocus?: () => void
  onBlur?: () => void
}

const sizeClassMap: Record<InputSize, string> = {
  xxs: 'h-[35px] text-xs px-2',
  xs: 'h-[40px] text-sm px-3',
  s: 'h-[45px] text-base px-4',
  m: 'h-[50px] text-base px-5',
  l: 'h-[55px] text-lg px-6',
  xl: 'h-[60px] text-lg px-7',
  xxl: 'h-[65px] text-xl px-8',
}

const Input: FC<IInputProps> = ({
  id,
  value,
  onChange,
  placeholder = '',
  size = 'm',
  className,
  textClassName,
  icon,
  iconOrientation = 'left',
  type = 'text',
  disabled = false,
  readOnly = false,
  autoFocus = false,
  name,
  autoComplete,
  fontColor,
  backgroundColor,
  backgroundHoverColor,
  borderColor,
  onFocus,
  onBlur,
}) => {
  // Built-in password visibility toggle
  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

  // Inline styles for colors — avoids Tailwind specificity conflicts
  // Border is opt-in: only applied when borderColor is explicitly passed
  const colorStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || 'transparent',
    ...(borderColor ? { borderWidth: '1px', borderStyle: 'solid', borderColor } : {}),
    color: fontColor || 'white',
  }

  // Password field — uses relative wrapper with absolute eye button
  if (isPassword) {
    return (
      <div className={cn('relative', className)}>
        <input
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={cn(
            'w-full rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-white/20 placeholder-gray-500 pr-12',
            sizeClassMap[size],
            disabled && 'opacity-50 cursor-not-allowed',
            textClassName,
          )}
          disabled={disabled}
          readOnly={readOnly}
          id={id}
          name={name}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          style={colorStyle}
          type={resolvedType}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors"
          onClick={() => setShowPassword(prev => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? <Eye /> : <EyeSlash />}
        </button>
      </div>
    )
  }

  // Icon input — uses flex wrapper
  if (icon) {
    return (
      <div
        className={cn(
          'flex items-center rounded-2xl transition-colors duration-200 focus-within:ring-1 focus-within:ring-white/20',
          disabled && 'opacity-50 cursor-not-allowed',
          sizeClassMap[size],
          className,
        )}
        style={colorStyle}
      >
        {iconOrientation === 'left' && (
          <span className="mr-2 text-gray-400 flex-shrink-0 flex items-center">{icon}</span>
        )}
        <input
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={cn(
            'flex-1 min-w-0 bg-transparent outline-none placeholder-gray-500 text-white border-none p-0 focus:ring-0',
            textClassName,
            disabled && 'cursor-not-allowed',
          )}
          disabled={disabled}
          id={id}
          name={name}
          readOnly={readOnly}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          style={{ color: fontColor || 'white' }}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {iconOrientation === 'right' && (
          <span className="ml-2 text-gray-400 flex-shrink-0 flex items-center">{icon}</span>
        )}
      </div>
    )
  }

  // Plain input — no icon, no password
  return (
    <input
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      className={cn(
        'rounded-2xl transition-colors duration-200 focus:ring-1 focus:ring-white/20 focus:outline-none placeholder-gray-500 w-full',
        sizeClassMap[size],
        disabled && 'opacity-50 cursor-not-allowed',
        textClassName,
        className,
      )}
      disabled={disabled}
      readOnly={readOnly}
      id={id}
      name={name}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      style={colorStyle}
      type={resolvedType}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default Input
