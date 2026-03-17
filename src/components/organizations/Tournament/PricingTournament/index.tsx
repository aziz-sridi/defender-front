'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

import Button from '@/components/ui/Button'
import Check from '@/components/ui/Icons/Check'
// import Info from '@/components/ui/Icons/Info'
import Rightarrow from '@/components/ui/Icons/Rightarrow'
import Trophy from '@/components/ui/Icons/Trophy'
import Users from '@/components/ui/Icons/Users'
import Wallet from '@/components/ui/Icons/Wallet'
import Typo from '@/components/ui/Typo'

interface PricingTournamentProps {
  onContinue?: (type: 'free' | 'paid', entryFee: number) => void
}

const PricingTournament = ({ onContinue }: PricingTournamentProps) => {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [entryFee, setEntryFee] = useState<number>(5) // default fee

  const handleContinue = () => {
    if (!selectedType) {
      toast.error('Please select a tournament entry type to continue.')
      return
    }
    if (onContinue) {
      onContinue(selectedType as 'free' | 'paid', selectedType === 'paid' ? entryFee : 0)
      return
    }
    // fallback legacy route if used standalone
    router.push('/create/tournament/details')
  }

  const handleSelect = (type: string) => {
    setSelectedType(type)
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] bg-dark text-white p-6 md:p-10 font-poppins">
      <div className="text-center mb-12">
        <Typo
          as="h2"
          className="text-xl md:text-2xl lg:text-3xl bold text-white mb-2"
          fontFamily="poppins"
          fontVariant="p3"
        >
          Tournament Entry Type
        </Typo>
        <Typo
          as="p"
          className="text-base md:text-md text-gray-400"
          fontFamily="poppins"
          fontVariant="p5"
        >
          Choose Between A Free Or Paid Tournament
        </Typo>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8 w-full max-w-3xl items-stretch">
        {/* Free Tournament */}
        <div
          className={`relative bg-dark border ${
            selectedType === 'free' ? 'border-defendrRed' : 'border-gray-600'
          } rounded-2xl shadow-lg p-6 w-[370px] h-[400px] flex flex-col cursor-pointer transition-all duration-300 hover:scale-105`}
          onClick={() => handleSelect('free')}
        >
          <div className="text-defendrRed mb-4">
            <Users />
          </div>
          <Typo as="h3" className="text-xl bold mb-2" fontVariant="p4b">
            Free Tournament
          </Typo>
          <Typo as="p" className="text-gray-400 mb-4 text-xs" fontVariant="p6">
            Open To All Participants Without An Entry Fee
          </Typo>
          <Typo as="p" className="text-md text-white mb-4 text-center mt-2 bold" fontVariant="p4b">
            <span className="text-defendrRed bold px-2 text-2xl">0 Coming Soon</span>
            Entry Fee
          </Typo>
          <hr className="border-gray-600 mb-4" />

          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full bg-green-500 w-6 h-6">
                <Check fill="white" />
              </div>
              <Typo as="span" className="text-sm" fontVariant="p5">
                <span className="bold">Maximum Participation</span>
              </Typo>
            </div>
            <Typo as="p" className="text-xs text-gray-500 ml-6" fontVariant="p6">
              Attract More Players With No Barrier To Entry
            </Typo>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-green-500 w-6 h-6">
              <Check fill="white" />
            </div>
            <Typo as="span" className="text-sm" fontVariant="p5">
              <span className="bold">Community Building</span>
            </Typo>
          </div>
          <Typo as="p" className="text-xs text-gray-500 ml-6 mb-4" fontVariant="p6">
            Great for Growing Your Community And Brand
          </Typo>

          <div className="bg-gray-600 rounded-lg py-3 px-4 mt-auto">
            <div className="flex items-center gap-2">
              <Trophy className="text-defendrRed" />
              <Typo as="span" className="text-sm text-white" fontVariant="p5">
                You Can Still Add Prizes
              </Typo>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <div className="inline-flex items-center bg-defendrRed text-black rounded-full px-2 py-1 text-xs font-bold">
              FREE
            </div>
          </div>
        </div>

        {/* Paid Tournament */}
        <div
          className={`relative bg-dark border ${
            selectedType === 'paid' ? 'border-defendrRed' : 'border-gray-600'
          } rounded-2xl shadow-lg p-6 w-[370px] h-[400px] flex flex-col cursor-pointer transition-all duration-300 hover:scale-105`}
          onClick={() => handleSelect('paid')}
        >
          <div className="text-defendrRed mb-4">
            <Users />
          </div>
          <Typo as="h3" className="text-xl bold mb-2" fontVariant="p4b">
            Paid Tournament
          </Typo>
          <Typo as="p" className="text-gray-400 mb-4 text-xs" fontVariant="p6">
            Participants Pay An Entry Fee To Compete
          </Typo>

          <Typo as="p" className="text-md text-white mb-4 text-center mt-2 bold" fontVariant="p4b">
            <label className="sr-only" htmlFor="entry-fee">
              Entry Fee
            </label>
            <input
              aria-label="Entry Fee"
              className="text-defendrRed text-2xl bold px-2 w-20 bg-transparent border-b-2 border-defendrRed focus:outline-none text-center appearance-none"
              id="entry-fee"
              inputMode="numeric"
              min={1}
              pattern="[0-9]*"
              step={1}
              type="number"
              value={entryFee}
              onChange={e => setEntryFee(Math.max(1, Number(e.target.value)))}
            />{' '}
            <span className="text-defendrRed bold px-2 text-2xl">Coming Soon</span> Entry Fee
          </Typo>

          <hr className="border-gray-600 mb-4" />

          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full bg-green-500 w-6 h-6">
                <Check fill="white" />
              </div>
              <Typo as="span" className="text-sm" fontVariant="p5">
                <span className="bold">Cash Prize Pool</span>
              </Typo>
            </div>
            <Typo as="p" className="text-xs text-gray-500 ml-6" fontVariant="p6">
              Entry Fees Contribute To The Prize Pool
            </Typo>
          </div>
          <div className="flex items-center gap-2 ">
            <div className="flex items-center justify-center rounded-full bg-green-500 w-6 h-6">
              <Check fill="white" />
            </div>
            <Typo as="span" className="text-sm" fontVariant="p5">
              <span className="bold">Higher Commitment</span>
            </Typo>
          </div>
          <Typo as="p" className="text-xs text-gray-500 ml-6 mb-4" fontVariant="p6">
            Players Are More Invested And Less Likely To Drop Out
          </Typo>

          <div className="bg-gray-600 rounded-lg py-3 px-4 mt-auto">
            <div className="flex items-center gap-2">
              <Wallet className="text-defendrRed" />
              <Typo as="span" className="text-sm text-white" fontVariant="p5">
                Payments Go To Your Organization
              </Typo>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <div className="inline-flex items-center bg-defendrRed text-black rounded-full px-2 py-1 text-xs font-bold">
              PAID
            </div>
          </div>
        </div>
      </div>

      {/* {selectedType === 'paid' && (
        <div className="bg-dark rounded-2xl border border-red-500 p-6 md:p-8 w-full max-w-4xl text-sm md:text-base mt-8">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-red-500" />
            <Typo as="h3" className="text-xl bold text-red-500" fontVariant="p4b">
              Membership or soul required
            </Typo>
          </div>

          <Typo as="p" className="text-white mb-4" fontVariant="p5">
            To create a paid tournament, you need either:
          </Typo>

          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>
              <Typo as="span" className="text-white" fontVariant="p5">
                An active membership subscription
              </Typo>
            </li>
            <li>
              <Typo as="span" className="text-white" fontVariant="p5">
                At least 1 Soul token (1 Soul = 1 paid tournament)
              </Typo>
            </li>
          </ul>

          <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 rounded-lg p-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Typo as="p" className="text-red-500" fontVariant="p5">
                Your soul balance :
              </Typo>
              <Typo as="p" className="bold text-white" fontVariant="p5">
                0 Souls
              </Typo>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              className="flex items-start gap-4"
              icon={<Trophy className=" text-white" />}
              iconOrientation="left"
              label="Purchase Soul"
              size="xs"
              textClassName=""
              variant="contained-red"
            />
            <Button
              className="flex items-start gap-4"
              icon={<Check className=" text-white" />}
              iconOrientation="left"
              label="Get membership"
              size="xs"
              textClassName=""
              variant="outlined-red"
            />
          </div>
        </div>
      )} */}

      <button
        className={`flexCenter font-bold py-3 px-6 rounded-xl transition-transform duration-300 hover:scale-105 mt-8 ${
          selectedType ? 'bg-defendrRed text-white' : 'bg-gray-500 text-black'
        }`}
        onClick={handleContinue}
      >
        Continue{' '}
        <Rightarrow
          className={`ml-2 ${selectedType ? 'text-white' : 'text-black'}`}
          fill={`${selectedType ? 'white' : 'black'}`}
        />
      </button>
    </section>
  )
}

export default PricingTournament
