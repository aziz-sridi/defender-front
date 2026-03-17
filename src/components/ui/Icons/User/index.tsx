import * as React from 'react'

const User = ({ height = '1.5em', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={height}
    stroke="currentColor"
    viewBox="0 0 24 24"
    width={height}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export default User
