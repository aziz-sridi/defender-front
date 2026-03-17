'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

export default function NoTeamsFound() {
  const [selected, setSelected] = useState<'owned' | 'joined'>('owned')
  const router = useRouter()
  return (
    <div className="flex flex-col gap-7 p-10 bg-[#161616]">
      <Typo fontFamily="poppins" fontVariant="h4">
        Your Teams(0)
      </Typo>
      <div className="flex gap-5">
        <button
          className={
            selected === 'owned'
              ? 'bg-[#D627554D] p-3 rounded-3xl text-[#D62555]'
              : 'rounded-lg text-gray-500  '
          }
          onClick={() => setSelected('owned')}
        >
          <Typo as="p" fontFamily="poppins" fontVariant="p4">
            Owned
          </Typo>
        </button>
        <button
          className={
            selected === 'joined'
              ? 'bg-[#D627554D] p-3 rounded-3xl text-[#D62555]'
              : 'rounded-lg text-gray-500 '
          }
          onClick={() => setSelected('joined')}
        >
          <Typo as="p" fontFamily="poppins" fontVariant="p4">
            Joined In
          </Typo>
        </button>
      </div>
      <Typo as="p" fontFamily="poppins" fontVariant="p3">
        You Have No Team You Own Create Your Own Team Now
      </Typo>
      <div className="flex flex-col justify-center gap-1">
        <div
          className="ms-6 cursor-pointer rounded-full border border-red-700 w-20 h-20 flex justify-center items-center"
          onClick={() => router.push('/team/create')}
        >
          <Plus className="w-6 h-6 text-red-700" />
        </div>
        <Typo fontFamily="poppins" fontVariant="p4">
          Create A Team
        </Typo>
      </div>
    </div>
  )
}
