import React, { SVGProps } from 'react'

const Warning = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" height={24} width={24} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1 21 12 2l11 19H1Zm3.45-2h15.1L12 6 4.45 19ZM12 18a.968.968 0 0 0 .713-.288A.964.964 0 0 0 13 17a.973.973 0 0 0-.288-.712A.965.965 0 0 0 12 16a.965.965 0 0 0-.712.288A.973.973 0 0 0 11 17c0 .283.095.52.288.713A.96.96 0 0 0 12 18Zm-1-3h2v-5h-2v5Z"
      fill="#F6D091"
    />
  </svg>
)
export default Warning
