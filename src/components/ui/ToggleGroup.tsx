import React from 'react'

interface ToggleGroupProps {
  label?: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function ToggleGroup({
  label,
  options,
  value,
  onChange,
  className = '',
}: ToggleGroupProps) {
  return (
    <div className={`${className}`}>
      {label && <label className="block text-white mb-2 font-poppins">{label}</label>}
      <div className="flex">
        {options.map(option => (
          <button
            key={option.value}
            className={`
              px-4 py-2 text-sm font-medium transition-colors border
              ${
                option.value === value
                  ? 'bg-defendrRed text-white border-defendrRed'
                  : 'bg-defendrLightBlack text-defendrGrey border-defendrGrey hover:bg-defendrGrey hover:text-white'
              }
              ${options.indexOf(option) === 0 ? 'rounded-l-full' : ''}
              ${options.indexOf(option) === options.length - 1 ? 'rounded-r-full' : ''}
              ${options.indexOf(option) !== 0 ? 'border-l-0' : ''}
              font-poppins
            `}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
