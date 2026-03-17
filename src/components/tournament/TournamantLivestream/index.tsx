'use client'
// components/TournamentLiveStreaming.tsx
import { useState } from 'react'
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'
import { Tournament, StreamingPlatform } from '@/types/tournamentType'

interface TournamentLiveStreamingProps {
  tournament: Tournament
  activePlatformName?: string
}

// Function to convert streaming URLs to proper embed URLs
const convertToEmbedUrl = (url: string, platform?: string): string => {
  if (!url) return url

  // If it's already an embed URL, return as is
  if (url.includes('/embed/') || url.includes('embed')) {
    return url
  }

  // Convert platform-specific URLs to embed format
  if (platform) {
    const lowerPlatform = platform.toLowerCase()

    // Twitch
    if (lowerPlatform.includes('twitch')) {
      if (url.includes('twitch.tv/')) {
        const channel = url.split('twitch.tv/')[1]?.split('/')[0]
        if (channel) {
          return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`
        }
      }
    }

    // YouTube
    if (lowerPlatform.includes('youtube') || lowerPlatform.includes('youtu.be')) {
      let videoId = ''

      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0]
      } else if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0]
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0]
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`
      }
    }

    // Facebook
    if (lowerPlatform.includes('facebook')) {
      if (url.includes('facebook.com/')) {
        const videoId = url.match(/videos\/(\d+)/)?.[1]
        if (videoId) {
          return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`
        }
      }
    }

    // Kick - check both platform name and URL
    if (lowerPlatform.includes('kick') || url.includes('kick.com/')) {
      if (url.includes('kick.com/')) {
        const username = url.split('kick.com/')[1]?.split('/')[0]
        if (username) {
          // Clean username (remove any query params)
          const cleanUsername = username.split('?')[0].split('#')[0]

          // Try different Kick embed formats
          // Format 1: Direct player embed
          return `https://player.kick.com/${cleanUsername}`
        }
      }
    }
  }

  // For unknown platforms, try to return the URL as is
  return url
}

const TournamentLiveStreaming = ({
  tournament,
  activePlatformName,
}: TournamentLiveStreamingProps) => {
  const [iframeError, setIframeError] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const streaming: StreamingPlatform[] = tournament.streaming || []

  if (streaming.length === 0) {
    return (
      <Typo as="p" className="italic" color="grey" fontVariant="p4">
        No live streaming platforms available for this tournament.
      </Typo>
    )
  }

  const activePlatform = streaming.find(p => p.platform === activePlatformName) || streaming[0]
  const embedUrl = activePlatform.link
    ? convertToEmbedUrl(activePlatform.link, activePlatform.platform)
    : null

  // Debug logging
  console.log('TournamentLiveStreaming Debug:', {
    streaming,
    activePlatform,
    embedUrl,
    originalUrl: activePlatform.link,
    platform: activePlatform.platform,
  })

  const handleIframeError = () => {
    setIframeError(true)
    console.error('Iframe error for:', activePlatform.platform, embedUrl)

    // For Kick, show fallback immediately since it often blocks iframes
    if (
      activePlatform.platform?.toLowerCase().includes('kick') ||
      activePlatform.link?.includes('kick.com/')
    ) {
      setShowFallback(true)
    }
  }

  const handleIframeLoad = () => {
    setIframeError(false)
    setShowFallback(false)
    console.log('Iframe loaded successfully for:', activePlatform.platform)
  }

  return (
    <div className="mt-5">
      {embedUrl && !iframeError && !showFallback ? (
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-2xl transition-all duration-300 hover:shadow-red-500/20 hover:border-red-500/30">
            {/* Loading overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center z-10 transition-opacity duration-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <Typo as="p" className="text-white" fontVariant="p4">
                  Loading {activePlatform.platform} stream...
                </Typo>
              </div>
            </div>

            {/* Stream container */}
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <iframe
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                frameBorder="0"
                height="100%"
                src={embedUrl}
                title={activePlatform.platform}
                width="100%"
                onError={handleIframeError}
                onLoad={handleIframeLoad}
                loading="lazy"
                scrolling="no"
                className="absolute inset-0 w-full h-full transition-opacity duration-500"
                style={{ opacity: 0 }}
                onLoadCapture={e => {
                  // Hide loading overlay when iframe loads
                  const overlay = e.currentTarget.parentElement?.parentElement?.querySelector(
                    '.absolute.inset-0.bg-gradient-to-br',
                  )
                  if (overlay) {
                    ;(overlay as HTMLElement).style.opacity = '0'
                  }
                  // Show iframe
                  e.currentTarget.style.opacity = '1'
                }}
              />
            </div>

            {/* Platform indicator */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
              <Typo as="span" className="text-white text-sm font-medium" fontVariant="p5">
                {activePlatform.platform}
              </Typo>
            </div>
          </div>
        </div>
      ) : iframeError || showFallback ? (
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-center min-h-[400px] p-8">
              <div className="text-center max-w-md">
                {/* Error icon */}
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>

                <Typo as="h3" className="text-red-400 mb-3" fontVariant="p2" fontWeight="bold">
                  {activePlatform.platform?.toLowerCase().includes('kick') ||
                  activePlatform.link?.includes('kick.com/')
                    ? 'Kick Stream Unavailable'
                    : 'Stream Unavailable'}
                </Typo>

                <Typo as="p" className="text-gray-300 mb-6" fontVariant="p4">
                  {activePlatform.platform?.toLowerCase().includes('kick') ||
                  activePlatform.link?.includes('kick.com/')
                    ? 'Kick blocks iframe embedding for security reasons. Click below to watch the stream directly on Kick.'
                    : 'The streaming platform may not support embedding or the link is invalid.'}
                </Typo>

                {activePlatform.link && (
                  <a
                    href={activePlatform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button
                      label={`Watch on ${activePlatform.platform}`}
                      size="m"
                      variant="contained-red"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Typo as="p" className="italic" color="grey" fontVariant="p4">
          No link available for {activePlatform.platform}.
        </Typo>
      )}
    </div>
  )
}

export default TournamentLiveStreaming
