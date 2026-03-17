import * as React from 'react'

export const Mission = ({
  height = '1em',
  strokeWidth = '2',
  fill = 'none',
  focusable = 'false',
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, 'children'>) => (
  <svg
    focusable={focusable}
    height={height}
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M22 12h-4M6 12H2m10-6V2m0 20v-4" />
    </g>
  </svg>
)
export default Mission
