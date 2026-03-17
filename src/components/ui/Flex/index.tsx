import React from 'react'

type ResponsiveValue<T> =
  | T
  | {
      xs?: T
      sm?: T
      md?: T
      lg?: T
      xl?: T
      xxl?: T
    }

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  direction?: ResponsiveValue<'row' | 'col'>
  align?: ResponsiveValue<string>
  justify?: ResponsiveValue<string>
  gap?: ResponsiveValue<string>
  wrap?: boolean
  className?: string
}

const getResponsiveClasses = (
  prop: ResponsiveValue<string> | undefined,
  prefix: string,
): string => {
  if (!prop) {
    return ''
  }
  if (typeof prop === 'string') {
    return `${prefix}-${prop}`
  }

  return Object.entries(prop)
    .map(([breakpoint, value]) => {
      if (!value) {
        return ''
      }
      if (breakpoint === 'xs') {
        return `${prefix}-${value}`
      }
      return `${breakpoint}:${prefix}-${value}`
    })
    .filter(Boolean)
    .join(' ')
}

const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  align = 'items-center',
  justify = 'justify-start',
  gap = 'gap-2',
  wrap = true,
  className = '',
  ...props
}) => {
  const directionClasses =
    typeof direction === 'string' ? `flex-${direction}` : getResponsiveClasses(direction, 'flex')

  const alignClasses = getResponsiveClasses(align, 'items')
  const justifyClasses = getResponsiveClasses(justify, 'justify')
  const gapClasses = getResponsiveClasses(gap, 'gap')

  return (
    <div
      className={`flex ${directionClasses} ${wrap ? 'flex-wrap' : ''} ${alignClasses} ${justifyClasses} ${gapClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Flex
