'use client'
import { useState } from 'react'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

interface BioPromptProps {
  user: any
  onClose: () => void
  onSave: (bio: string, bio_url: string) => void
}

export const BioPrompt: React.FC<BioPromptProps> = ({ user, onClose, onSave }) => {
  const [bio, setBio] = useState(user?.user_bio || '')
  const [bio_url, setBioURL] = useState(user?.link_bio || '')

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#212529] p-6 rounded-lg w-[400px] shadow-lg flex flex-col gap-4">
        <Typo as="h3" fontFamily="poppins" fontVariant="p3">
          Add Your Bio
        </Typo>
        <textarea
          className="w-full p-3 rounded-lg bg-[#1a1d20] text-white border border-gray-600 resize-none 
focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
          placeholder="Write something about yourself..."
          rows={4}
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
        <input
          className="w-full p-2 rounded bg-[#2a2d31] text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
          placeholder="http://"
          type="url"
          value={bio_url}
          onChange={e => setBioURL(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <Button className="w-auto" label="Cancel" variant="contained-dark" onClick={onClose} />
          <Button
            className="w-auto"
            label="Save"
            variant="contained-dark"
            onClick={() => {
              setBio(bio)
              setBioURL(bio_url)
              onSave(bio, bio_url)
              onClose()
            }}
          />
        </div>
      </div>
    </div>
  )
}
