import React from 'react'

interface Props {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}

export default function customCheckBox({ id, label, checked, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input checked={checked} className="sr-only" id={id} type="checkbox" onChange={onChange} />
        <div
          className={`w-4 h-4 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
            checked
              ? 'bg-defendrRed border-defendrRed'
              : 'bg-transparent border-defendrGrey hover:border-defendrRed'
          }`}
          onClick={onChange}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                fillRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <label className="text-white text-sm font-poppins cursor-pointer" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}
