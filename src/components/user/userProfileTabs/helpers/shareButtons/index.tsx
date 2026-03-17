import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'next-share'
import React, { useState } from 'react'

import {
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  RedditIcon,
} from '@/components/team/helpers/icons'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  shareTitle: string
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl, shareTitle }) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen) {
    return null
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-semibold text-center mb-4 text-white">Share Team Profile</h3>

        <div className="flex flex-row gap-3 justify-center mb-4">
          <FacebookShareButton
            aria-label="Share on Facebook"
            className="bg-[#3b5998] text-white p-2 rounded-md hover:bg-[#324c81] transition-colors"
            quote={shareTitle}
            url={shareUrl}
          >
            <FacebookIcon />
          </FacebookShareButton>

          <WhatsappShareButton
            aria-label="Share on WhatsApp"
            className="bg-[#25D366] text-white p-2 rounded-md hover:bg-[#20b355] transition-colors"
            title={shareTitle}
            url={shareUrl}
          >
            <WhatsappIcon />
          </WhatsappShareButton>

          <TwitterShareButton
            aria-label="Share on Twitter"
            className="bg-[#1DA1F2] text-white p-2 rounded-md hover:bg-[#1a91da] transition-colors"
            title={shareTitle}
            url={shareUrl}
          >
            <TwitterIcon />
          </TwitterShareButton>

          <RedditShareButton
            aria-label="Share on Reddit"
            className="bg-[#FF4500] text-white p-2 rounded-md hover:bg-[#e03d00] transition-colors"
            title={shareTitle}
            url={shareUrl}
          >
            <RedditIcon />
          </RedditShareButton>
        </div>

        <button
          aria-label="Copy URL"
          className="w-full mb-2 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          onClick={handleCopyUrl}
        >
          {copied ? 'Copied!' : 'Copy URL'}
        </button>

        <button
          aria-label="Close share modal"
          className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default ShareModal
