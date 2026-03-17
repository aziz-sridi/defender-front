'use client'

import { useState } from 'react'
import Image from 'next/image'

import Typo from '@/components/ui/Typo'
import claimsImage from '@/components/assets/claim.svg'
import issuesImage from '@/components/assets/issue1.svg'

export default function IssuesAndClaimsPage() {
  const Choice = ['Claims', 'Issues']
  const [activechoice, setActiveChoice] = useState('Claims')

  return (
    <div className="text-white p-6">
      <div className="mb-8">
        <Typo as="h1" className="mb-12" color="white" fontFamily="poppins" fontVariant="h3">
          Claims & issues reports
        </Typo>

        <div className="flex gap-2 mb-8">
          {Choice.map(choice => (
            <button
              key={choice}
              className={`
                px-4 py-2 rounded-full font-poppins text-sm font-medium transition-colors
                ${
                  activechoice === choice
                    ? 'bg-defendrRed text-white'
                    : 'bg-defendrLightBlack text-defendrGrey hover:text-white border border-defendrGrey'
                }
              `}
              onClick={() => setActiveChoice(choice)}
            >
              {choice}
            </button>
          ))}
        </div>

        <Image
          alt="Claims and Issues Illustration"
          className="w-full max-w-xs mx-auto h-auto mb-6"
          height={200}
          src={activechoice === 'Claims' ? claimsImage : issuesImage}
          width={300}
        />
        <Typo as="p" className="text-center" color="white" fontFamily="poppins" fontVariant="p2">
          {activechoice === 'Claims' ? 'No claims reported.' : 'No issues reported.'}
        </Typo>
      </div>
    </div>
  )
}
