'use client'

import Typo from '@/components/ui/Typo'

export default function OverviewImpact() {
  return (
    <div className="bg-gradient-to-b from-zinc-900 to-black text-white p-6 md:p-8 rounded-xl">
      <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-2 md:gap-4">
        <div>
          <Typo as="h2" className="md:text-2xl text-xl font-semibold" fontVariant="h2">
            Community Initiatives
          </Typo>
          <Typo as="p" className="mt-1 text-xs md:text-sm" color="grey" fontVariant="p5">
            Our efforts to give back and grow the esports ecosystem
          </Typo>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Typo as="span" className="text-center" color="grey" fontVariant="h3">
          No community initiatives available
        </Typo>
      </div>
    </div>
  )
}
