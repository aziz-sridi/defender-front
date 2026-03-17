'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import CustomDatePicker from '@/components/ui/CustomDatePicker'
import CustomTimePicker from '@/components/ui/CustomTimePicker'
import { updateTournament } from '@/services/tournamentService'
import {
  getCurrentTournamentId,
  readSessionDraft,
  writeSessionDraft,
  readInfo,
  writeInfo,
  markSaved,
} from '@/lib/storage/tournamentStorage'

interface Stage {
  id: string
  stageName: string
  dateTime: string
}

export default function TournamentSchedulePage() {
  const router = useRouter()
  const { data: session } = useSession()
  type ScheduleForm = {
    isEnabled: boolean
    registrationStartDate: string
    registrationStartTime: string
    registrationEndDate: string
    registrationEndTime: string
    tournamentStartDate: string
    tournamentStartTime: string
    tournamentEndDate: string
    tournamentEndTime: string
    checkinTime: string
    stages: Stage[]
    timeZone: string
  }

  const { watch, reset, setValue, handleSubmit, getValues } = useForm<ScheduleForm>({
    defaultValues: {
      isEnabled: true,
      registrationStartDate: '',
      registrationStartTime: '',
      registrationEndDate: '',
      registrationEndTime: '',
      tournamentStartDate: '',
      tournamentStartTime: '',
      tournamentEndDate: '',
      tournamentEndTime: '',
      checkinTime: '',
      stages: [{ id: '1', stageName: '', dateTime: '' }],
      timeZone: 'UTC (Coordinated Universal time)',
    },
  })

  const formValues = watch()
  const isEnabled = watch('isEnabled')
  const registrationStartDate = watch('registrationStartDate')
  const registrationStartTime = watch('registrationStartTime')
  const registrationEndDate = watch('registrationEndDate')
  const registrationEndTime = watch('registrationEndTime')
  const tournamentStartDate = watch('tournamentStartDate')
  const tournamentStartTime = watch('tournamentStartTime')
  const tournamentEndDate = watch('tournamentEndDate')
  const tournamentEndTime = watch('tournamentEndTime')
  const checkinTime = watch('checkinTime')
  const stages = watch('stages')
  const timeZone = watch('timeZone')

  const [isSubmitting, setIsSubmitting] = useState(false)

  // tournament id is read on submit from localStorage

  useEffect(() => {
    const loadSavedData = () => {
      try {
        const tid = getCurrentTournamentId()
        // Prefer per-tab draft first
        const draft = readSessionDraft<Partial<ScheduleForm>>('scheduleDraft', tid)
        let scheduleData: Partial<ScheduleForm> | null = draft
        // fallback from namespaced/local legacy tournamentInfo.schedule
        if (!scheduleData) {
          const info = readInfo<{ schedule?: Partial<ScheduleForm> } | Record<string, unknown>>(tid)
          if (info && 'schedule' in info && typeof info.schedule === 'object') {
            scheduleData = info.schedule as Partial<ScheduleForm>
          }
        }

        if (scheduleData) {
          reset({
            isEnabled: scheduleData.isEnabled ?? true,
            registrationStartDate: scheduleData.registrationStartDate || '',
            registrationStartTime: scheduleData.registrationStartTime || '',
            registrationEndDate: scheduleData.registrationEndDate || '',
            registrationEndTime: scheduleData.registrationEndTime || '',
            tournamentStartDate: scheduleData.tournamentStartDate || '',
            tournamentStartTime: scheduleData.tournamentStartTime || '',
            tournamentEndDate: scheduleData.tournamentEndDate || '',
            tournamentEndTime: scheduleData.tournamentEndTime || '',
            checkinTime: scheduleData.checkinTime || '',
            stages: scheduleData.stages || [{ id: '1', stageName: '', dateTime: '' }],
            timeZone: scheduleData.timeZone || 'UTC (Coordinated Universal time)',
          })
        }
      } catch {
        // ignore
      }
    }

    loadSavedData()
    const timeout = setTimeout(loadSavedData, 100)
    return () => clearTimeout(timeout)
  }, [reset])

  // Hydrate from backend if schedule already exists so sidebar warning disappears
  useEffect(() => {
    const hydrateFromServer = async () => {
      try {
        const tid = getCurrentTournamentId()
        if (!tid) {
          return
        }
        const { getTournamentById } = await import('@/services/tournamentService')
        const data: unknown = await getTournamentById(tid)
        if (!data || typeof data !== 'object') {
          return
        }
        const obj = data as Record<string, unknown>
        // Prefer nested schedule if provided
        // Normalize possible schedule sources: legacy schedule object OR structureProcess
        const structureProcess =
          obj.structureProcess && typeof obj.structureProcess === 'object'
            ? (obj.structureProcess as Record<string, unknown>)
            : undefined
        const schedSrc =
          (obj.schedule && typeof obj.schedule === 'object'
            ? (obj.schedule as Record<string, unknown>)
            : undefined) ||
          structureProcess ||
          obj
        // Determine if we truly have a schedule (at least one meaningful field)
        const meaningfulKeys = [
          // legacy / flat
          'registrationStartDate',
          'registrationStartTime',
          'registrationEndDate',
          'registrationEndTime',
          'tournamentStartDate',
          'tournamentStartTime',
          'tournamentEndDate',
          'tournamentEndTime',
          'checkinTime',
          'timezone',
          'stages',
          // structureProcess canonical fields
          'signUpOpening',
          'signUpClosing',
          'checkInPeriod',
        ] as const
        const hasMeaningful = meaningfulKeys.some(k => {
          const v = schedSrc[k]
          if (k === 'stages') {
            return Array.isArray(v) && v.length > 0
          }
          return typeof v === 'string' ? v.trim().length > 0 : Boolean(v)
        })
        if (!hasMeaningful) {
          return
        }
        const bool = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback)
        const str = (v: unknown) => (typeof v === 'string' ? v : '')
        const arr = (v: unknown) => (Array.isArray(v) ? v : [])
        // Mapping: structureProcess.signUpOpening -> registrationStartDate/Time etc.
        const toDatePart = (iso: string) => {
          if (!iso || typeof iso !== 'string') {
            return ''
          }
          // Accept both pure date and full ISO; always return YYYY-MM-DD
          const core = iso.includes('T') ? iso.split('T')[0] : iso
          // Basic validation: must look like YYYY-MM-DD
          if (/^\d{4}-\d{2}-\d{2}$/.test(core)) {
            return core
          }
          // Fallback: try to parse and reformat
          const d = new Date(iso)
          if (!isNaN(d.getTime())) {
            const y = d.getUTCFullYear()
            const m = String(d.getUTCMonth() + 1).padStart(2, '0')
            const day = String(d.getUTCDate()).padStart(2, '0')
            return `${y}-${m}-${day}`
          }
          return ''
        }
        const toTimePart = (iso: string) =>
          iso && iso.includes('T') ? iso.split('T')[1].slice(0, 5) : ''
        const signUpOpening = str((structureProcess?.signUpOpening as string) || '')
        const signUpClosing = str((structureProcess?.signUpClosing as string) || '')
        const checkInPeriod = str((structureProcess?.checkInPeriod as string) || '')
        reset({
          isEnabled: bool(schedSrc.scheduleEnabled, bool(schedSrc.isEnabled, true)),
          registrationStartDate:
            toDatePart(str(schedSrc.registrationStartDate)) || toDatePart(signUpOpening),
          registrationStartTime: str(schedSrc.registrationStartTime) || toTimePart(signUpOpening),
          registrationEndDate:
            toDatePart(str(schedSrc.registrationEndDate)) || toDatePart(signUpClosing),
          registrationEndTime: str(schedSrc.registrationEndTime) || toTimePart(signUpClosing),
          // TEMP: Using signUpOpening as fallback for tournament start until separate tournament start fields are finalized.
          // TODO: Remove fallback to signUpOpening once backend provides distinct tournamentStartDate/Time.
          tournamentStartDate:
            toDatePart(str(schedSrc.tournamentStartDate)) || toDatePart(signUpOpening),
          // NOTE: Intentionally NOT falling back to signUpOpening for time to avoid copying registration start time.
          tournamentStartTime: str(schedSrc.tournamentStartTime),
          tournamentEndDate:
            toDatePart(str(schedSrc.tournamentEndDate)) || toDatePart(checkInPeriod),
          tournamentEndTime: str(schedSrc.tournamentEndTime) || toTimePart(checkInPeriod),
          checkinTime: str(schedSrc.checkinTime) || str(schedSrc.checkInTime),
          stages:
            arr(schedSrc.stages).length > 0
              ? (arr(schedSrc.stages) as Stage[])
              : [{ id: '1', stageName: '', dateTime: '' }],
          timeZone:
            str(schedSrc.timeZone) || str(schedSrc.timezone) || 'UTC (Coordinated Universal time)',
        })
        // Mark as saved for sidebar (only once)
        if (typeof window !== 'undefined') {
          if (localStorage.getItem('scheduleSavedToDatabase') !== 'true') {
            markSaved('scheduleSavedFlag', tid)
            localStorage.setItem('scheduleSavedToDatabase', 'true')
            window.dispatchEvent(
              new CustomEvent('defendr-setup-progress', {
                detail: { step: 'schedule', done: true },
              }),
            )
          }
        }
      } catch {
        // silent
      }
    }
    void hydrateFromServer()
  }, [reset])

  useEffect(() => {
    try {
      const tid = getCurrentTournamentId()
      writeSessionDraft('scheduleDraft', formValues, tid)
    } catch {}
  }, [formValues])

  const saveScheduleToLocalStorage = useCallback(() => {
    const scheduleData = getValues()
    const tid = getCurrentTournamentId()
    writeInfo({ schedule: scheduleData }, tid)
  }, [getValues])

  // Remove duplicate tournamentInfo loader (handled in unified reset above)

  useEffect(() => {
    saveScheduleToLocalStorage()
  }, [saveScheduleToLocalStorage])

  const sanitizeDate = (raw: string) => {
    if (!raw) {
      return ''
    }
    // Accept either YYYY-MM-DD or full ISO; always return date part only
    if (raw.includes('T')) {
      return raw.split('T')[0]
    }
    return raw
  }

  // NOTE: UI currently uses native date picker expecting YYYY-MM-DD (already sanitized),
  // so we skip DD/MM/YYYY conversion to avoid mismatch and simplify hydration.

  const sanitizeTime = (raw: string) => {
    if (!raw) {
      return '00:00'
    }
    // Accept HH:mm or HH:mm:ss(.ms) or full ISO
    if (raw.includes('T')) {
      const part = raw.split('T')[1]
      return part.slice(0, 5)
    }
    return raw.slice(0, 5)
  }

  const combineDateTime = (date: string, time: string) => {
    const d = sanitizeDate(date)
    if (!d) {
      return ''
    }
    if (!time || time.trim() === '') {
      return d
    }
    const t = sanitizeTime(time)
    return `${d}T${t}`
  }

  const handleAddAnotherStage = () => {
    const newStage: Stage = { id: Date.now().toString(), stageName: '', dateTime: '' }
    const current = getValues('stages')
    setValue('stages', [...current, newStage])
  }

  const updateStage = (id: string, field: 'stageName' | 'dateTime', value: string) => {
    const current = getValues('stages')
    const updated = current.map(stage => (stage.id === id ? { ...stage, [field]: value } : stage))
    setValue('stages', updated)
  }

  const removeStage = (id: string) => {
    if (stages.length > 1) {
      const current = getValues('stages')
      setValue(
        'stages',
        current.filter(stage => stage.id !== id),
      )
    }
  }

  const handleNext = async (values: ScheduleForm) => {
    if (!session?.accessToken) {
      toast.error('Authentication required. Please log in again.')
      return
    }
    setIsSubmitting(true)
    try {
      const tid = localStorage.getItem('createdTournamentId')
      if (!tid) {
        throw new Error('Missing tournament id')
      }

      // Build a schedule object for backend (in addition to flat fields)
      const scheduleData = {
        ...values,
        registrationStartDateTime: combineDateTime(
          values.registrationStartDate,
          values.registrationStartTime,
        ),
        registrationEndDateTime: combineDateTime(
          values.registrationEndDate,
          values.registrationEndTime,
        ),
        tournamentStartDateTime: combineDateTime(
          values.tournamentStartDate,
          values.tournamentStartTime,
        ),
        tournamentEndDateTime: combineDateTime(values.tournamentEndDate, values.tournamentEndTime),
      }

      // Canonical structureProcess mapping for backend
      const structureProcess = {
        signUpOpening: (() => {
          const dt = combineDateTime(values.registrationStartDate, values.registrationStartTime)
          return dt || undefined
        })(),
        signUpClosing: (() => {
          const dt = combineDateTime(values.registrationEndDate, values.registrationEndTime)
          return dt || undefined
        })(),
        checkInPeriod: (() => {
          const dt = combineDateTime(values.tournamentEndDate, values.tournamentEndTime)
          return dt || undefined
        })(),
        tournamentEndDate: sanitizeDate(values.tournamentEndDate) || undefined,
        registrationStartDate: sanitizeDate(values.registrationStartDate) || undefined,
        registrationEndDate: sanitizeDate(values.registrationEndDate) || undefined,
        checkInTime: values.checkinTime ? sanitizeTime(values.checkinTime) : undefined,
        timezone: values.timeZone || undefined,
        stages: values.stages && values.stages.length > 0 ? values.stages : undefined,
      }

      // Build JSON payload (backend expects object for structureProcess)
      const payload = {
        registrationStartDate: values.registrationStartDate || undefined,
        registrationStartTime: values.registrationStartTime || undefined,
        registrationStartDateTime:
          combineDateTime(values.registrationStartDate, values.registrationStartTime) || undefined,
        registrationEndDate: values.registrationEndDate || undefined,
        registrationEndTime: values.registrationEndTime || undefined,
        registrationEndDateTime:
          combineDateTime(values.registrationEndDate, values.registrationEndTime) || undefined,
        tournamentStartDate: values.tournamentStartDate || undefined,
        tournamentStartTime: values.tournamentStartTime || undefined,
        tournamentStartDateTime:
          combineDateTime(values.tournamentStartDate, values.tournamentStartTime) || undefined,
        tournamentEndDate: values.tournamentEndDate || undefined,
        tournamentEndTime: values.tournamentEndTime || undefined,
        tournamentEndDateTime:
          combineDateTime(values.tournamentEndDate, values.tournamentEndTime) || undefined,
        checkinTime: values.checkinTime || undefined,
        timeZone: values.timeZone || undefined,
        scheduleEnabled: values.isEnabled,
        stages: values.stages || [],
        schedule: scheduleData,
        structureProcess,
      }

      await updateTournament(tid, payload)
      toast.success('Tournament schedule has been saved successfully!')

      const nsTid = getCurrentTournamentId()
      markSaved('scheduleSavedFlag', nsTid)
      localStorage.setItem('scheduleSavedToDatabase', 'true')
      window.dispatchEvent(
        new CustomEvent('defendr-setup-progress', {
          detail: { step: 'schedule', done: true },
        }),
      )
      router.push('/tournament/setup/tournamentLocation')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating tournament schedule:', error)
      if (error instanceof Error) {
        toast.error(`Failed to save schedule: ${error.message}`)
      } else {
        toast.error('Failed to save schedule. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="text-white p-6">
      <div className="mb-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Typo as="h1" color="white" fontFamily="poppins" fontVariant="h3">
              Tournament Schedule
            </Typo>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-defendrRed' : 'bg-defendrGrey'
              }`}
              onClick={() => setValue('isEnabled', !isEnabled)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <Typo as="p" color="white" fontFamily="poppins" fontVariant="p3">
            Set the Schedule for your tournament
          </Typo>
        </div>

        {isEnabled && (
          <div className="space-y-6">
            <div>
              <Typo as="p" className="mb-3" color="white" fontFamily="poppins" fontVariant="p2">
                Registration Start
              </Typo>
              <div className="w-full max-w-xl">
                <div className="flex gap-3">
                  <CustomDatePicker
                    className="flex-1"
                    label=""
                    value={registrationStartDate}
                    onChange={value => setValue('registrationStartDate', value)}
                  />
                  <CustomTimePicker
                    className="w-56"
                    label=""
                    value={registrationStartTime}
                    onChange={value => setValue('registrationStartTime', value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Typo as="p" className="mb-3" color="white" fontFamily="poppins" fontVariant="p2">
                Registration End
              </Typo>
              <div className="w-full max-w-xl">
                <div className="flex gap-3">
                  <CustomDatePicker
                    className="flex-1"
                    label=""
                    value={registrationEndDate}
                    onChange={value => setValue('registrationEndDate', value)}
                  />
                  <CustomTimePicker
                    className="w-56"
                    label=""
                    value={registrationEndTime}
                    onChange={value => setValue('registrationEndTime', value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Typo as="p" className="mb-3" color="white" fontFamily="poppins" fontVariant="p2">
                Check-in time before matches (optional)
              </Typo>
              <div className="w-full max-w-xl">
                <CustomTimePicker
                  className="w-56"
                  label=""
                  value={checkinTime}
                  onChange={value => setValue('checkinTime', value)}
                />
              </div>
            </div>

            <div>
              <Typo as="p" className="mb-3" color="white" fontFamily="poppins" fontVariant="p2">
                Tournament Start
              </Typo>
              <div className="w-full max-w-xl">
                To start the tournament go to{' '}
                <span className="text-defendrRed">Tournament Progress</span> to start the
                tournament.
              </div>
            </div>
            {/*
            <div>
              <Typo as="p" className="mb-3" color="white" fontFamily="poppins" fontVariant="p2">
                Tournament End (optional)
              </Typo>
              <div className="w-full max-w-xl">
                <div className="flex gap-3">
                  <CustomDatePicker
                    className="flex-1"
                    label=""
                    value={tournamentEndDate}
                    onChange={value => setValue('tournamentEndDate', value)}
                  />
                  <CustomTimePicker
                    className="w-56"
                    label=""
                    value={tournamentEndTime}
                    onChange={value => setValue('tournamentEndTime', value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <Typo as="h3" className="mb-4" color="white" fontFamily="poppins" fontVariant="p2">
                Tournament Schedule (Optional)
              </Typo>

              <div className="space-y-6">
                {stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="space-y-4 p-4 border border-defendrGrey rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <Typo as="p" color="white" fontFamily="poppins" fontVariant="p3">
                        Stage {index + 1}
                      </Typo>
                      {stages.length > 1 && (
                        <button
                          className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm transition-all duration-200"
                          title="Remove this stage"
                          onClick={() => removeStage(stage.id)}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div>
                      <Typo
                        as="p"
                        className="mb-3"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="p2"
                      >
                        Stage name
                      </Typo>
                      <div className="max-w-sm">
                        <input
                          className="w-full px-4 py-3 bg-defendrLightBlack border border-defendrGrey rounded-full text-white placeholder-defendrGrey focus:border-defendrRed focus:outline-none"
                          placeholder={`Round ${index + 1}`}
                          type="text"
                          value={stage.stageName}
                          onChange={e => updateStage(stage.id, 'stageName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Typo
                        as="p"
                        className="mb-3"
                        color="white"
                        fontFamily="poppins"
                        fontVariant="p2"
                      >
                        Date & time
                      </Typo>
                      <div className="w-full max-w-xl">
                        <div className="flex gap-3">
                          <CustomDatePicker
                            className="flex-1"
                            label=""
                            value={stage.dateTime ? stage.dateTime.split('T')[0] : ''}
                            onChange={value => {
                              const existingTime =
                                stage.dateTime && stage.dateTime.includes('T')
                                  ? stage.dateTime.split('T')[1]
                                  : '00:00'
                              updateStage(stage.id, 'dateTime', `${value}T${existingTime}`)
                            }}
                          />
                          <CustomTimePicker
                            className="w-56"
                            label=""
                            value={
                              stage.dateTime ? stage.dateTime.split('T')[1] || '00:00' : '00:00'
                            }
                            onChange={value => {
                              const existingDate =
                                stage.dateTime && stage.dateTime.includes('T')
                                  ? stage.dateTime.split('T')[0]
                                  : new Date().toISOString().split('T')[0]
                              updateStage(stage.id, 'dateTime', `${existingDate}T${value}`)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button
                  icon="+"
                  iconOrientation="left"
                  label="Add another stage"
                  size="s"
                  textClassName="font-poppins"
                  variant="contained-red"
                  onClick={handleAddAnotherStage}
                />
              </div>
            </div>
            */}
            <div>
              <Typo as="p" className="mb-3" color="red" fontFamily="poppins" fontVariant="p2">
                Time Zone
              </Typo>
              <div className="max-w-sm">
                <input
                  className="w-full px-4 py-3 bg-defendrLightBlack border border-defendrGrey rounded-full text-white focus:border-defendrRed focus:outline-none"
                  type="text"
                  value={timeZone}
                  onChange={e => setValue('timeZone', e.target.value)}
                />
              </div>
              <Typo as="p" className="mt-2" color="grey" fontFamily="poppins" fontVariant="p5">
                All times will be displayed in this timezone
              </Typo>
            </div>

            <div className="flex justify-end">
              <Button
                disabled={isSubmitting}
                label="Next"
                size="xxs"
                textClassName="font-poppins"
                variant="contained-red"
                onClick={handleSubmit(handleNext)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
