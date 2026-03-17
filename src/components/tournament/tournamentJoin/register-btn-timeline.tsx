'use client'
import { ArrowUpRight } from 'lucide-react'

const TimeLineRegisterbtn = ({ disabled = false }: { disabled: boolean }) => {
  const handleClick = () => {
    const element = document.getElementById('join-tournament-btn')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      element.click()
    }
  }

  return (
    <button
      type="button"
      onClick={!disabled ? handleClick : undefined}
      disabled={disabled}
      className="px-4 md:px-12 py-2 rounded-xl bg-defendrRed text-white font-semibold flex items-center justify-center gap-2 max-md:w-full md:ml-14 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {disabled ? (
        'Registration Closed'
      ) : (
        <>
          Register Now
          <ArrowUpRight />
        </>
      )}
    </button>
  )
}

export default TimeLineRegisterbtn
