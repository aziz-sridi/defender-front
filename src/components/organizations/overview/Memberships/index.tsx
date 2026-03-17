'use client'
import Typo from '@/components/ui/Typo'

const Memberships = () => {
  return (
    <div className="bg-[#212529] p-5 sm:p-8 rounded-2xl">
      <Typo as="h2" color="white" fontFamily="poppins" fontVariant="h3" className="font-bold mb-6">
        Membership Tiers
      </Typo>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Fan Tier */}
        <div className="bg-[#1a1d20] rounded-xl p-5 sm:p-6 border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="font-bold">
              Fan
            </Typo>
            <span className="text-gray-500 text-sm font-poppins">Free</span>
          </div>

          <ul className="flex flex-col gap-2.5 text-sm font-poppins">
            <li className="flex items-center gap-2.5 text-gray-300">
              <span className="text-green-500 text-xs">✓</span>
              Organization updates
            </li>
            <li className="flex items-center gap-2.5 text-gray-300">
              <span className="text-green-500 text-xs">✓</span>
              Join free tournaments
            </li>
            <li className="flex items-center gap-2.5 text-gray-300">
              <span className="text-green-500 text-xs">✓</span>
              Community events
            </li>
          </ul>
        </div>

        {/* Supporter Tier */}
        <div className="bg-[#1a1d20] rounded-xl p-5 sm:p-6 border border-[#D62555]/25 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <Typo as="h3" color="white" fontFamily="poppins" fontVariant="h4" className="font-bold">
              Supporter
            </Typo>
            <span className="text-[#D62555] text-sm font-semibold font-poppins">Paid</span>
          </div>

          <ul className="flex flex-col gap-2.5 text-sm font-poppins flex-1">
            <li className="flex items-center gap-2.5 text-gray-300">
              <span className="text-green-500 text-xs">✓</span>
              Exclusive events
            </li>
            <li className="flex items-center gap-2.5 text-gray-300">
              <span className="text-green-500 text-xs">✓</span>
              Subscriber badge
            </li>
            <li className="flex items-center gap-2.5 text-gray-300">
              <span className="text-green-500 text-xs">✓</span>
              5% Paid entry discount
            </li>
          </ul>

          <button
            disabled
            className="mt-5 w-full py-2 bg-[#D62555]/15 text-[#D62555] text-sm font-semibold rounded-lg font-poppins cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  )
}

export default Memberships
