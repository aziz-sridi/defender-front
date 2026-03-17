import Image from 'next/image'
import Link from 'next/link'

import FacebookIcon from '@/components/ui/Icons/FacebookIcon'
import { TwitterWB } from '@/components/ui/Icons/TwitterWB'

const BannerFollowDefender = () => {
  return (
    <section className="bg-defendrBg w-full mt-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-defendrRed rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
          {/* Logo */}
          <div className="shrink-0">
            <Image
              priority
              alt="DEFENDR"
              className="h-8 sm:h-10 w-auto"
              height={50}
              src="/assets/brandassets/logo2.png"
              width={100}
            />
          </div>

          {/* Content */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white/90 text-sm leading-snug max-w-2xl font-poppins">
              Follow DEFENDR for updates on exclusive tournaments and prizes
            </p>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
              <Link
                aria-label="Follow DEFENDR on X"
                className="inline-flex items-center gap-2 bg-[#2AA9E0] hover:bg-[#2199ca] text-white font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors"
                href="https://x.com/DEFENDRcompany"
                rel="noopener noreferrer"
                target="_blank"
              >
                <TwitterWB className="h-4 w-4" />
                DEFENDR
              </Link>
              <Link
                aria-label="Follow DEFENDR on Facebook"
                className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#1668d6] text-white font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors"
                href="https://www.facebook.com/Defendr.gg"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FacebookIcon className="h-4 w-4" />
                DEFENDR
              </Link>
            </div>
          </div>

          {/* Character image — hidden on mobile */}
          <div className="shrink-0 h-28 md:h-32 hidden md:block">
            <Image
              alt="Banner Defender"
              className="z-50 relative h-full scale-150 -translate-y-2.5"
              height={50}
              src={'/assets/images/fortniteStatus.svg'}
              width={200}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default BannerFollowDefender
