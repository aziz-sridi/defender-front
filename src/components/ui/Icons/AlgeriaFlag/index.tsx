import * as React from 'react'

export const AlgeriaFlag = ({
  height = '1em',
  width = 'auto',
  className = '',
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, 'children'>) => (
  <svg
    height={height}
    width={width}
    viewBox="0 0 900 600"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="900" height="600" fill="#fff" />
    <rect width="450" height="600" fill="#006233" />
    <path
      fill="#D62328"
      d="M579.903811 225a150 150 0 1 0 0 150 120 120 0 1 1 0-150M585.676275 300 450 255.916106 533.852549 371.329239v-142.658277L450 344.083894z"
    />
  </svg>
)

export default AlgeriaFlag
