import React from 'react'

interface CheckboxProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export default function Checkbox({
  id,
  label,
  description,
  checked,
  onChange,
  className = '',
}: CheckboxProps) {
  return (
    <div className={`flex ${className}`}>
      <div className="flex-shrink-0 mt-1">
        <input
          checked={checked}
          className="w-5 h-5 accent-pink-500 bg-transparent border-pink-500 rounded cursor-pointer"
          id={id}
          type="checkbox"
          onChange={e => onChange(e.target.checked)}
        />
      </div>
      <div className="ml-3">
        <label className="text-white font-medium cursor-pointer font-poppins" htmlFor={id}>
          {label}
        </label>
        {description && <p className="text-defendrGrey text-sm mt-1 font-poppins">{description}</p>}
      </div>
    </div>
  )
}
