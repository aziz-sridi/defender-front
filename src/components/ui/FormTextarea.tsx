import React from 'react'

interface FormTextareaProps {
  label: string
  placeholder: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export default function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
  className = '',
}: FormTextareaProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-defendrRed font-medium mb-2 text-sm font-poppins">{label}</label>
      <textarea
        className="bg-defendrLightBlack text-white rounded-lg px-4 py-3 border border-defendrGrey focus:border-defendrRed outline-none placeholder-defendrGrey resize-none font-poppins transition-colors"
        placeholder={placeholder}
        rows={9}
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />
    </div>
  )
}
