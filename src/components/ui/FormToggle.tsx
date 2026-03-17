import React from 'react'

interface FormToggleProps {
  label: string
  description?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export default function FormToggle({
  label,
  description,
  checked = false,
  onChange,
  className = '',
}: FormToggleProps) {
  return (
    <div className={`p-4 border border-defendrGrey rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-white font-medium text-xs font-poppins mb-1">{label}</h4>
          {description && <p className="text-defendrGrey text-xs font-poppins">{description}</p>}
        </div>
        <button
          className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors border ${
            checked ? 'bg-defendrRed border-defendrRed' : 'bg-transparent border-defendrGrey'
          }`}
          onClick={() => onChange?.(!checked)}
        >
          <span
            className={`inline-block h-2.5 w-2.5 transform rounded-full transition-transform ${
              checked ? 'translate-x-4 bg-white' : 'translate-x-0.5 bg-defendrGrey'
            }`}
          />
        </button>
      </div>
    </div>
  )
}
