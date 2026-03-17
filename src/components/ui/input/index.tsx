import { cn } from '@/lib/utils'
import { FC, ReactNode } from 'react'

type InputSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'
type IconOrientation = 'left' | 'right'

interface IInputProps {
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
  autoFocus?: boolean
  name?: string
  fontColor?: string
  backgroundColor?: string
  backgroundHoverColor?: string
  borderColor?: string
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  pattern?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void
  'aria-label'?: string
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
  autoFocus = false,
  name,
  fontColor,
  backgroundColor,
  backgroundHoverColor,
  borderColor,
  inputMode,
  pattern,
  onKeyDown,
  onKeyPress,
  onPaste,
  'aria-label': ariaLabel,
}) => {
  const containerClasses = cn(
    'flex items-center rounded-xl border border-white/10 bg-transparent transition-colors duration-200 focus-within:border-[#D62555]/50',
    disabled && 'opacity-50 cursor-not-allowed',
    sizeClassMap[size],
    className,
  )

  const inputClasses = cn(
    'flex-1 bg-transparent outline-none placeholder-gray-400',
    textClassName,
    disabled && 'cursor-not-allowed',
  )

  const styles = {
    backgroundColor,
    borderColor,
    color: fontColor,
  } as React.CSSProperties

  const hoverStyles = backgroundHoverColor
    ? {
        '--tw-bg-opacity': 1,
        '--hover-bg': backgroundHoverColor,
      }
    : {}

  return (
    <div
      className={containerClasses}
      style={{ ...styles, ...hoverStyles }}
      onMouseEnter={e => {
        if (backgroundHoverColor) {
          ;(e.currentTarget as HTMLElement).style.backgroundColor = backgroundHoverColor
        }
      }}
      onMouseLeave={e => {
        if (backgroundColor) {
          ;(e.currentTarget as HTMLElement).style.backgroundColor = backgroundColor
        }
      }}
    >
      {iconOrientation === 'left' && icon && <span className="mr-2 text-gray-400">{icon}</span>}

      <input
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className={inputClasses}
        disabled={disabled}
        inputMode={inputMode}
        name={name}
        pattern={pattern}
        placeholder={placeholder}
        style={{ color: fontColor }}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onKeyPress={onKeyPress}
        onPaste={onPaste}
      />

      {iconOrientation === 'right' && icon && <span className="ml-2 text-gray-400">{icon}</span>}
    </div>
  )
}

export default Input
