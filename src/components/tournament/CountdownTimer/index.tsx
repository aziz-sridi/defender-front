'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  dateTarget: string
  isClosed?: boolean
  /** Optional explicit registration end date for the footer text */
  registrationEndDate?: string
}

const CountdownTimer = ({
  dateTarget,
  isClosed = false,
  registrationEndDate,
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const targetDate = new Date(dateTarget).getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [dateTarget])

  const hasTournamentStarted = new Date(dateTarget) < new Date()

  if (isClosed || hasTournamentStarted) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-2 text-3xl lg:text-5xl font-extralight [&_span]:text-defendrRed [&_p]:text-defendrSilver text-shadow-lg">
      <p>{fixNumberWithLeadingZero(timeLeft.days)}</p>
      <span>:</span>
      <p>{fixNumberWithLeadingZero(timeLeft.hours)}</p>
      <span>:</span>
      <p>{fixNumberWithLeadingZero(timeLeft.minutes)}</p>
      <span>:</span>
      <p>{fixNumberWithLeadingZero(timeLeft.seconds)}</p>
    </div>
  )
}

const fixNumberWithLeadingZero = (num: number, numberLength = 2) => {
  const currentNumberLength = num.toString().length
  const zeros = Array(numberLength > currentNumberLength ? numberLength - currentNumberLength : 0)
    .fill('0')
    .join('')
  return num < 10 ? `${zeros}${num}` : num.toString()
}

export default CountdownTimer
