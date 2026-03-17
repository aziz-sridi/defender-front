import React from 'react'

const Bell = ({
  fill = '#48588a',

  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height="16.645"
      viewBox="0 0 16.645 20.575"
      width="16.645"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g data-name="Groupe 2" transform="rotate(-7 14.388 .88)">
        <path
          d="M7.221 18.956a1.854 1.854 0 01-1.805-1.9h3.61a1.854 1.854 0 01-1.805 1.9zm6.318-3.791H.9a.927.927 0 01-.9-.948v-.559a.98.98 0 01.262-.664l.749-.786a2.9 2.9 0 00.795-2.01V7.582A5.913 5.913 0 012.888 4.17L3.7 3.033A2.68 2.68 0 015.867 1.9h.451V.474A.463.463 0 016.77 0h.9a.463.463 0 01.451.474V1.9h.451a2.68 2.68 0 012.167 1.137l.812 1.137a5.918 5.918 0 011.083 3.412V10.2a2.9 2.9 0 00.794 2.01l.749.786a.977.977 0 01.262.664v.559a.927.927 0 01-.9.946z"
          data-name="Icon color"
          fill={fill}
        />
      </g>
    </svg>
  )
}

export default Bell
