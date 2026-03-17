import { cn } from '@/lib/utils'
import React, { FC } from 'react'

const styles = {
  root: 'font-rubik',
  block: 'block',
  start: 'text-left',
  center: 'text-center',
  end: 'text-right',
  justify: 'text-justify',
  h1: 'text-[45px] font-semibold leading-none',
  h2: 'text-[42px] font-semibold leading-none',
  h3: 'text-[36px] font-semibold leading-none',
  h4: 'text-[28px] font-semibold leading-none',
  h5: 'text-[24px] font-semibold leading-none',
  p1: 'text-[22px] font-normal leading-none',
  p1b: 'text-[22px] font-bold leading-none',
  p2: 'text-[20px] font-normal leading-none',
  p2b: 'text-[20px] font-bold leading-none',
  p3: 'text-[18px] font-normal leading-none',
  p3b: 'text-[18px] font-bold leading-none',
  p4: 'text-[16px] font-normal leading-none',
  p4b: 'text-[16px] font-bold leading-none',
  p5: 'text-[14px] font-normal leading-none',
  p5b: 'text-[14px] font-bold leading-none',
  p6: 'text-[10px] font-normal leading-none',
  regular: 'font-normal!',
  medium: 'font-medium!',
  semibold: 'font-semibold!',
  bold: 'font-bold!',
  red: 'text-defendrRed',
  white: 'text-defendrWhite',
  black: 'text-defendrBlack',
  grey: 'text-defendrLightGrey',
  darkGrey: 'text-defendrDarkGrey',
  ghostGrey: 'text-defendrGhostGrey',
  customRed600: 'text-red-600',
  custom868484: 'text-[#868484]',
  yellow: 'text-yellow-500',
  geistSans: 'font-geistSans',
  geistMono: 'font-geistMono',
  poppins: 'font-poppins',

  custom: '',
}
export type fontFamily = 'geistSans' | 'geistMono' | 'poppins'
export type Element = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'legend' | 'label'

export type FontVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'p1'
  | 'p1b'
  | 'p2'
  | 'p2b'
  | 'p3'
  | 'p3b'
  | 'p4'
  | 'p4b'
  | 'p5'
  | 'p5b'
  | 'p6'
  | 'custom'

export type Alignment = 'start' | 'center' | 'end' | 'justify'

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold'

export type FontColor =
  | 'red'
  | 'black'
  | 'grey'
  | 'ghostGrey'
  | 'white'
  | 'custom868484'
  | 'yellow'
  | 'customRed600'
  | 'darkGrey'

interface TypoProps {
  children: React.ReactNode
  as?: Element
  role?: string
  fontVariant?: FontVariant
  color?: FontColor
  tabIndex?: number
  onClick?: () => void
  className?: string
  alignment?: Alignment
  fontWeight?: FontWeight
  fontFamily?: fontFamily
}

const Typo: FC<TypoProps> = ({
  children,
  fontVariant = 'p1',
  color = 'white',
  className,
  alignment,
  fontFamily = 'poppins',
  fontWeight,
  as = 'span',
}) => {
  const Component = as
  const allClassNames = cn(
    styles.root,
    fontVariant && styles[fontVariant],
    fontWeight && styles[fontWeight],
    alignment && styles[alignment],
    color && styles[color],
    fontFamily && styles[fontFamily],

    className,
  )
  return <Component className={`${allClassNames}`}>{children}</Component>
}

export default Typo
