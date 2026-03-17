import React from 'react'

interface Props {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export default function CustomToggleSwitch({ label, checked, onChange, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-white font-medium text-sm font-poppins">{label}</span>
      <button
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? 'bg-defendrRed' : 'bg-defendrGrey'
        }`}
        type="button"
        onClick={() => onChange(!checked)}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
