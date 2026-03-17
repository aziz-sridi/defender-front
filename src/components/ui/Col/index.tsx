import React from 'react'

type ColSize = number | 'auto'

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  gap?: string
  align?: string
  justify?: string
  wrap?: boolean
  xs?: ColSize
  sm?: ColSize
  md?: ColSize
  lg?: ColSize
  xl?: ColSize
  xxl?: ColSize
}

const getColClass = (size: ColSize | undefined, prefix = '') => {
  if (!size) {
    return ''
  }
  return size === 'auto' ? `${prefix}col-auto` : `${prefix}col-${size}`
}

const Col: React.FC<ColProps> = ({
  children,
  className = '',
  gap = '',
  align = '',
  justify = '',
  wrap = true,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  ...props
}) => {
  const colClasses = [
    getColClass(xs),
    getColClass(sm, 'sm:'),
    getColClass(md, 'md:'),
    getColClass(lg, 'lg:'),
    getColClass(xl, 'xl:'),
    getColClass(xxl, '2xl:'),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`flex flex-col${wrap ? ' flex-wrap' : ''} ${gap} ${align} ${justify} ${colClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Col
