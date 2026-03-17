import React from 'react'

interface FormSelectProps {
  label: string
  placeholder: string
  value?: string
  onChange?: (value: string) => void
  options?: { value: string; label: string }[]
  className?: string
}

export default function FormSelect({
  label,
  placeholder,
  value,
  onChange,
  options = [],
  className = '',
}: FormSelectProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-white font-medium mb-2 text-xs font-poppins">{label}</label>
      <div className="relative">
        <select
          className="bg-defendrLightBlack text-white rounded-xl px-3 py-2 border border-defendrGrey focus:border-defendrRed outline-none font-poppins text-sm appearance-none cursor-pointer w-full transition-colors"
          value={value}
          onChange={e => onChange?.(e.target.value)}
        >
          <option disabled className="text-defendrGrey" value="">
            {placeholder}
          </option>
          {options.map(option => (
            <option
              key={option.value}
              className="bg-defendrLightBlack text-white"
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-3 h-3 text-defendrGrey"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </div>
      </div>
    </div>
  )
}
