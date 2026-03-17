import Link from 'next/link'
import { FC, ReactNode } from 'react'

import Typo, { FontColor, fontFamily } from '@/components/ui/Typo'
import { cn } from '@/lib/utils'

type ButtonVariant =
  | 'contained-red'
  | 'contained-blue'
  | 'contained-ghostRed'
  | 'contained-black'
  | 'contained-green'
  | 'contained-all-white'
  | 'containedWithoutOutline-ghostRed'
  | 'outlined-red'
  | 'outlined-yellow'
  | 'outlined-grey'
  | 'text'
  | 'text-red'
  | 'contained-dark'
  | 'black'
  | 'contained-gray'

type ButtonType = 'button' | 'submit'
type ButtonIconOrientation = 'left' | 'right'

type ButtonSize = 'auto' | 'xxxs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'

interface IButtonTextStyle {
  props: {
    color: FontColor
  }
  hoverClassName?: string
}

const buttonTextStyle: Record<ButtonVariant, IButtonTextStyle> = {
  'contained-dark': { props: { color: 'white' } },
  'contained-red': { props: { color: 'white' } },
  'contained-blue': { props: { color: 'white' } },
  'contained-ghostRed': { props: { color: 'white' } },
  'contained-black': { props: { color: 'white' } },
  'contained-green': { props: { color: 'white' } },
  'contained-all-white': { props: { color: 'black' } },
  'containedWithoutOutline-ghostRed': { props: { color: 'white' } },
  'outlined-red': { props: { color: 'white' } },
  'outlined-yellow': { props: { color: 'white' } },
  'outlined-grey': { props: { color: 'grey' } },
  text: { props: { color: 'white' } },
  'text-red': { props: { color: 'customRed600' } },
  black: { props: { color: 'white' } },
  'contained-gray': { props: { color: 'white' } },
}

const sizeClassMap: Record<ButtonSize, string> = {
  auto: 'w-auto h-auto',
  xxxs: 'w-[40px] h-[20px]',
  xxs: 'w-[134px] h-[45px]',
  xs: 'w-[201px] h-[45px]',
  s: 'w-[272px] h-[35px]',
  m: 'w-[297px] h-[65px] ',
  l: 'w-[387px] h-[52px]',
  xl: 'w-[420px] h-[42px]',
  xxl: 'w-[756px] h-[42px]',
}

interface IButtonProps {
  label?: React.ReactNode
  icon?: ReactNode
  size?: ButtonSize
  iconOrientation?: ButtonIconOrientation
  variant?: ButtonVariant
  type?: ButtonType
  className?: string
  containerClassName?: string
  textClassName?: string
  href?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  selected?: boolean
  fontFamily?: fontFamily
}

const MaybeLink = ({
  href,
  children,
  className,
}: {
  href?: string
  children: React.ReactNode
  className?: string
}) => {
  return href ? (
    <Link className={className} href={href}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  )
}

const Button: FC<IButtonProps> = ({
  label,
  size = 'xl',
  disabled = false,
  className,
  textClassName,
  containerClassName,
  variant = 'contained-red',
  type = 'button',
  iconOrientation = 'right',
  href,
  selected = false,
  icon,
  fontFamily = 'poppins',
  ...props
}) => {
  const Classes = cn(
    'transition-all duration-200 ease-in-out flex items-center justify-center gap-[10px] group disabled:opacity-40 disabled:cursor-not-allowed hover:cursor-pointer',
    size && sizeClassMap[size],
    variant === 'contained-black' &&
      'bg-defendrLightBlack text-white rounded-xl py-[16px] px-[15px] ',
    variant === 'contained-red' &&
      `${disabled ? 'bg-defendrGrey' : 'bg-defendrRed hover:bg-defendrHoverRed'} text-white rounded-xl py-[16px] px-[15px]`,
    variant === 'contained-blue' && 'bg-defendrBlue text-white rounded-xl py-[16px] px-[15px]',
    variant === 'contained-green' && 'bg-defendrGreen text-white rounded-xl py-[16px] px-[15px]',
    variant === 'contained-ghostRed' &&
      'text-white py-[16px] px-[15px] rounded-full ' +
        [selected ? 'bg-defendrLightRed  border border-defendrRed ' : 'bg-defendrGrey '],
    variant === 'contained-all-white' &&
      'bg-defendrWhite border-none text-defendrBlack rounded-xl py-[16px] px-[15px]',
    variant === 'containedWithoutOutline-ghostRed' &&
      'bg-defendrLightRed  text-white rounded-full py-[16px] px-[15px]',
    variant === 'black' && 'bg-black text-white rounded-xl py-[16px] px-[15px]',

    variant === 'outlined-red' &&
      'bg-transparent border border-defendrRed text-defendrRed rounded-xl py-[16px] px-[15px]',
    variant === 'outlined-yellow' &&
      'bg-transparent border border-defendrBeige text-defendrBeige rounded-xl py-[16px] px-[15px]',
    variant === 'outlined-grey' &&
      'bg-transparent border border-defendrGrey text-defendrGrey rounded-xl py-[16px] px-[15px]',

    variant === 'text' && [
      'bg-transparent hover:underline',
      disabled ? 'text-defendrGrey' : 'text-defendrWhite',
    ],
    variant === 'contained-gray' &&
      'bg-gray-700 hover:bg-gray-800 text-white rounded-xl py-[16px] px-[15px]',

    containerClassName,
    className,
  )

  return (
    <MaybeLink href={href}>
      <button className={Classes} disabled={disabled} type={type} {...props}>
        {iconOrientation === 'left' && icon}
        {label && (
          <Typo
            className={cn(buttonTextStyle[variant]?.hoverClassName, textClassName)}
            {...buttonTextStyle[variant]?.props}
            as="span"
            color={variant === 'text' && selected ? 'red' : buttonTextStyle[variant]?.props.color}
            fontFamily={fontFamily}
            fontVariant="p4"
          >
            {label}
          </Typo>
        )}

        {iconOrientation === 'right' && icon}
      </button>
    </MaybeLink>
  )
}

export default Button
