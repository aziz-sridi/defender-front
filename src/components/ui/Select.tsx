import React from 'react'

interface SelectProps {
  label?: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function Select({ label, options, value, onChange, className = '' }: SelectProps) {
  return (
    <div className={`${className}`}>
      {label && <label className="block text-white mb-2 font-poppins">{label}</label>}
      <div className="relative">
        <select
          className="w-full bg-[#312F31] text-white rounded-full px-4 py-2 sm:py-1.5 appearance-none border-none focus:outline-none focus:ring-2 focus:ring-defendrRed font-poppins transition-colors"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          {options.map(option => (
            <option key={option.value} className="bg-[#312F31] text-white" value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-defendrGrey"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  )
}
