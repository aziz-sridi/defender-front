import { SVGProps } from 'react'

const Check = ({
  size = 16,
  className = '',
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="currentColor"
    height={size}
    viewBox="0 0 20 20"
    width={size}
    {...props}
  >
    <path
      clipRule="evenodd"
      d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
      fillRule="evenodd"
    />
  </svg>
)

export default Check
