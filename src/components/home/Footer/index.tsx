import Image from 'next/image'
import Link from 'next/link'

import { DiscordWB } from '@/components/ui/Icons/DiscordWB'
import { FacebookWB } from '@/components/ui/Icons/FacebookWB'
import { InstagramWB } from '@/components/ui/Icons/InstgramWB'
import { TwitchWB } from '@/components/ui/Icons/TwitchWB'
import { TwitterWB } from '@/components/ui/Icons/TwitterWB'
import { YoutubeWB } from '@/components/ui/Icons/YoutubeWB'
import Typo from '@/components/ui/Typo'

const socialMedia = [
  {
    link: 'https://www.twitch.tv/defendr_gg',
    icon: TwitchWB,
    target: '_blank',
  },
  {
    link: 'https://www.instagram.com/defendr.gg/',
    icon: InstagramWB,
    target: '_blank',
  },
  {
    link: 'https://discord.com/invite/6SYEx7QhkQ',
    icon: DiscordWB,
    target: '_blank',
  },
  {
    link: 'https://www.youtube.com/@DEFENDREsports',
    icon: YoutubeWB,
    target: '_blank',
  },
  {
    link: 'https://www.facebook.com/Defendr.gg',
    icon: FacebookWB,
    target: '_blank',
  },
  {
    link: 'https://x.com/DEFENDRcompany',
    icon: TwitterWB,
    target: '_blank',
  },
]
const sections = [
  {
    link: '/about',
    title: 'about',
  },
  {
    link: '/contact',
    title: 'contact us',
  },
  {
    link: '/jobs',
    title: 'jobs',
  },
  {
    link: '/brand-assets',
    title: 'brand assets',
  },
  {
    link: '/faq',
    title: 'faq',
  },
]
const aboutWebsite = [
  {
    link: '/privacy',
    title: 'Privacy Policy',
  },
  {
    link: '/terms',
    title: 'Terms of Service',
  },
  {
    link: '/faq',
    title: 'FAQ',
  },
  {
    link: '/about',
    title: 'Our Team',
  },
  {
    link: '',
    title: 'Cookie Settings',
  },
]

const Footer = () => {
  return (
    <footer className="relative z-10 px-6 py-8 mt-12 lg:px-12 lg:py-10 border-t border-gray-800">
      <nav className="flex flex-col-reverse gap-y-12 lg:flex-row items-center justify-between px-4 lg:px-6">
        <ul className="flex gap-6 lg:gap-12 text-sm lg:text-base items-center justify-center flex-wrap font-poppins">
          {sections.map((s, j) => (
            <li key={j}>
              <Link className="capitalize transition-colors duration-200 font-medium" href={s.link}>
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="relative">
          <div className="font-poppins bg-gray-800 border-2 border-defendrRed rounded-lg p-3 pl-10 w-[180px] text-white flex items-center gap-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">🌏︎</span>
            <span className="ml-6">English</span>
          </div>
        </div>
      </nav>
      <hr className="my-8 border-gray-700" />
      <article className="mb-6 lg:flex items-center justify-between hidden px-4 lg:px-6">
        <div className="flex gap-8 items-center">
          <div className="relative">
            <Image
              alt="logo"
              height={80}
              src={
                'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Frame%201171275156.png'
              }
              width={260}
              className="drop-shadow-lg"
            />
          </div>
          <div className="text-sm flex flex-col gap-4">
            <Typo as="p" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
              © 2026 Copyright{' '}
              <Typo
                as="span"
                className="text-[var(--Primary-Color-Color,#D62555)]"
                color="red"
                fontVariant="p5"
              >
                Defendr
              </Typo>{' '}
              . All Rights Reserved
            </Typo>
            <ul className="flex gap-6 lg:gap-8">
              {aboutWebsite.map((s, j) => (
                <li key={j}>
                  <Link
                    className="capitalize text-sm font-poppins transition-colors duration-200"
                    href={s.link}
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav>
          <ul className="flex gap-4 lg:gap-6">
            {socialMedia.map((s, j) => {
              const Icon = s.icon
              return (
                <li key={j}>
                  <Link
                    className="capitalize hover:scale-110 hover:rotate-3 transition-all duration-300 ease-in-out"
                    href={s.link}
                    target={s.target}
                  >
                    <Icon className="size-8 hover:text-defendrRed transition-all duration-300 ease-in-out" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </article>
      <article className="mb-6 flex flex-col gap-12 items-center justify-center lg:hidden text-center font-poppins px-4">
        <div className="relative">
          <Image
            alt="logo"
            height={80}
            src={
              'https://pub-ac0646938950482d9e37f5be48f6653b.r2.dev/defendr_elements/Frame%201171275156.png'
            }
            width={260}
            className="drop-shadow-lg"
          />
        </div>
        <ul className="grid grid-cols-3 gap-8">
          {socialMedia.map((s, j) => {
            const Icon = s.icon
            return (
              <li key={j}>
                <Link
                  className="capitalize font-poppins hover:scale-110 hover:rotate-3 transition-all duration-300 ease-in-out"
                  href={s.link}
                >
                  <Icon className="size-10 hover:text-defendrRed transition-all duration-300 ease-in-out" />
                </Link>
              </li>
            )
          })}
        </ul>
        <Typo as="p" className="text-sm" color="ghostGrey" fontFamily="poppins" fontVariant="p5">
          © 2026 Copyright{' '}
          <Typo
            as="span"
            className="text-[var(--Primary-Color-Color,#D62555)]"
            color="red"
            fontVariant="p5"
          >
            Defendr
          </Typo>{' '}
          . All Rights Reserved
        </Typo>
        <ul className="flex items-center justify-center gap-6 lg:gap-8 flex-wrap">
          {aboutWebsite.map((s, j) => (
            <li key={j}>
              <Link
                className="capitalize text-sm font-poppins transition-colors duration-200"
                href={s.link}
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </footer>
  )
}

export default Footer
