'use client'

import Image from 'next/image'

import Download from '@/components/ui/Icons/Download'
import Typo from '@/components/ui/Typo'

const logos = [
  {
    image: '/assets/brandassets/logo1.png',
    text: 'Horizontal logo red version',
    downloadLink: '/assets/brandassets/logo1.png',
  },
  {
    image: '/assets/brandassets/logo2.png',
    text: 'Horizontal logo white version',
    downloadLink: '/assets/brandassets/logo2.png',
  },
  {
    image: '/assets/brandassets/logo3.png',
    text: 'Defendr Red coin logo',
    downloadLink: '/assets/brandassets/logo3.png',
  },
  {
    image: '/assets/brandassets/logo4.png',
    text: 'Defendr Coin logo',
    downloadLink: '/assets/brandassets/logo4.png',
  },
  {
    image: '/assets/brandassets/logo5.png',
    text: 'Defendr blue coin logo',
    downloadLink: '/assets/brandassets/logo5.png',
  },
]

export default function BrandAssets() {
  return (
    <main className="container mx-auto p-4 mt-[140px] flex flex-col items-center justify-center gap-6 *:text-center mb-24">
      <Typo as="h1" fontVariant="h1">
        Brand assets
      </Typo>

      <Typo as="p" className="text-white/70" fontFamily="poppins" fontVariant="p5">
        If you intend on using our name or brand assets,
        <br /> you will find assets on how to do so below.
      </Typo>

      <Typo as="h2" fontVariant="h2">
        Name
      </Typo>

      <Typo as="p" className="text-white/70" fontFamily="poppins" fontVariant="p5">
        This is how you write it correctly
      </Typo>

      <div className="flex gap-6">
        <div className="bg-gray-800 px-6 py-4 rounded-lg relative">
          DEFENDR
          <Image
            alt="right"
            className="absolute -left-2 -top-2"
            height={25}
            src="/assets/brandassets/icon-park-outline_correct.png"
            width={25}
          />
        </div>
        <div className="bg-gray-800 px-6 py-4 rounded-lg relative">
          DEFENDER
          <Image
            alt="wrong"
            className="absolute -left-2 -top-2"
            height={25}
            src="/assets/brandassets/ic_do-not-disturb.png"
            width={25}
          />
        </div>
      </div>

      <Typo as="h2" fontVariant="h2">
        Logos
      </Typo>

      <Typo as="p" className="text-white/70" fontFamily="poppins" fontVariant="p5">
        Our logo can go on a dark or a light background.
        <br /> Please do not alter the logo in any way.
      </Typo>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-14">
        {logos.slice(0, 2).map((logo, i) => (
          <div key={i} className="text-start">
            <div className="bg-gray-800 p-3 w-[280px] h-[140px] rounded-lg grid place-items-center overflow-hidden">
              <Image
                alt="logo"
                className="h-full object-contain"
                height={150}
                src={logo.image}
                width={150}
              />
            </div>
            <Typo
              as="p"
              className="text-white/70 p-1 py-2 px-4"
              fontFamily="poppins"
              fontVariant="p6"
            >
              {logo.text}
            </Typo>
            <a
              download
              className="flex items-center gap-2 text-white py-2 px-4 rounded-lg hover:bg-opacity-800 transition duration-300"
              href={logo.downloadLink}
            >
              <Download />
              <Typo as="span" fontVariant="p6">
                Download
              </Typo>
            </a>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-14">
        {logos.slice(2).map((logo, i) => (
          <div key={i} className="text-start">
            <div className="bg-gray-800 p-3 w-[280px] h-[140px] rounded-lg grid place-items-center overflow-hidden">
              <Image
                alt="logo"
                className="h-full object-contain"
                height={100}
                src={logo.image}
                width={100}
              />
            </div>
            <Typo
              as="p"
              className="text-white/70 p-1 py-2 px-4"
              fontFamily="poppins"
              fontVariant="p6"
            >
              {logo.text}
            </Typo>
            <a
              download
              className="flex items-center gap-2 text-white py-2 px-4 rounded-lg hover:bg-opacity-800 transition duration-300"
              href={logo.downloadLink}
            >
              <Download />
              <Typo as="span" fontVariant="p6">
                Download
              </Typo>
            </a>
          </div>
        ))}
      </div>

      <Typo as="h2" fontVariant="h2" className="mt-12">
        Colors
      </Typo>

      <Typo as="p" className="text-white/70" fontFamily="poppins" fontVariant="p5">
        Our brand colors.
      </Typo>

      <div className="flex flex-col gap-14 flex-wrap items-center justify-center">
        <div className="flex gap-14 flex-wrap items-center justify-center">
          <div className="text-2xl px-10 py-5 rounded-lg bg-defendrRed">#D62555</div>
          <div className="text-2xl px-10 py-5 rounded-lg bg-[#0038ED]">#0038ED</div>
          <div className="text-2xl px-10 py-5 rounded-lg bg-[#161616] border-2 border-defendrRed">
            #161616
          </div>
        </div>
        <div className="flex gap-14 flex-wrap items-center justify-center">
          <div className="text-2xl px-10 py-5 rounded-lg bg-[#212529]">#212529</div>
          <div className="text-2xl px-10 py-5 rounded-lg bg-[#343A40]">#343A40</div>
        </div>
      </div>

      <Typo as="h2" fontVariant="h2" className="mt-12">
        Typeface
      </Typo>

      <Typo as="h2" fontVariant="h2" fontFamily="poppins">
        Our current typeface is <span className="text-defendrRed">Popins.</span>
      </Typo>

      <a
        download
        className="flex items-center gap-2 bg-defendrRed text-white py-2 px-4 rounded-lg hover:bg-opacity-800 transition duration-300"
        href="/assets/brandassets/Zen-dots-font.zip"
      >
        <Download size={18} />
        <Typo as="span" fontVariant="p2">
          Download Typeface
        </Typo>
      </a>
    </main>
  )
}
