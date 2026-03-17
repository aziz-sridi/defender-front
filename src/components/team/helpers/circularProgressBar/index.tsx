interface CircularProgressBarProps {
  size?: number
  progress?: number
  color?: string
  children?: React.ReactNode
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size = 48,
  progress = 0,
  color = 'var(--defendr-red)',
  children,
}) => {
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute" height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={color}
          strokeOpacity={0.3}
          strokeWidth={strokeWidth}
        />
      </svg>

      <svg
        className="absolute"
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

export default CircularProgressBar
