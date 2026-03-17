import React from 'react'

interface FormInputProps {
  label: string
  placeholder: string
  type?: 'text' | 'date' | 'time'
  value?: string
  onChange?: (value: string) => void
  className?: string
  labelClassName?: string
}

export default function FormInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  className = '',
  labelClassName = 'text-defendrRed',
}: FormInputProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Allow overriding label style per usage via labelClassName; default remains red */}
      <label className={`${labelClassName} font-medium mb-2 text-sm font-poppins`}>{label}</label>
      <input
        className="bg-defendrLightBlack text-white rounded-lg px-4 py-3 border border-defendrGrey focus:border-defendrRed outline-none placeholder-defendrGrey font-poppins transition-colors"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />
    </div>
  )
}
