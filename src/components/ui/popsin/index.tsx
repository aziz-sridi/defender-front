import React, { FC, ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'

type PopsinSize = 'small' | 'medium' | 'large'

interface PopsinProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children?: ReactNode
  className?: string
  overlayClassName?: string
  closeButtonLabel?: string
  backgroundColor?: string
  fontColor?: 'black' | 'white' | 'custom'
  customFontColor?: string
  size?: PopsinSize
}

const sizeClassMap: Record<PopsinSize, string> = {
  small: 'max-w-sm p-4',
  medium: 'max-w-md p-6',
  large: 'max-w-lg p-8',
}

const Popsin: FC<PopsinProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  overlayClassName,
  closeButtonLabel = '✕',
  backgroundColor = '#fff',
  fontColor = 'black',
  customFontColor,
  size = 'medium',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const textColor =
    fontColor === 'custom' && customFontColor
      ? customFontColor
      : fontColor === 'white'
        ? '#ffffff'
        : '#000000'

  // Generate unique id for aria-labelledby if title exists
  const titleId = title ? 'popsin-title' : undefined

  return React.createElement(
    'div',
    {
      className: cn(
        'fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/40',
        overlayClassName,
      ),
      onClick: onClose,
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': titleId,
      tabIndex: -1,
    },
    React.createElement(
      'div',
      {
        className: cn('rounded-xl shadow-xl w-full relative', sizeClassMap[size], className),
        style: { backgroundColor, color: textColor },
        onClick: e => e.stopPropagation(),
      },
      React.createElement(
        'button',
        {
          onClick: onClose,
          className: 'absolute top-2 right-3 text-xl text-gray-500 hover:text-black',
          'aria-label': 'Close popsin',
          type: 'button',
        },
        closeButtonLabel,
      ),
      title &&
        React.createElement('h2', { className: 'text-xl font-semibold mb-4', id: titleId }, title),
      children,
    ),
  )
}

export default Popsin
