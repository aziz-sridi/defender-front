'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

import '@/app/homePage.css'

import Participate from '@/components/home/Participate'
import States from '@/components/home/States'
import Vectory from '@/components/home/Vectory'
import Rightarrow from '@/components/ui/Icons/Rightarrow'
import Typo from '@/components/ui/Typo'
const LandingPage = () => {
  const usersCount = 5000
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <h1 className="hidden">GAMING</h1>

      <section className="p-1 h-[50vh] sm:h-screen overflow-hidden relative flexCenter gradientBg w-screen">
        <div className="-z-50 absolute w-full h-full">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover bg-bottom"
            crossOrigin="anonymous"
            height="240"
            preload="none"
            width="320"
          >
            <source
              src="https://ik.imagekit.io/fmrglows1/defendr/defendr.mp4?updatedAt=1722509058919"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="flexCenter flex-col gap-4 absolute bottom-20 z-49 left-1/2 -translate-x-1/2 scale-125">
          <Link
            className="group/button  scale-95 relative inline-flex items-center justify-center overflow-hidden rounded-md bg-defendrRed backdrop-blur-lg px-6 py-2 text-base font-poppins text-white transition-all duration-300 ease-in-out   hover:scale-105 hover:shadow-md hover:shadow-white/10"
            href={'/signup'}
          >
            <span className="text-lg uppercase font-poppins">Sign up</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
              <div className="relative h-full w-10 bg-white/30" />
            </div>
          </Link>
        </div>
      </section>

      <Participate />

      <section className="bg-defendrRed text-white min-h-[450px] pb-20 lg:pb-0 px-5">
        <div className="container mx-auto flex flex-col lg:flex-row">
          <div className="relative flex-1 flex items-end justify-start max-h-[450px]">
            <Image
              alt="omen"
              className="-translate-x-5 lg:translate-x-16 h-[120%] max-h-[550px] w-auto scale-[1.15] -translate-y-[8%] lg:scale-[1.2] lg:-translate-y-[10%] small:scale-100 small:-translate-y-0 max-w-screen"
              height={700}
              src="/assets/newHome/omen.png"
              width={700}
            />
            <Image
              alt="bracket"
              className="absolute w-[70%] md:w-[60%] right-0 top-1/2 -translate-y-[20%] -translate-x-2"
              height={700}
              src="/assets/newHome/bracket.png"
              width={700}
            />
          </div>
          <div className="flex-1 min-h-[300px] flex items-center justify-center flex-col gap-5 p-4">
            <Typo
              className="text-center text-3xl md:text-4xl xl:text-5xl font-bold"
              fontFamily="poppins"
              fontVariant="custom"
            >
              Tournament for <br className="hidden xl:block" /> everyone
            </Typo>
            <Typo
              className=" text-lg lg:text-xl text-center lg:text-start"
              fontFamily="poppins"
              fontVariant="custom"
            >
              Play, organize tournaments. <br />
              Free tournaments for players of all skill levels in <br />
              esports games.
            </Typo>
          </div>
        </div>
      </section>

      <section className=" text-white min-h-[450px] pb-20 lg:pb-0 px-10">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row">
          <div className="flex-1 min-h-[300px] flex items-center justify-center flex-col gap-5 p-4">
            <Typo
              className=" text-center text-3xl md:text-4xl xl:text-5xl font-bold"
              fontFamily="poppins"
              fontVariant="custom"
            >
              Claim your rank
            </Typo>
            <Typo
              className=" text-lg lg:text-xl text-center lg:text-start"
              fontFamily="poppins"
              fontVariant="custom"
            >
              Play matchmaking and tournaments to claim your tier and earn a place on the
              leaderboard - the official ranking on Defendr to win prizes and valuable
              opportunities.
            </Typo>
          </div>
          <div className="relative lg:top-4 flex-1 flex items-end justify-end max-h-[450px]">
            <Image
              alt="m1"
              className="-translate-x-5 h-auto max-h-[500px] w-auto scale-[1.1] -translate-y-[8%] small:scale-100 small:-translate-y-0 max-w-screen"
              height={867}
              src="/assets/newHome/m1.png"
              width={867}
            />
            <Image
              alt="m1-g"
              className="absolute w-[70%] md:w-[60%] left-0 top-1/2 -translate-y-1/2 -translate-x-2"
              height={867}
              src="/assets/newHome/m1-g.png"
              width={867}
            />
          </div>
        </div>
      </section>

      <section className="bg-defendrRed text-white min-h-[450px]">
        <div className="flex flex-col lg:flex-row">
          {/* Car image — flush to left screen edge */}
          <div className="relative flex-1 flex items-end justify-start max-h-[450px] lg:max-h-[500px]">
            <Image
              alt="car"
              className="h-[120%] max-h-[550px] w-auto scale-[1.2] -translate-y-[10%] small:scale-100 small:-translate-y-0"
              height={867}
              src="/assets/newHome/car.png"
              width={867}
            />
            {/* Stats card — responsive positioning */}
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-[20%] scale-[0.65] sm:scale-75 md:scale-100 origin-right bg-gray-800 rounded-lg max-w-[calc(100%-20px)] sm:max-w-none">
              <Vectory states={{ damage: 60113, KDA: '12/07/20', gold: 60986 }} team="Jixo" />
            </div>
          </div>
          <div className="flex-1 min-h-[300px] flex items-center justify-center flex-col gap-5 p-4 px-10">
            <Typo
              className="text-center text-3xl md:text-4xl xl:text-5xl font-bold"
              fontFamily="poppins"
              fontVariant="custom"
            >
              Track your stats
            </Typo>
            <Typo
              className=" text-lg lg:text-xl text-center lg:text-start"
              fontFamily="poppins"
              fontVariant="custom"
            >
              By playing more... Advanced stats let you track your progress as you climb through the
              leaderboard by playing tournament games with gamification values.
            </Typo>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-8 lg:py-0 px-10">
        <div className="lg:min-h-[550px] container mx-auto p-2 gap-14 lg:gap-0 md:p-0 flex flex-col lg:flex-row">
          <div className="flex-1 flex justify-center items-start flex-col gap-8 lg:gap-14 px-4 lg:px-0">
            <Typo
              className="text-3xl md:text-4xl lg:text-6xl font-bold "
              fontFamily="poppins"
              fontVariant="custom"
            >
              {"We're"} <br /> Trustworthy
            </Typo>
            <Typo
              className="lg:text-xxl text-lg lg:text-xl "
              fontFamily="poppins"
              fontVariant="custom"
            >
              Trusted by over {usersCount} gamers, developers and
              <br /> organizers
            </Typo>
            <a
              className="bg-defendrRed px-5 py-3 rounded-xl flex items-center gap-2 font-poppins"
              href="/about"
              rel="noopener noreferrer"
              style={{ background: 'var(--defendr-red)' } as React.CSSProperties}
              target="_blank"
            >
              About Us <Rightarrow />
            </a>
          </div>
          <div className="hidden lg:grid grid-cols-3 grid-rows-3 flex-1 p-8">
            {[...Array(9).fill(null)].map((_, i) => (
              <Image
                key={i}
                alt="img"
                className="item"
                height={100}
                src={`/assets/newHome/brands/${i + 1}.png`}
                style={{ '--position': i + 1 } as React.CSSProperties}
                width={250}
              />
            ))}
          </div>
          <div
            className="slider flex-2 lg:hidden"
            style={
              {
                '--width': '100px',
                '--height': '50px',
                '--quantity': 9,
              } as React.CSSProperties
            }
          >
            <div className="list">
              {[...Array(9).fill(null)].map((_, i) => (
                <Image
                  key={i}
                  alt="img"
                  className="item"
                  height={100}
                  src={`/assets/newHome/brands/${i + 1}.png`}
                  style={{ '--position': i + 1 } as React.CSSProperties}
                  width={250}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <States />

      {/* Scroll to top button */}
      <button
        aria-label="Back to top"
        onClick={scrollToTop}
        className={`fixed bottom-[4.5rem] right-4 sm:bottom-[5.5rem] sm:right-6 z-[59] w-10 h-10 rounded-full bg-[#232428] border border-white/10 flex items-center justify-center shadow-lg shadow-black/30 hover:bg-[#2a2d31] hover:border-white/20 hover:scale-110 transition-all duration-300 ${
          showScrollTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  )
}
export default LandingPage
