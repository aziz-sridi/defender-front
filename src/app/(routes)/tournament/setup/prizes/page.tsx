'use client'
/* eslint-disable no-console, @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useTournamentId } from '@/hooks/useTournamentId'
import { safeUpdateTournament } from '@/lib/tournament/updateHelpers'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import coinLogo from '@/components/assets/tournament/logo3.png'
import AddPrizeModal from '@/components/ui/prizes/AddPrizeModal'
import { PrizeType } from '@/types/prizeType'
import { createPrize, removePrize, getPrizesByTournament } from '@/services/prizeService'
import { getOrganizationById } from '@/services/organizationService'
import { getTournamentById } from '@/services/tournamentService'

interface Prize {
  _id?: string
  id: string
  rank: number
  type: PrizeType
  value: number
  currency?: string
  customName?: string
  voucherPlatform?: string
  voucherCode?: string
  tournament?: string
  is_shared?: boolean
  redeemed?: boolean
}

export default function PrizesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [totalBalance, setTotalBalance] = useState(0)
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)

  const tournamentId = useTournamentId()

  const totalPrizePool = prizes.reduce((sum, prize) => sum + prize.value, 0)

  const fetchOrganizationBalance = async () => {
    if (!session?.accessToken || !session?.user?.organization) {
      setIsLoadingBalance(false)
      return
    }

    try {
      const organization = await getOrganizationById(session.user.organization)

      if (organization && typeof organization.redPoints === 'number') {
        setTotalBalance(organization.redPoints)
      } else {
        setTotalBalance(0)
      }
    } catch (error) {
      console.error('Error fetching organization balance:', error)
      setTotalBalance(0)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const loadPrizesFromDatabase = async () => {
    if (!session?.accessToken || !tournamentId) {
      console.log('Cannot load prizes: missing session or tournament ID')
      setIsLoading(false)
      return
    }

    try {
      const apiRes = await getPrizesByTournament(tournamentId)
      // Support both array and {prizes: array} response
      const prizeArr = Array.isArray(apiRes) ? apiRes : apiRes?.prizes

      if (prizeArr && prizeArr.length > 0) {
        const uiPrizes = prizeArr.map((prize: any) => ({
          _id: prize._id,
          id: prize._id,
          rank: prize.rank,
          type: prize.type,
          value: prize.value,
          currency: prize.currency,
          customName: prize.customName,
          voucherPlatform: prize.voucherPlatform,
          voucherCode: prize.voucherCode,
          tournament: prize.tournament,
          is_shared: prize.is_shared,
          redeemed: prize.redeemed,
        }))

        setPrizes(uiPrizes)
        savePrizesToLocalStorage(uiPrizes)
      }
    } catch (error) {
      console.error('Error loading prizes from database:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const savePrizesToLocalStorage = (prizesToSave: Prize[]) => {
    try {
      const tournamentInfo = localStorage.getItem('tournamentInfo')
      let tournament = {}

      if (tournamentInfo) {
        tournament = JSON.parse(tournamentInfo)
      }

      tournament = { ...tournament, prizes: prizesToSave }
      localStorage.setItem('tournamentInfo', JSON.stringify(tournament))
    } catch (error) {
      console.error('Error saving prizes to localStorage:', error)
    }
  }

  // tournamentId now provided by hook; legacy effect removed

  useEffect(() => {
    if (session?.accessToken && tournamentId) {
      fetchOrganizationBalance()
      loadPrizesFromDatabase()
    }
  }, [session?.accessToken, tournamentId])

  const updateTournamentPrizes = async (prizeIds: string[]) => {
    if (!session?.accessToken) {
      throw new Error('Authentication required')
    }
    if (!tournamentId) {
      throw new Error('Missing tournament id')
    }

    try {
      // Use service method to update tournament prizes
      await safeUpdateTournament(tournamentId, { prizes: prizeIds })
    } catch (error) {
      console.error('Error updating tournament prizes:', error)
      throw error
    }
  }

  const handleAddPrize = (prizeData: {
    rank: number
    type: PrizeType
    value: number
    currency?: string
    customName?: string
    voucherPlatform?: string
    voucherCode?: string
  }) => {
    const newPrize: Prize = {
      id: Date.now().toString(),
      rank: prizeData.rank,
      type: prizeData.type,
      value: prizeData.value,
      currency: prizeData.currency,
      customName: prizeData.customName,
      voucherPlatform: prizeData.voucherPlatform,
      voucherCode: prizeData.voucherCode,
    }

    const updatedPrizes = [...prizes, newPrize]
    setPrizes(updatedPrizes)
    savePrizesToLocalStorage(updatedPrizes)
  }

  const handleRemovePrize = async (id: string) => {
    if (!session?.accessToken) {
      toast.error('Authentication required. Please log in again.')
      return
    }

    const prizeToRemove = prizes.find(prize => prize.id === id)
    if (!prizeToRemove) {
      toast.error('Prize not found.')
      return
    }

    try {
      if (prizeToRemove._id) {
        await removePrize(prizeToRemove._id)
      } else {
      }

      const updatedPrizes = prizes.filter(prize => prize.id !== id)
      setPrizes(updatedPrizes)
      savePrizesToLocalStorage(updatedPrizes)

      const remainingPrizeIds = updatedPrizes.map(p => p._id || p.id).filter(Boolean)
      await updateTournamentPrizes(remainingPrizeIds)

      toast.success('Prize removed successfully!')
    } catch (error) {
      console.error('Error removing prize:', error)
      toast.error('Failed to remove prize. Please try again.')
    }
  }

  const handleNext = async () => {
    if (!session?.accessToken) {
      toast.error('Authentication required. Please log in again.')
      return
    }

    if (!tournamentId) {
      toast.error('Missing tournament ID. Please go back and create/select a tournament first.')
      return
    }

    setIsSubmitting(true)

    try {
      if (prizes.length > 0) {
        for (const prize of prizes) {
          // Prevent sending the same prize twice (skip if _id exists)
          if (prize._id) {
            continue
          }

          const correctApiData: any = {
            tournamentId: tournamentId,
            prize: {
              value: prize.value,
              currency: prize.currency || 'USD',
              rank: prize.rank,
              type: prize.type,
            },
          }

          if (prize.type === 'VOUCHER') {
            correctApiData.prize.GIFT_CODE = {
              platform: prize.voucherPlatform || 'Default Platform',
              code: prize.voucherCode || 'VOUCHER_CODE_' + Date.now(),
            }
            correctApiData.prize.is_shared = false
          } else if (prize.type === 'OTHER') {
            correctApiData.prize.GIFT_CODE = {
              platform: prize.customName || 'Custom Prize',
              code: 'CUSTOM_CODE_' + Date.now(),
            }
            correctApiData.prize.is_shared = false
          } else if (prize.type === 'CASH') {
            correctApiData.prize.is_shared = true
          } else if (prize.type === 'RED_POINTS') {
            correctApiData.prize.is_shared = true
          }

          // Use service method to create prize
          await createPrize(correctApiData)
        }

        toast.success('All prizes have been saved successfully!')
      }

      // Always allow navigation to next page, even if no prizes
      router.push('/tournament/setup/rules')
    } catch {
      toast.error('Failed to save some prizes. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPrizeDisplayText = (prize: Prize) => {
    if (prize.type === 'RED_POINTS') {
      return `${prize.value} Red Coins`
    } else if (prize.type === 'CASH') {
      return `${prize.value} ${prize.currency}`
    } else if (prize.type === 'VOUCHER') {
      return 'Voucher'
    } else if (prize.type === 'OTHER') {
      return prize.customName || 'Custom Prize'
    }
    return `${prize.value}`
  }

  return (
    <div className="text-white p-6">
      <div className="mb-8">
        <Typo as="h1" className="mb-8" color="white" fontFamily="poppins" fontVariant="h3">
          Prizes
        </Typo>

        {/* Balance Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Typo as="span" className="mr-3" color="white" fontFamily="poppins" fontVariant="p1">
              Your total balance :
            </Typo>
            <div className="flex items-center gap-2">
              <Typo as="span" color="white" fontFamily="poppins" fontVariant="p1">
                {isLoadingBalance ? 'Loading...' : totalBalance.toLocaleString()}
              </Typo>
              <Image alt="Coin" className="inline-block" height={24} src={coinLogo} width={24} />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Typo as="span" className="mr-3" color="white" fontFamily="poppins" fontVariant="p1">
                Total prize pool :
              </Typo>
              <Typo as="span" color="white" fontFamily="poppins" fontVariant="p1">
                {totalPrizePool}
              </Typo>
            </div>
            <Button
              label="Add prize"
              size="xxs"
              textClassName="font-poppins"
              variant="contained-red"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        {isLoading && (
          <div className="bg-defendrLightBlack rounded-lg p-6 text-center">
            <Typo as="span" color="white" fontFamily="poppins" fontVariant="p1">
              Loading prizes...
            </Typo>
          </div>
        )}

        {!isLoading && prizes.length > 0 && (
          <div className="bg-defendrLightBlack rounded-lg p-6">
            <div className="space-y-4">
              {prizes.map(prize => (
                <div key={prize.id} className="flex items-center justify-between">
                  <Typo as="span" color="white" fontFamily="poppins" fontVariant="p1">
                    Rank #{prize.rank}
                  </Typo>
                  <div className="flex items-center gap-2">
                    {prize.type === 'RED_POINTS' && (
                      <Image
                        alt="Coin"
                        className="inline-block"
                        height={20}
                        src={coinLogo}
                        width={20}
                      />
                    )}
                    <Typo as="span" color="white" fontFamily="poppins" fontVariant="p1">
                      {getPrizeDisplayText(prize)}
                    </Typo>
                    <button
                      className="ml-4 text-defendrGrey hover:text-defendrRed transition-colors"
                      onClick={() => handleRemovePrize(prize.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-end mt-8">
          <Button
            disabled={isSubmitting}
            label="Next"
            size="xxs"
            textClassName="font-poppins"
            variant="contained-red"
            onClick={handleNext}
          />
        </div>
      </div>

      <AddPrizeModal
        isOpen={isModalOpen}
        onAdd={handleAddPrize}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
