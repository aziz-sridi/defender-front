import * as React from 'react'
export const Chart = ({
  height = '1em',
  strokeWidth = '32',
  fill = 'none',
  focusable = 'false',
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, 'children'>) => (
  <svg
    focusable={focusable}
    height={height}
    role="img"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M32 32v432a16 16 0 0 0 16 16h432"
      fill={fill}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <rect
      fill={fill}
      height="192"
      rx="20"
      ry="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      width="80"
      x="96"
      y="224"
    />
    <rect
      fill={fill}
      height="240"
      rx="20"
      ry="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      width="80"
      x="240"
      y="176"
    />
    <rect
      fill={fill}
      height="304"
      rx="20"
      ry="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      width="80"
      x="383.64"
      y="112"
    />
  </svg>
)
export default Chart
