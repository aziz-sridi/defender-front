'use client'
import '@/app/globals.css'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

import { getAllGames } from '@/services/gameService'
import { getGameImageUrl } from '@/utils/imageUrlSanitizer'

const Participate = () => {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollX, setScrollX] = useState(0)
  const [scrollWidth, setScrollWidth] = useState(0)
  const [clientWidth, setClientWidth] = useState(0)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getAllGames()
        // Handle response that might be an array or an object with a data property
        const gamesArray = Array.isArray(response) ? response : response?.data || []
        // Sort games by release date (most recent first)
        const sortedGames = gamesArray.sort((a: any, b: any) => {
          const dateA = new Date(a.releaseDate || a.createdAt || 0)
          const dateB = new Date(b.releaseDate || b.createdAt || 0)
          return dateB.getTime() - dateA.getTime()
        })
        setGames(sortedGames)
      } catch (error) {
        console.error('Failed to fetch games', error)
        setGames([])
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  useEffect(() => {
    const updateSizes = () => {
      if (scrollRef.current) {
        setScrollWidth(scrollRef.current.scrollWidth)
        setClientWidth(scrollRef.current.clientWidth)
      }
    }
    updateSizes()
    window.addEventListener('resize', updateSizes)
    return () => window.removeEventListener('resize', updateSizes)
  }, [games])

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollX(scrollRef.current.scrollLeft)
    }
  }

  const handleScrollBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scrollRef.current && scrollWidth > clientWidth) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const maxScroll = scrollWidth - clientWidth
      const targetScroll = percentage * maxScroll

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      })
    }
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      })
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white">
        Loading games...
      </section>
    )
  }

  const progressWidth =
    clientWidth && scrollWidth ? (scrollX / (scrollWidth - clientWidth)) * 100 : 0

  return (
    <section className="min-h-screen container mx-auto p-2 pt-28">
      <h2 className="text-2xl font-bold text-white px-2 my-6 font-poppins">Games Included testing change</h2>

      <div className="relative w-full group">
        {/* Enhanced Scroll Buttons with better UX */}
        {scrollWidth > clientWidth && (
          <>
            <button
              onClick={scrollLeft}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-sm hover:from-black/90 hover:to-black/70 text-white p-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 ${
                scrollX <= 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-100'
              }`}
              disabled={scrollX <= 0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-gradient-to-l from-black/80 to-black/60 backdrop-blur-sm hover:from-black/90 hover:to-black/70 text-white p-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 ${
                scrollX >= scrollWidth - clientWidth
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-100 hover:opacity-100'
              }`}
              disabled={scrollX >= scrollWidth - clientWidth}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Enhanced Games Container with hover effects */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide py-6 px-2"
          onScroll={handleScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {games.map((game, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[220px] sm:w-[300px] h-[280px] sm:h-[420px] rounded-xl overflow-hidden group/game cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
            >
              <div className="relative w-full h-full">
                <Image
                  alt={game.name}
                  className="object-cover w-full h-full rounded-xl transition-all duration-300 group-hover/game:brightness-110"
                  height={420}
                  src={getGameImageUrl(game)}
                  width={300}
                />
                {/* Game name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-b-xl">
                  <h3 className="text-white font-poppins font-semibold text-lg truncate">
                    {game.name}
                  </h3>
                </div>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-defendrRed/20 to-transparent opacity-0 group-hover/game:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Premium Scrollbar Design */}
        {scrollWidth > clientWidth && (
          <div className="mt-6 px-4">
            {/* Main scrollbar container */}
            <div className="relative">
              <div
                className="relative w-full h-3 bg-gray-800/50 backdrop-blur-sm rounded-full cursor-pointer hover:bg-gray-700/50 transition-all duration-300 shadow-inner"
                onClick={handleScrollBarClick}
              >
                {/* Progress track with glow effect */}
                <div
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r from-defendrRed via-red-500 to-red-400 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{
                    width: `${progressWidth}%`,
                    boxShadow:
                      '0 0 20px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                />

                {/* Animated scroll thumb */}
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-xl transition-all duration-500 ease-out hover:scale-125 hover:shadow-2xl"
                  style={{
                    left: `calc(${progressWidth}% - 12px)`,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(239, 68, 68, 0.2)',
                  }}
                />

                {/* Scroll indicators */}
                <div className="absolute -top-8 left-0 right-0 flex justify-between text-xs text-gray-400">
                  <span className="bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    {Math.round(progressWidth)}% viewed
                  </span>
                  <span className="bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    {games.length} games
                  </span>
                </div>
              </div>

              {/* Interactive hint */}
              <div className="flex justify-center mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/30 px-4 py-2 rounded-full backdrop-blur-sm">
                  <svg
                    className="w-4 h-4 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  <span>Drag or click to navigate</span>
                  <svg
                    className="w-4 h-4 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xl lg:text-4xl p-16 font-poppins font-bold">
        Play and organize competitions in <br />
        the most popular games.
      </p>
    </section>
  )
}

export default Participate
