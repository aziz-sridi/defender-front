interface TheCheckProps {
  className?: string
}

const TheCheck = ({ className }: TheCheckProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
    <path d="M4 8l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default TheCheck
