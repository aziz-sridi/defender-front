'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import TextEditor from '@/utils/textEditor'
import { useTournamentDetails } from '@/hooks/useTournamentDetails'
import { Tournament } from '@/types/tournamentType'
import { safeUpdateTournament } from '@/lib/tournament/updateHelpers'

export default function RulesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [rulesContent, setRulesContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { tournament, tournamentId } = useTournamentDetails()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    setErrorMsg(null)
    if (!tournamentId) {
      return
    }
    if (tournament && typeof tournament === 'object' && 'rules' in tournament) {
      setRulesContent((tournament as unknown as Tournament).rules || '')
    }
  }, [tournamentId, tournament])

  const handleContentChange = (content: string) => {
    setRulesContent(content)
    // Persist locally (will be sent to API on Next)
    try {
      const tournamentInfo = localStorage.getItem('tournamentInfo')
      const t = tournamentInfo ? JSON.parse(tournamentInfo) : {}
      t.rules = content
      localStorage.setItem('tournamentInfo', JSON.stringify(t))
    } catch {
      /* ignore */
    }
  }

  const handleNext = async () => {
    setErrorMsg(null)
    if (!rulesContent.trim()) {
      setErrorMsg('Please add some rules before proceeding.')
      return
    }
    if (!tournamentId || !session?.accessToken) {
      setErrorMsg('Missing tournament context or session')
      return
    }

    setIsSubmitting(true)
    try {
      await safeUpdateTournament(tournamentId, { rules: rulesContent })
      router.push('/tournament/setup/streaming')
    } catch {
      setErrorMsg('Failed to save rules. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="text-white p-6">
      <div className="mb-8">
        <Typo as="h1" className="mb-8" color="white" fontVariant="h3">
          Rules
        </Typo>
        {errorMsg && (
          <div className="mb-4 text-defendrRed font-poppins text-sm" role="alert">
            {errorMsg}
          </div>
        )}
        <TextEditor content={rulesContent} onContentChange={handleContentChange} />
        <div className="flex justify-end mt-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    disabled={isSubmitting}
                    label="Next"
                    size="xxs"
                    textClassName="font-poppins"
                    variant="contained-red"
                    onClick={handleNext}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                Save your rules and continue to the next step
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
