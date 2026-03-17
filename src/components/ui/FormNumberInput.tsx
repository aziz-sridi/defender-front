import React from 'react'

interface FormNumberInputProps {
  label: string
  placeholder: string
  value?: number
  onChange?: (value: number) => void
  description?: string
  className?: string
}

export default function FormNumberInput({
  label,
  placeholder,
  value,
  onChange,
  description,
  className = '',
}: FormNumberInputProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-white font-medium mb-2 text-xs font-poppins">{label}</label>
      <input
        className="bg-defendrLightBlack text-white rounded-xl px-3 py-2 border border-defendrGrey focus:border-defendrRed outline-none placeholder-defendrGrey font-poppins text-sm transition-colors"
        placeholder={placeholder}
        type="number"
        value={typeof value === 'number' ? value : ''}
        onChange={e => onChange?.(parseInt(e.target.value) || 0)}
      />
      {description && <p className="text-defendrGrey text-xs mt-1 font-poppins">{description}</p>}
    </div>
  )
}
