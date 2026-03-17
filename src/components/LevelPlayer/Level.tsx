const Level = ({
  percentage,
  levelColor,
  image,
  svgWidthHeigth = 200,
  strockWidth = 15,
}: {
  percentage: number
  svgWidthHeigth?: number
  strockWidth?: number
  levelColor: string
  image: string
}) => {
  const circleWidth = 200
  const radius = 80

  const dashArray = radius * Math.PI * 2
  const dashOffset = dashArray - (dashArray * percentage) / 100
  const imageSize = radius * 2

  return (
    <div>
      <svg
        height={svgWidthHeigth}
        viewBox={`0 0 ${circleWidth} ${circleWidth}`}
        width={svgWidthHeigth}
      >
        <image
          clipPath="circle(50%)"
          height={imageSize}
          href={image}
          width={imageSize}
          x={(circleWidth - imageSize) / 2}
          y={(circleWidth - imageSize) / 2}
        />
        <circle
          className={`fill-none`}
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          r={radius}
          strokeWidth={`${strockWidth}px`}
          style={{ strokeOpacity: 0.2, stroke: levelColor }}
        />
        {/* fill-none stroke-[#ec2fce] */}
        <circle
          className={`fill-none`}
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          r={radius}
          strokeWidth={`${strockWidth}px`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            stroke: levelColor,
          }}
          transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
        />
      </svg>
    </div>
  )
}

export default Level
