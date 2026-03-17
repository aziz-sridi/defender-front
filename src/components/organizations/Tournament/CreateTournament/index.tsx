'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

import Button from '@/components/ui/Button'
import CircularLoop from '@/components/ui/Icons/CircularLoop'
import Clock from '@/components/ui/Icons/Clock'
import Rightarrow from '@/components/ui/Icons/Rightarrow'
import Rocket from '@/components/ui/Icons/Rocket'
import Star from '@/components/ui/Icons/Star'
import Trophy from '@/components/ui/Icons/Trophy'
import Typo from '@/components/ui/Typo'

const CreateTournament = () => {
  const router = useRouter()

  const handleExpressClick = () => {
    router.push('/create/tournament/express')
  }

  const handleAdvancedClick = () => {
    router.push('/create/tournament/advanced')
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
          Create Your Tournament
        </Typo>
        <Typo
          as="h3"
          className="text-lg md:text-lg text-gray-400"
          fontFamily="poppins"
          fontVariant="p5"
        >
          Choose The Creation Method That Works Best For You
        </Typo>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12 w-full max-w-7xl">
        <div className="relative bg-[#212529] border border-defendrRed rounded-2xl shadow-lg p-6 w-full max-w-lg flex flex-col">
          <span className="absolute top-2 right-2 bg-defendrRed text-white text-xs px-2 py-1 rounded-full">
            Fastest
          </span>
          <div className="text-defendrRed mb-4 w-[50px] h-[50px] relative">
            <Image fill alt="Express" className="object-cover" src="/assets/organization/Zap.png" />
          </div>
          <Typo as="h3" className="text-xl bold mb-2" fontFamily="poppins" fontVariant="p4b">
            Express
          </Typo>
          <Typo as="p" className="text-gray-400 mb-4" fontVariant="p6">
            Create in seconds
          </Typo>

          <ul className="flex flex-col items-start w-full text-left gap-4 my-4">
            <li className="flex items-center gap-2">
              <Clock className="text-defendrRed" size={16} />
              <span className="text-sm">Under 1 minute to create</span>
            </li>
            <li className="flex items-center gap-2">
              <CircularLoop className="text-defendrRed" size={16} />
              <span className="text-sm">3 essential fields only</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="text-defendrRed" size={16} />
              <span className="text-sm">Perfect for first tournaments</span>
            </li>
            <li className="flex items-center gap-2">
              <Trophy className="text-defendrRed w-4 h-4" />
              <span className="text-sm">1 trial per month</span>
            </li>
          </ul>

          <Button
            className="flexCenter mt-auto w-full px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            icon={<Rightarrow className="ml-2" fill="white" />}
            iconOrientation="right"
            label="Express Create"
            size="xs"
            variant="contained-red"
            onClick={handleExpressClick}
          />
        </div>

        <div className="relative bg-[#212529] border border-defendrRed rounded-2xl shadow-lg p-6 w-full max-w-lg flex flex-col">
          <span className="absolute top-2 right-2 bg-defendrRed text-white text-xs px-2 py-1 rounded-full">
            Advanced
          </span>
          <div className="text-defendrRed mb-4 w-[50px] h-[50px] relative">
            <Image
              fill
              alt="Advanced"
              className="object-cover"
              src="/assets/organization/ElectricCloud.png"
            />
          </div>
          <Typo as="h3" className="text-xl bold mb-2" fontFamily="poppins" fontVariant="p4b">
            Advanced
          </Typo>
          <Typo as="p" className="text-gray-400 mb-4" fontVariant="p6">
            Control over all settings
          </Typo>

          <ul className="flex flex-col items-start w-full text-left gap-4 my-4">
            <li className="flex items-center gap-2">
              <Clock className="text-defendrRed" size={16} />
              <span className="text-sm">5-10 minutes to create</span>
            </li>
            <li className="flex items-center gap-2">
              <CircularLoop className="text-defendrRed" size={16} />
              <span className="text-sm">Complete Customisation</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="text-defendrRed" size={16} />
              <span className="text-sm">For experienced organizers</span>
            </li>
            <li className="flex items-center gap-2">
              <Trophy className="text-defendrRed w-4 h-4" />
              <span className="text-sm">1 trial per 3 months</span>
            </li>
          </ul>

          <Button
            className="flexCenter mt-auto w-full px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            icon={<Rightarrow className="ml-2" fill="white" />}
            iconOrientation="right"
            label="Standard Create"
            size="xs"
            variant="contained-red"
            onClick={handleAdvancedClick}
          />
        </div>
      </div>

      <div className="bg-[#212529] rounded-2xl p-2 md:p-4 flex items-start gap-4 max-w-4xl text-sm md:text-base">
        <Rocket className="text-defendrRed" />
        <p>
          <span className="text-defendrRed bold">Pro tip:</span> Use Express mode for your first
          tournament. You can always customize more settings later.
        </p>
      </div>
    </section>
  )
}

export default CreateTournament
