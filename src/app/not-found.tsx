'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Typo from '@/components/ui/Typo'

const NotFound = () => {
  const pathname = usePathname()

  return (
    <>
      <section className="w-full flexCenter flex-col lg:flex-row gap-20 h-[85vh]">
        <div className="flexCenter flex-col gap-5">
          <Typo as="h1" fontVariant="h1">
            Not Found
          </Typo>
          <Typo as="p" fontVariant="p2">
            We couldn't find the page you are looking for
          </Typo>
          <Link
            className="w-1/2 md:w-1/3 flexCenter gap-3 bg-defendrRed px-4 py-2 rounded-[25.44px]"
            href={`${pathname.startsWith('/defendr') ? '/defendr' : '/'}`}
            style={{ background: 'var(--Primary-Color-Color, #D62555)' }}
          >
            <Typo as="span" fontVariant="p4">
              Go back
            </Typo>
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 8 8 12 12 16" />
              <line x1="16" x2="8" y1="12" y2="12" />
            </svg>
          </Link>
        </div>
        <Image
          alt="404 Defendr"
          className="size-96 object-contain"
          height={200}
          src="/assets/errorResponse/404.svg"
          width={200}
        />
      </section>
    </>
  )
}

export default NotFound
