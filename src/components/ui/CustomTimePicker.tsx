'use client'

import React, { useState, useRef, useEffect } from 'react'

interface CustomTimePickerProps {
  label: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export default function CustomTimePicker({
  label,
  value,
  onChange,
  className = '',
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState(value || '19:00')
  const [selectedHour, setSelectedHour] = useState(value ? parseInt(value.split(':')[0]) : 19)
  const [selectedMinute, setSelectedMinute] = useState(value ? parseInt(value.split(':')[1]) : 0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (value) {
      setSelectedTime(value)
      const [hour, minute] = value.split(':').map(Number)
      setSelectedHour(hour)
      setSelectedMinute(minute)
    }
  }, [value])

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  const handleTimeSelect = (hour: number, minute: number) => {
    const timeString = formatTime(hour, minute)
    setSelectedTime(timeString)
    setSelectedHour(hour)
    setSelectedMinute(minute)
    onChange?.(timeString)
  }

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour)
    handleTimeSelect(hour, selectedMinute)
  }

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute)
    handleTimeSelect(selectedHour, minute)
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i).filter(m => m % 5 === 0)

  return (
    <div ref={dropdownRef} className={`flex flex-col relative ${className}`}>
      <label className="text-defendrRed font-medium mb-2 text-sm font-poppins">{label}</label>

      <div
        className="bg-defendrLightBlack text-white rounded-lg px-4 py-3 border border-defendrGrey focus:border-defendrRed outline-none placeholder-defendrGrey font-poppins transition-colors cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white">{selectedTime}</span>
        <svg className="w-5 h-5 text-defendrRed" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            fillRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-defendrLightBlack border border-defendrGrey rounded-lg shadow-lg z-50 p-4">
          <div className="flex gap-4">
            {/* Hours */}
            <div className="flex-1">
              <div className="text-white font-poppins font-medium mb-2 text-center">Hours</div>
              <div className="max-h-40 overflow-y-auto">
                <div className="grid grid-cols-4 gap-1">
                  {hours.map(hour => (
                    <button
                      key={hour}
                      className={`
                        h-8 text-sm font-poppins rounded transition-colors
                        ${
                          selectedHour === hour
                            ? 'bg-defendrRed text-white'
                            : 'text-white hover:bg-defendrRed hover:text-white'
                        }
                      `}
                      onClick={() => handleHourSelect(hour)}
                    >
                      {hour.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Minutes */}
            <div className="flex-1">
              <div className="text-white font-poppins font-medium mb-2 text-center">Minutes</div>
              <div className="max-h-40 overflow-y-auto">
                <div className="grid grid-cols-3 gap-1">
                  {minutes.map(minute => (
                    <button
                      key={minute}
                      className={`
                        h-8 text-sm font-poppins rounded transition-colors
                        ${
                          selectedMinute === minute
                            ? 'bg-defendrRed text-white'
                            : 'text-white hover:bg-defendrRed hover:text-white'
                        }
                      `}
                      onClick={() => handleMinuteSelect(minute)}
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-4 flex justify-end">
            <button
              className="bg-defendrRed hover:bg-defendrRed/80 text-white px-4 py-2 rounded-lg font-poppins text-sm transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
