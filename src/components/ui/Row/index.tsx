import React from 'react'

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  gap?: string
  align?: string
  justify?: string
  wrap?: boolean
  xs?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
  xl?: boolean
  xxl?: boolean
  fluid?: boolean
}

const Row: React.FC<RowProps> = ({
  children,
  className = '',
  gap = '',
  align = '',
  wrap = true,
  justify = '',
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  fluid = false,
  ...props
}) => {
  const rowClasses = [
    xs ? 'row-xs' : '',
    sm ? 'sm:row' : '',
    md ? 'md:row' : '',
    lg ? 'lg:row' : '',
    xl ? 'xl:row' : '',
    xxl ? '2xl:row' : '',
    fluid ? 'container-fluid' : 'container',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`flex flex-row${wrap ? ' flex-wrap' : ''} ${gap} ${align} ${justify} ${rowClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Row
