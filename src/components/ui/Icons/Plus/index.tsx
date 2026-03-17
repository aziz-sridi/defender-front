import * as React from 'react'

const Plus = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={`mr-2 ${className}`.trim()}
    fill="none"
    height="20"
    stroke="currentColor"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

export default Plus
