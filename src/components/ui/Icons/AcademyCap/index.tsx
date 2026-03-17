import type { SVGProps } from 'react'

const AcademyCap = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 8.25 12 4l9 4.25-9 4.25-9-4.25Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m6 10.5-.01 4.25c0 2.25 3.13 4.1 6.99 4.1s7-1.85 7-4.1V10.5"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 11v4"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx={21} cy={16.25} r={1} fill="currentColor" />
  </svg>
)

export default AcademyCap
