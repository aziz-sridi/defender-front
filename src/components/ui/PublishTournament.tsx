import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import CustomToggleSwitch from '@/components/ui/CustomToggleSwitch'
import { updateTournament, getTournamentById } from '@/services/tournamentService'
import { generateBrackets } from '@/services/bracketService'

interface PublishTournamentProps {
  className?: string
}

const PublishTournament: React.FC<PublishTournamentProps> = ({ className = '' }) => {
  const router = useRouter()
  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [tournamentId, setTournamentId] = useState<string | null>(null)

  // Independent loading flags to avoid cross-triggered UI changes
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  // Local updating flags (kept for potential UI disabled state if needed)
  const [isUpdatingRegistration, setIsUpdatingRegistration] = useState(false)
  const [isUpdatingCheckIn, setIsUpdatingCheckIn] = useState(false)

  const [completionStatus, setCompletionStatus] = useState({
    brackets: false,
    schedule: false,
    published: false,
    registrationCheckin: false,
    seeded: false,
    finished: false,
  })

  // Keep a local bracket type if needed; fallback to SINGLE_ELIMINATION
  const [bracketType, setBracketType] = useState<
    'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'FREE_FOR_ALL' | 'SWISS'
  >('SINGLE_ELIMINATION')

  useEffect(() => {
    const loadTournamentData = async () => {
      try {
        const storedTournamentId = localStorage.getItem('createdTournamentId')
        setTournamentId(storedTournamentId)

        if (storedTournamentId) {
          const tournament = await getTournamentById(storedTournamentId)

          if (tournament.tournamentFormat) {
            setRegistrationOpen(tournament.tournamentFormat.registrationOpen || false)
            setCheckInOpen(tournament.tournamentFormat.checkInEnabled || false)
          }

          const bracketSaved = localStorage.getItem('bracketSavedToDatabase') === 'true'
          const scheduleSaved = localStorage.getItem('scheduleSavedToDatabase') === 'true'

          setCompletionStatus({
            brackets: bracketSaved,
            schedule: scheduleSaved,
            published: tournament.publishing || false,
            registrationCheckin:
              (tournament.tournamentFormat?.registrationOpen &&
                tournament.tournamentFormat?.checkInEnabled) ||
              false,
            seeded: tournament.seeded || false,
            finished: tournament.finished || false,
          })

          if (tournament.BracketType) {
            setBracketType(tournament.BracketType)
          }
        }
      } catch {
        // noop: errors are surfaced via toasts in individual actions
      }
    }

    loadTournamentData()

    const handleStorageChange = () => {
      loadTournamentData()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handlePublishTournament = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    if (!tournamentId) {
      toast.error('No tournament ID found')
      return
    }

    try {
      setIsPublishing(true)

      const formData = new FormData()
      formData.append('publishing', 'true')

      await updateTournament(tournamentId, formData)

      setCompletionStatus(prev => ({ ...prev, published: true }))

      toast.success('Tournament published successfully!')
    } catch {
      // noop: surfaced by toast
      toast.error('Failed to publish tournament. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleRegistrationToggle = async (checked: boolean) => {
    if (!tournamentId) {
      return
    }

    try {
      setIsUpdatingRegistration(true)

      const formData = new FormData()

      formData.append('registrationOpen', checked.toString())
      formData.append('checkInEnabled', checkInOpen.toString())

      await updateTournament(tournamentId, formData)

      setRegistrationOpen(checked)

      const bothEnabled = checked && checkInOpen
      setCompletionStatus(prev => ({ ...prev, registrationCheckin: bothEnabled }))
    } catch {
      // noop: surfaced by toast
      toast.error('Failed to update registration status')
    } finally {
      setIsUpdatingRegistration(false)
    }
  }

  const handleCheckInToggle = async (checked: boolean) => {
    if (!tournamentId) {
      return
    }

    try {
      setIsUpdatingCheckIn(true)

      const formData = new FormData()

      formData.append('registrationOpen', registrationOpen.toString())
      formData.append('checkInEnabled', checked.toString())

      await updateTournament(tournamentId, formData)

      setCheckInOpen(checked)

      const bothEnabled = registrationOpen && checked
      setCompletionStatus(prev => ({ ...prev, registrationCheckin: bothEnabled }))
    } catch {
      // noop: surfaced by toast
      toast.error('Failed to update check-in status')
    } finally {
      setIsUpdatingCheckIn(false)
    }
  }

  const handleSeedBracket = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    if (!tournamentId) {
      toast.error('No tournament ID found')
      return
    }

    try {
      setIsSeeding(true)

      // Generate brackets via backend; bracketType derives from tournament or fallback
      await generateBrackets(tournamentId, bracketType)

      // Mark as seeded in UI (optionally this could be part of tournament update response)
      setCompletionStatus(prev => ({ ...prev, seeded: true }))

      toast.success('Bracket generated successfully!')

      router.push(`/tournament/setup/bracketView?tid=${tournamentId}`)
    } catch {
      // noop: surfaced by toast
      toast.error('Failed to generate bracket. Please try again.')
    } finally {
      setIsSeeding(false)
    }
  }

  const handleSetScore = () => {
    router.push('/tournament/setup/matchList')
  }

  const handleEndTournament = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    if (!tournamentId) {
      toast.error('No tournament ID found')
      return
    }

    try {
      setIsEnding(true)

      const formData = new FormData()
      formData.append('finished', 'true')

      await updateTournament(tournamentId, formData)

      setCompletionStatus(prev => ({ ...prev, finished: true }))

      toast.success('Tournament ended successfully!')
    } catch {
      toast.error('Failed to end tournament. Please try again.')
    } finally {
      setIsEnding(false)
    }
  }

  return (
    <div className={`bg-defendrBg text-white p-6 ${className}`}>
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              completionStatus.published ? 'bg-green-500' : 'bg-orange-500'
            }`}
          >
            {completionStatus.published ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            ) : (
              <span className="text-black font-poppins text-xl font-bold">1</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-white text-2xl font-poppins mb-3">Publish Tournament</h2>
            <p className="text-defendrLightGrey text-sm font-poppins leading-relaxed mb-4">
              This step in the tournament setup process signifies that the tournament is ready to go
              and that players can start the registration process. Make sure that all the necessary
              settings for the tournament and bracket are ready.
            </p>

            <div className="space-y-2 mb-6">
              {!completionStatus.brackets && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-yellow-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="text-yellow-500 text-sm font-poppins">
                    Missing Setting the brackets
                  </span>
                </div>
              )}
              {!completionStatus.schedule && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-500 text-sm font-poppins">
                    Missing Setting the Schedule of the tournament
                  </span>
                </div>
              )}
            </div>

            <Button
              className="font-poppins"
              disabled={isPublishing || completionStatus.published}
              label={isPublishing ? 'Publishing...' : 'Publish tournament'}
              size="s"
              type="button"
              variant="contained-blue"
              onClick={handlePublishTournament}
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              completionStatus.registrationCheckin ? 'bg-green-500' : 'bg-defendrGrey'
            }`}
          >
            {completionStatus.registrationCheckin ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            ) : (
              <span className="text-white font-poppins text-xl font-bold">2</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-white text-2xl font-poppins mb-6">
              Registration & Check in participants
            </h2>

            <div
              className={`mb-6 ${isUpdatingRegistration ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <div className="flex items-center gap-4 mb-2">
                <CustomToggleSwitch
                  checked={registrationOpen}
                  label=""
                  onChange={handleRegistrationToggle}
                />
                <span className="text-white font-poppins text-lg">Registration</span>
              </div>
              <p className="text-defendrLightGrey text-sm font-poppins mb-2">
                Open / Close Registration to this tournament .
              </p>
              <p className="text-red-500 text-sm font-poppins">
                Note it can be auto when you make the schedule part
              </p>
            </div>

            <div className={`mb-6 ${isUpdatingCheckIn ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-4 mb-2">
                <CustomToggleSwitch checked={checkInOpen} label="" onChange={handleCheckInToggle} />
                <span className="text-white font-poppins text-lg">Check In</span>
              </div>
              <p className="text-defendrLightGrey text-sm font-poppins mb-2">
                Once check in is open, only players who check's in prior to the tournament start
                date will be considered inside the bracket
              </p>
              <p className="text-red-500 text-sm font-poppins">
                Note it can be auto when you make the schedule part
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              completionStatus.seeded ? 'bg-green-500' : 'bg-defendrGrey'
            }`}
          >
            {completionStatus.seeded ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            ) : (
              <span className="text-white font-poppins text-xl font-bold">3</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-white text-2xl font-poppins mb-4">st Stage</h2>
            <p className="text-defendrLightGrey text-sm font-poppins leading-relaxed mb-6">
              Organizers can seed participants into a bracket manually or automatically, and publish
              it for participants to view their matches and opponents.
            </p>

            <div className="flex gap-4">
              <Button
                className="font-poppins"
                disabled={isSeeding || completionStatus.seeded}
                label={isSeeding ? 'Seeding...' : 'Seed bracket'}
                size="s"
                type="button"
                variant="contained-red"
                onClick={handleSeedBracket}
              />
              <Button
                className="font-poppins"
                label="Set Score"
                size="s"
                type="button"
                variant="contained-blue"
                onClick={handleSetScore}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              completionStatus.finished ? 'bg-green-500' : 'bg-defendrGrey'
            }`}
          >
            {completionStatus.finished ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            ) : (
              <span className="text-white font-poppins text-xl font-bold">4</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-white text-2xl font-poppins mb-4">Finish Tournament</h2>
            <p className="text-defendrLightGrey text-sm font-poppins leading-relaxed mb-6">
              Once the tournament is completed, the admin can finish the tournament and add the
              winners .
            </p>

            <Button
              className="font-poppins"
              disabled={isEnding || completionStatus.finished}
              label={isEnding ? 'Ending...' : 'End tournament'}
              size="s"
              type="button"
              variant="contained-blue"
              onClick={handleEndTournament}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublishTournament
