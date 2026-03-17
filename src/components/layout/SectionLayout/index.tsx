import { cn } from '@/lib/utils'
// import classNames from 'classnames'
import { CSSProperties, ReactNode } from 'react'
export type SectionVariant = 'default' | 'full'
interface SectionLayoutProps {
  children: ReactNode
  sectionVariant?: SectionVariant
  innerClassName?: string
  className?: string
  style?: CSSProperties
}

const containersClass: Record<SectionVariant, string> = {
  default:
    'desktop:col-start-2 px-20 desktop:col-span-1 tablet:px-[80px] mobile:px-[15px] desktopXl:!px-0 ',
  full: 'desktop:col-start-1 desktop:col-span-3 w-full',
}

const SectionLayout = ({
  children,
  sectionVariant = 'default',
  className,
  innerClassName,
  style,
}: SectionLayoutProps) => {
  const sectionClassName = cn(
    'grid desktop:grid-cols-[1fr_1320px_1fr] grid-rows-1 grid-cols-1 desktop:px-0 flex-1 bg-defendrBg',
    className,
  )
  const contentClassName = cn(containersClass[sectionVariant], innerClassName)

  return (
    <div className={sectionClassName} style={style}>
      <div className={contentClassName}>{children}</div>
    </div>
  )
}

export default SectionLayout
