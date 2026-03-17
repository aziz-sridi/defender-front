'use client'
import { useRef, useState, useCallback, useEffect } from 'react'

/**
 * Hook for handling drag-to-scroll and fullscreen functionality
 * Provides handlers, state, and ref for implementing draggable scroll behavior with fullscreen support
 *
 * @returns Object containing ref, handlers, fullscreen state, and fullscreen toggle
 */
export const useBracketContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const fullscreenContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (fullscreenContainerRef.current) {
        fullscreenContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      }
    } else {
      document.exitFullscreen()
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === fullscreenContainerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [fullscreenContainerRef])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      setIsDragging(true)
      containerRef.current.classList.add('cursor-grabbing')
      setStartX(e.clientX)
      setStartY(e.clientY)
      setScrollLeft(containerRef.current.scrollLeft)
      // Store page scroll position for Y-axis
      setScrollTop(
        isFullscreen && fullscreenContainerRef.current
          ? fullscreenContainerRef.current.scrollTop
          : window.scrollY,
      )
    },
    [isFullscreen],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return
      e.preventDefault()
      const walkX = e.clientX - startX
      const walkY = e.clientY - startY

      // Scroll container horizontally
      containerRef.current.scrollLeft = scrollLeft - walkX

      // Scroll page vertically for smoother experience
      if (isFullscreen && fullscreenContainerRef.current) {
        fullscreenContainerRef.current.scrollTop = scrollTop - walkY
      } else {
        window.scrollTo(window.scrollX, scrollTop - walkY)
      }
    },
    [isDragging, startX, startY, scrollLeft, scrollTop, isFullscreen],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.classList.remove('cursor-grabbing')
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.classList.remove('cursor-grabbing')
    }
  }, [])

  return {
    containerRef,
    fullscreenContainerRef,
    isDragging,
    isFullscreen,
    toggleFullscreen,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  }
}
