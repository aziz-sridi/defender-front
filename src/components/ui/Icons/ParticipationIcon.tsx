import React from 'react'

interface ParticipationIconProps {
  type: 'Team' | 'Solo'
}

const ParticipationIcon = ({ type }: ParticipationIconProps) => (
  <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
    {type === 'Team' ? (
      <path
        d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4ZM8 4C10.2091 4 12 5.79086 12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8C4 5.79086 5.79086 4 8 4ZM8 14C12.42 14 16 15.79 16 18V20H0V18C0 15.79 3.58 14 8 14ZM16 14C20.42 14 24 15.79 24 18V20H18V18.5C18 16.5 17.5 15.5 16 14Z"
        fill="currentColor"
      />
    ) : (
      <path
        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
        fill="currentColor"
      />
    )}
  </svg>
)

export default ParticipationIcon
