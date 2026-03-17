'use client' // Error boundaries must be Client Components

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Typo from '@/components/ui/Typo'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="w-full h-screen relative flexCenter flex-col gap-32 overflow-hidden">
      {/* Background image with black blur overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          fill
          priority
          alt="Error background"
          className="object-cover"
          src="/assets/cloud_13468096.png"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>
      <div className="flexCenter flex-col gap-5 z-10">
        <Typo as="h2" fontVariant="h2">
          OOPS !
        </Typo>
        <Typo as="h1" fontVariant="h1">
          500
        </Typo>
        <Typo as="p" fontVariant="p2">
          Internal Server Error
        </Typo>
        <Button
          className="px-4 py-2 rounded-lg flexCenter defendrButtonHover"
          label="Try again"
          size="xl"
          type="button"
          variant="contained-red"
          onClick={reset}
        />
      </div>
      <Link
        className="bg-defendrRed px-8 py-2 rounded-lg flexCenter"
        href="mailto:Contact@defendr.gg"
        target="_blank"
      >
        <Tag
          color="defendrRed"
          text="Contact@defendr.gg"
          textColor="#FFFFFF"
          textSize="large"
          variant="filled"
        />
      </Link>
    </section>
  )
}
