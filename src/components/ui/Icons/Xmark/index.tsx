import * as React from 'react'

const Xmark = ({ height = '1em', width = '1em', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height={height}
    stroke="currentColor"
    viewBox="0 0 24 24"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" strokeWidth="2" />
  </svg>
)

export default Xmark
