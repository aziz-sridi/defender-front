'use client'

import * as React from 'react'

const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ className = '', ...props }, ref) => (
    <label
      className={['relative inline-flex items-center justify-center cursor-pointer', className]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        ref={ref}
        className={[
          'peer h-5 w-5 shrink-0 rounded border border-defendrRed appearance-none transition-colors duration-200 bg-white checked:bg-[#D62555] checked:border-[#D62555] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        type="checkbox"
        onChange={props.onChange || (() => {})}
        {...props}
      />
      <span className="pointer-events-none absolute w-5 h-5 flex items-center justify-center">
        <svg
          className="hidden peer-checked:block text-white"
          fill="none"
          height="16"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 8.5L7 11.5L12 6.5"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </span>
    </label>
  ),
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
