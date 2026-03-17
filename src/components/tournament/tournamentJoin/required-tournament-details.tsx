'use client'
import { useSession } from 'next-auth/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import './modal-section-styles.css'
import Button from '@/components/ui/Button'
import { getUserById } from '@/services/userService'
import { playerConfirmAcceptInvitation } from '@/services/joinTournamentService'
import Link from 'next/link'

const tournamentDetailsSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  discordUsername: z
    .string()
    .min(1, 'Discord username is required')
    .min(2, 'Discord username must be at least 2 characters')
    .max(32, 'Discord username must be less than 32 characters'),
  year: z
    .string()
    .min(1, 'Year is required')
    .refine(val => {
      const year = parseInt(val)
      const currentYear = new Date().getFullYear()
      return year >= currentYear - 100 && year <= currentYear - 13
    }, 'You must be at least 13 years old'),
  month: z
    .string()
    .min(1, 'Month is required')
    .refine(val => {
      const month = parseInt(val)
      return month >= 1 && month <= 12
    }, 'Invalid month'),
  day: z
    .string()
    .min(1, 'Day is required')
    .refine(val => {
      const day = parseInt(val)
      return day >= 1 && day <= 31
    }, 'Invalid day'),
  rulesConfirmed: z.boolean().refine(val => val === true, 'You must confirm the rules'),
})

type TournamentDetailsForm = z.infer<typeof tournamentDetailsSchema>

const RequiredTournamentDetails = ({
  participantId,
  setIsOpen,
}: {
  participantId: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { data: session } = useSession()
  const [fullName, setFullName] = useState('')
  const [discordUsername, setDiscordUsername] = useState('')
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [rulesConfirmed, setRulesConfirmed] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof TournamentDetailsForm, string>>>({})
  const [confirmed, setConfirmed] = useState(false)
  const [tournamentId, setTournamentId] = useState<string | null>(null)

  const validateField = (field: keyof TournamentDetailsForm, value: string | boolean) => {
    try {
      tournamentDetailsSchema.shape[field].parse(value)
      setErrors(prev => ({ ...prev, [field]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.issues[0]?.message }))
      }
    }
  }

  const validateForm = () => {
    try {
      tournamentDetailsSchema.parse({
        fullName,
        discordUsername,
        year,
        month,
        day,
        rulesConfirmed,
      })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof TournamentDetailsForm, string>> = {}
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof TournamentDetailsForm] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    if (!session?.user?._id) {
      toast.error('You must be logged in to confirm participation')
      return
    }

    setIsLoading(true)

    try {
      // Format date of birth as YYYY-MM-DD
      const dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

      const response = await playerConfirmAcceptInvitation(
        session.user._id,
        participantId,
        fullName,
        dob,
        discordUsername,
      )

      toast.success(response.message || 'Invitation confirmed successfully!')
      setConfirmed(true)
      setTournamentId(response.tournamentId || null)

      // You might want to close the modal or redirect here
      // For example: onSuccess?.()
    } catch (error: any) {
      console.error('Failed to confirm invitation:', error)
      toast.error(error?.message || 'Failed to confirm invitation')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?._id) {
        setIsLoading(false)
        return
      }

      try {
        const userData = await getUserById(session.user._id)

        console.log(userData)
        // Set full name if available
        if (userData.fullname) {
          setFullName(userData.fullname)
        }

        // Set discord username if available
        if (userData.discordId) {
          setDiscordUsername(userData.discordId)
        }

        // Set date of birth if available
        if (userData.datenaiss) {
          const date = new Date(userData.datenaiss)
          setYear(date.getFullYear().toString())
          setMonth((date.getMonth() + 1).toString())
          setDay(date.getDate().toString())
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [session?.user?._id])

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center w-full pb-8">
        {confirmed ? (
          <>
            <h5 className="text-3xl leading-12 font-bold flex items-center gap-2">
              <span className="size-4 rounded-full bg-green-400 block" />
              You're in!
            </h5>
            <p className="text-sm text-defendrGhostGrey mb-12 text-center">
              You've already joined this tournament.
              <br />
              Stay tuned for match updates and schedules.
            </p>
            <Link
              href={tournamentId ? `/tournament/${tournamentId}` : '/'}
              onClick={() => setIsOpen(false)}
            >
              <button
                type="button"
                className="px-8 py-2 rounded-xl border-2 border-defendrRed text-defendrRed font-medium cursor-pointer"
              >
                Check schedule
              </button>
            </Link>
          </>
        ) : (
          <>
            <h5 className="text-3xl leading-12 font-bold">Required tournament details</h5>
            <p className="text-sm text-defendrGhostGrey mb-12 text-center">
              To confirm your spot, please fill out the required
              <br />
              tournament details.
            </p>
            <form className="w-full max-w-100 space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  placeholder="Enter your fullname"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  onBlur={() => validateField('fullName', fullName)}
                  disabled={isLoading}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>
                )}
              </div>
              <div>
                <label htmlFor="dob">Date Of Birth</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      onBlur={() => validateField('year', year)}
                      disabled={isLoading}
                      className={errors.year ? 'border-red-500' : ''}
                    >
                      <option value="">Year</option>
                      {Array(30)
                        .fill(null)
                        .map((_, i) => new Date().getFullYear() + 1 - 18 - i)
                        .reverse()
                        .map(year => (
                          <option value={year} key={year}>
                            {year}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <select
                      value={month}
                      onChange={e => setMonth(e.target.value)}
                      onBlur={() => validateField('month', month)}
                      disabled={isLoading}
                      className={errors.month ? 'border-red-500' : ''}
                    >
                      <option value="">Month</option>
                      {Array(12)
                        .fill(null)
                        .map((_, month) => (
                          <option value={month + 1} key={month}>
                            {month + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <select
                      value={day}
                      onChange={e => setDay(e.target.value)}
                      onBlur={() => validateField('day', day)}
                      disabled={isLoading}
                      className={errors.day ? 'border-red-500' : ''}
                    >
                      <option value="">Day</option>
                      {Array(31)
                        .fill(null)
                        .map((_, day) => (
                          <option value={day + 1} key={day}>
                            {day + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                {(errors.year || errors.month || errors.day) && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.year || errors.month || errors.day}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="discordUsername">Discord user name</label>
                <input
                  type="text"
                  name="discordUsername"
                  id="discordUsername"
                  placeholder="Enter your discord user name"
                  value={discordUsername}
                  onChange={e => setDiscordUsername(e.target.value)}
                  onBlur={() => validateField('discordUsername', discordUsername)}
                  disabled={isLoading}
                  className={errors.discordUsername ? 'border-red-500' : ''}
                />
                {errors.discordUsername && (
                  <span className="text-red-500 text-xs mt-1">{errors.discordUsername}</span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center shrink-0 gap-2 select-none">
                  <input
                    type="checkbox"
                    id="confirm"
                    className="w-5 h-5 accent-defendrRed bg-transparent border-defendrRed rounded cursor-pointer"
                    checked={rulesConfirmed}
                    onChange={e => {
                      setRulesConfirmed(e.target.checked)
                      validateField('rulesConfirmed', e.target.checked)
                    }}
                  />
                  <label htmlFor="confirm">I've read the rules — I'm ready to play fair!</label>
                </div>
                {errors.rulesConfirmed && (
                  <span className="text-red-500 text-xs mt-1">{errors.rulesConfirmed}</span>
                )}
              </div>
              <Button
                label="Confirm Participation"
                className="mt-14"
                disabled={isLoading}
                type="submit"
              />
            </form>
          </>
        )}
      </div>
    </>
  )
}

export default RequiredTournamentDetails
