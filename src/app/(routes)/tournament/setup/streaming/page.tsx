'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { useTournamentId } from '@/hooks/useTournamentId'

import { getTournamentById } from '@/services/tournamentService'
import { safeUpdateTournament } from '@/lib/tournament/updateHelpers'
import { useTournamentDraftStore, isStreamingStepValid } from '@/hooks/useTournamentDraftStore'

interface StreamingPlatform {
  id: string
  platform: string
  link: string
}

export default function StreamingPage() {
  const { data: session } = useSession()
  const [streamingPlatforms, setStreamingPlatforms] = useState<StreamingPlatform[]>([
    { id: '1', platform: '', link: '' },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const tournamentId = useTournamentId()
  const { setStreaming } = useTournamentDraftStore()

  const platforms = ['Twitch', 'YouTube', 'Facebook Gaming', 'Discord', 'Kick', 'Other']

  // Load tournament data from API
  const loadTournamentData = async () => {
    if (!tournamentId || !session?.accessToken) return

    try {
      const tournament = await getTournamentById(tournamentId)
      if (
        tournament?.streaming &&
        Array.isArray(tournament.streaming) &&
        tournament.streaming.length > 0
      ) {
        const loadedStreams = tournament.streaming.map((stream: any, index: number) => ({
          id: (index + 1).toString(),
          platform: stream.platform || '',
          link: stream.link || '',
        }))
        setStreamingPlatforms(loadedStreams)
        setStreaming(loadedStreams.map(s => ({ platform: s.platform, link: s.link })))
        saveStreamingToLocalStorage(loadedStreams)
      }
    } catch (error) {
      console.error('Failed to load tournament streaming data:', error)
    }
  }

  // validation handled via isStreamingStepValid()

  useEffect(() => {
    // First try to load from localStorage
    const tournamentInfo = localStorage.getItem('tournamentInfo')
    if (tournamentInfo) {
      try {
        const tournament = JSON.parse(tournamentInfo) as {
          streamingPlatforms?: Array<{ platform?: string; link?: string }>
          streaming?: Array<{ platform?: string; link?: string }>
        }

        const fromNewKey =
          tournament.streamingPlatforms &&
          Array.isArray(tournament.streamingPlatforms) &&
          tournament.streamingPlatforms.length > 0

        const fromLegacyKey =
          tournament.streaming &&
          Array.isArray(tournament.streaming) &&
          tournament.streaming.length > 0

        if (fromNewKey && tournament.streamingPlatforms) {
          const normalized = tournament.streamingPlatforms.map((s, idx) => ({
            id: (idx + 1).toString(),
            platform: s.platform || '',
            link: s.link || '',
          }))
          setStreamingPlatforms(normalized)
          setStreaming(normalized.map(s => ({ platform: s.platform, link: s.link })))
        } else if (fromLegacyKey) {
          const loadedStreams = (tournament.streaming || []).map((stream, index: number) => ({
            id: (index + 1).toString(),
            platform: stream.platform || '',
            link: stream.link || '',
          }))
          setStreamingPlatforms(loadedStreams)
          setStreaming(loadedStreams.map(s => ({ platform: s.platform, link: s.link })))
          saveStreamingToLocalStorage(loadedStreams)
        }
      } catch {
        // ignore parse / shape errors
      }
    }
  }, [setStreaming])

  // Load from API when tournamentId and session are available
  useEffect(() => {
    if (tournamentId && session?.accessToken) {
      loadTournamentData()
    }
  }, [tournamentId, session?.accessToken])

  const addNewStreamPanel = () => {
    const newStream: StreamingPlatform = {
      id: Date.now().toString(),
      platform: '',
      link: '',
    }
    const updatedPlatforms = [...streamingPlatforms, newStream]
    setStreamingPlatforms(updatedPlatforms)
    setStreaming(updatedPlatforms.map(s => ({ platform: s.platform, link: s.link })))
    saveStreamingToLocalStorage(updatedPlatforms)
  }

  const updateStreamingPlatform = (id: string, field: 'platform' | 'link', value: string) => {
    const updatedPlatforms = streamingPlatforms.map(stream =>
      stream.id === id ? { ...stream, [field]: value } : stream,
    )
    setStreamingPlatforms(updatedPlatforms)
    setStreaming(updatedPlatforms.map(s => ({ platform: s.platform, link: s.link })))
    saveStreamingToLocalStorage(updatedPlatforms)
  }

  const saveStreamingToLocalStorage = (platforms: StreamingPlatform[]) => {
    const tournamentInfo = localStorage.getItem('tournamentInfo')
    let tournament: { streamingPlatforms?: StreamingPlatform[] } = {}

    if (tournamentInfo) {
      try {
        tournament = JSON.parse(tournamentInfo)
      } catch {
        // ignore parse errors
      }
    }

    tournament.streamingPlatforms = platforms
    localStorage.setItem('tournamentInfo', JSON.stringify(tournament))
  }

  const removeStreamingPlatform = (id: string) => {
    if (streamingPlatforms.length > 1) {
      const updatedPlatforms = streamingPlatforms.filter(stream => stream.id !== id)
      setStreamingPlatforms(updatedPlatforms)
      setStreaming(updatedPlatforms.map(s => ({ platform: s.platform, link: s.link })))
      saveStreamingToLocalStorage(updatedPlatforms)
    }
  }

  const updateTournamentInDatabase = async (
    streamingData: Array<{ platform: string; link: string }>,
  ) => {
    if (!tournamentId || !session?.accessToken) {
      return (
        <div className="text-white p-6">
          <p>Error: Missing tournament ID or session.</p>
        </div>
      )
    }
    try {
      const result = await safeUpdateTournament(tournamentId, { streaming: streamingData })
      return result
    } catch (error) {
      throw error
    }
  }

  const handleSave = async () => {
    const validStreams = streamingPlatforms.filter(stream => stream.platform && stream.link)

    if (validStreams.length === 0) {
      toast.error('Please add at least one streaming platform with both platform and link filled.')
      return
    }

    if (!tournamentId) {
      toast.error('No tournament ID found. Please go back and create a tournament first.')
      return
    }

    if (!session?.accessToken) {
      toast.error('No valid session found. Please log in again.')
      return
    }

    setIsSubmitting(true)

    try {
      const streamingData = validStreams.map(stream => ({
        platform: stream.platform.trim(),
        link: stream.link.trim(),
      }))

      await updateTournamentInDatabase(streamingData)

      const tournamentInfo = localStorage.getItem('tournamentInfo')
      if (tournamentInfo) {
        try {
          const tournament = JSON.parse(tournamentInfo) as {
            streaming?: Array<{ platform: string; link: string }>
            [k: string]: unknown
          }
          tournament.streaming = streamingData
          localStorage.setItem('tournamentInfo', JSON.stringify(tournament))
        } catch {}
      }

      toast.success('Streaming platforms updated successfully!')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to update streaming platforms: ${error.message}`)
      } else {
        toast.error('Failed to update streaming platforms. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    const resetPlatforms = [{ id: '1', platform: '', link: '' }]
    setStreamingPlatforms(resetPlatforms)
    setStreaming([])
    saveStreamingToLocalStorage(resetPlatforms)
  }

  return (
    <div className="text-white p-6">
      <div className="mb-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Typo as="h1" className="mb-2" color="white" fontVariant="h2" fontWeight="bold">
                Live Streaming Setup
              </Typo>
              <Typo as="p" className="text-gray-400" fontVariant="p4">
                Configure streaming platforms for your tournament. Streams will be embedded directly
                in the tournament page.
              </Typo>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${streamingPlatforms.some(s => s.platform && s.link) ? 'bg-green-500' : 'bg-gray-500'}`}
              ></div>
              <Typo as="span" className="text-sm text-gray-400" fontVariant="p5">
                {streamingPlatforms.some(s => s.platform && s.link)
                  ? 'Configured'
                  : 'Not configured'}
              </Typo>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Dynamic Streaming Platforms */}
          {streamingPlatforms.map((stream, index) => (
            <div
              key={stream.id}
              className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 hover:border-gray-600 transition-all duration-300 ${
                stream.platform && stream.link
                  ? 'border-green-500/30 bg-green-900/10'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Typo as="h3" className="text-white font-medium" fontVariant="p3">
                  Stream #{index + 1}
                </Typo>
                <div className="flex items-center gap-2">
                  {stream.platform && stream.link ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">Ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">Incomplete</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* Platform Selection */}
                <div className="space-y-3">
                  <Typo as="label" className="block text-white font-medium" fontVariant="p3">
                    Streaming Platform
                  </Typo>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 appearance-none cursor-pointer transition-all duration-200"
                      value={stream.platform}
                      onChange={e => updateStreamingPlatform(stream.id, 'platform', e.target.value)}
                    >
                      <option disabled className="bg-gray-900" value="">
                        Choose platform
                      </option>
                      {platforms.map(platform => (
                        <option key={platform} className="bg-gray-900" value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Stream URL */}
                <div className="space-y-3">
                  <Typo as="label" className="block text-white font-medium" fontVariant="p3">
                    Stream URL
                  </Typo>
                  <input
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                    placeholder="https://kick.com/username"
                    type="url"
                    value={stream.link}
                    onChange={e => updateStreamingPlatform(stream.id, 'link', e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 items-center">
                  {/* Remove button (show on all rows except when there's only 1 stream) */}
                  {streamingPlatforms.length > 1 && (
                    <button
                      className="p-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-all duration-200 group"
                      title="Remove this streaming platform"
                      onClick={() => removeStreamingPlatform(stream.id)}
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Save and Cancel buttons on the first row only */}
                  {index === 0 && (
                    <div className="flex gap-3 ml-auto">
                      <Button
                        disabled={isSubmitting || !isStreamingStepValid()}
                        label={isSubmitting ? 'Saving...' : 'Save Changes'}
                        size="s"
                        variant="contained-red"
                        onClick={handleSave}
                      />
                      <Button
                        label="Reset"
                        size="s"
                        variant="outlined-grey"
                        onClick={handleCancel}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Stream Panel Button */}
          <button
            className="w-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-xl p-6 transition-all duration-300 group"
            onClick={addNewStreamPanel}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-gray-600/50 group-hover:bg-gray-500/50 rounded-lg transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="text-left">
                <Typo
                  as="p"
                  className="text-white font-medium group-hover:text-white"
                  fontVariant="p3"
                >
                  Add Another Platform
                </Typo>
                <Typo as="p" className="text-gray-400 text-sm" fontVariant="p5">
                  Add multiple streaming platforms for your tournament
                </Typo>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
