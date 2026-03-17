import * as React from 'react'

export const CalendarEmpty = ({
  height = '1em',
  fill = 'currentColor',
  focusable = 'false',
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, 'children'>) => (
  <svg
    focusable={focusable}
    height={height}
    role="img"
    viewBox="0 0 59 54"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
  >
    <path
      clipRule="evenodd"
      d="M18.4349 2.25C19.7926 2.25 20.8932 3.25736 20.8932 4.5V6.75H38.1016V4.5C38.1016 3.25736 39.2022 2.25 40.5599 2.25C41.9176 2.25 43.0182 3.25736 43.0182 4.5V6.80555C49.2296 7.36999 54.0807 12.1665 54.0807 18V38.25C54.0807 44.4632 48.5776 49.5 41.7891 49.5H17.2057C10.4172 49.5 4.91406 44.4632 4.91406 38.25V18C4.91406 12.1665 9.76519 7.36999 15.9766 6.80555V4.5C15.9766 3.25736 17.0772 2.25 18.4349 2.25ZM10.2504 15.75H48.7444C47.732 13.1283 45.0002 11.25 41.7891 11.25H17.2057C13.9946 11.25 11.2628 13.1283 10.2504 15.75ZM49.1641 20.25H9.83073V38.25C9.83073 41.9779 13.1326 45 17.2057 45H41.7891C45.8622 45 49.1641 41.9779 49.1641 38.25V20.25Z"
      fill={fill}
      fillRule="evenodd"
    />
  </svg>
)

export default CalendarEmpty
