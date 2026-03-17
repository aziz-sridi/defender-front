'use client'

import React, { useState, useRef, useEffect } from 'react'

interface CustomDatePickerProps {
  label: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export default function CustomDatePicker({
  label,
  value,
  onChange,
  className = '',
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value || '')
  const [currentMonth, setCurrentMonth] = useState(new Date())
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

  // Keep internal state in sync with external value
  useEffect(() => {
    if (value) {
      setSelectedDate(value)
    }
  }, [value])

  const toYYYYMMDD = (year: number, monthIndex: number, day: number) => {
    const mm = String(monthIndex + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) {
      return ''
    }
    // Parse YYYY-MM-DD in local time instead of UTC to avoid off-by-one issues
    const [y, m, d] = dateStr.split('-').map(Number)
    const date = new Date(y, (m || 1) - 1, d || 1)
    return date.toLocaleDateString('en-GB')
  }

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    // Build YYYY-MM-DD in local time without converting to UTC
    const dateString = toYYYYMMDD(year, month, day)
    setSelectedDate(dateString)
    onChange?.(dateString)
    setIsOpen(false)
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const isSelectedDay = (day: number) => {
    if (!selectedDate || !day) {
      return false
    }
    const selected = new Date(selectedDate)
    const current = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return selected.toDateString() === current.toDateString()
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div ref={dropdownRef} className={`flex flex-col relative ${className}`}>
      <label className="text-defendrRed font-medium mb-2 text-sm font-poppins">{label}</label>

      <div
        className="bg-defendrLightBlack text-white rounded-lg px-4 py-3 border border-defendrGrey focus:border-defendrRed outline-none placeholder-defendrGrey font-poppins transition-colors cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedDate ? 'text-white' : 'text-defendrGrey'}>
          {selectedDate ? formatDate(selectedDate) : 'DD/MM/YYYY'}
        </span>
        <svg className="w-5 h-5 text-defendrRed" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            fillRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-defendrLightBlack border border-defendrGrey rounded-lg shadow-lg z-50 p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              className="text-white hover:text-defendrRed transition-colors"
              onClick={() => navigateMonth('prev')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            </button>

            <span className="text-white font-poppins font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>

            <button
              className="text-white hover:text-defendrRed transition-colors"
              onClick={() => navigateMonth('next')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs text-defendrGrey font-poppins py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((day, index) => (
              <button
                key={index}
                className={`
                  h-8 w-8 text-sm font-poppins rounded transition-colors
                  ${!day ? 'invisible' : ''}
                  ${
                    day && isSelectedDay(day)
                      ? 'bg-defendrRed text-white'
                      : 'text-white hover:bg-defendrRed hover:text-white'
                  }
                `}
                disabled={!day}
                onClick={() => day && handleDateSelect(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
