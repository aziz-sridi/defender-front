import React from 'react'
import type { SVGProps } from 'react'

export function TwitchWB(props: SVGProps<SVGSVGElement>) {
  return (
    <svg height={24} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        clipRule="evenodd"
        d="M3 1L1.5 5v15H7v3h3l3-3h4l5.5-5.5V1zm2 2h15.5v10.5L17 17h-5l-2.5 2.5V17H5zm5 9.5V7h2v5.5zM15 7v5.5h2V7z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}
