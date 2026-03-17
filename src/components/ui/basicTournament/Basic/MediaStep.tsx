'use client'

import { Upload, Trash2 } from 'lucide-react'

import Button from '@/components/ui/Button'
import { TournamentData } from '@/components/ui/basicTournament/TournamentCreator'

interface MediaStepProps {
  data: TournamentData
  updateData: (updates: Partial<TournamentData>) => void
  onBack: () => void
}

export const MediaStep = ({ data, updateData, onBack }: MediaStepProps) => {
  const handleImageUpload = (type: 'background' | 'thumbnail') => {
    console.log(`Upload ${type} image`)
  }

  const handleImageRemove = (type: 'background' | 'thumbnail') => {
    if (type === 'background') {
      updateData({ backgroundImage: null })
    } else {
      updateData({ thumbnailImage: null })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Tournament Images</h3>
        <p className="text-xs text-defendrGrey">
          Upload images to make your tournament stand out. A good background image and thumbnail
          will attract more participants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Background Image */}
        <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-6">
          <div className="text-center space-y-4">
            <h4 className="font-medium">Background Image</h4>

            <div className="border-2 border-dashed border-tournament-border rounded-lg h-32 flex items-center justify-center bg-tournament-border/20">
              <div className="text-center">
                <div className="w-12 h-12 bg-tournament-accent rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">🖼️</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                icon={<Upload className="w-4 h-4" />}
                iconOrientation="left"
                label="Upload new Background"
                size="s"
                variant="outlined-grey"
                onClick={() => handleImageUpload('background')}
              />

              <Button
                icon={<Trash2 className="w-3 h-3" />}
                iconOrientation="left"
                label="Remove Background"
                size="s"
                variant="contained-red"
                onClick={() => handleImageRemove('background')}
              />
            </div>

            <p className="text-xs text-defendrGrey">
              Recommended: 1200x300px, Max 5MB.
              <br />
              Formats: JPG, PNG.
            </p>
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-6">
          <div className="text-center space-y-4">
            <h4 className="font-medium text-white">Thumbnail Image</h4>

            <div className="border-2 border-dashed border-defendrGrey rounded-lg h-32 flex items-center justify-center bg-defendrGrey/20">
              <div className="text-center">
                <div className="w-12 h-12 bg-defendrRed rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">🖼️</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                icon={<Upload className="w-4 h-4" />}
                iconOrientation="left"
                label="Upload new Thumbnail"
                size="s"
                variant="outlined-grey"
                onClick={() => handleImageUpload('thumbnail')}
              />

              <Button
                icon={<Trash2 className="w-3 h-3" />}
                iconOrientation="left"
                label="Remove Thumbnail"
                size="s"
                variant="contained-red"
                onClick={() => handleImageRemove('thumbnail')}
              />
            </div>

            <p className="text-xs text-defendrGrey">
              Recommended: 500x300px, Max 5MB.
              <br />
              Formats: JPG, PNG.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button label="Back" size="s" variant="outlined-grey" onClick={onBack} />
        <Button label="Create Tournament" size="s" variant="contained-red" />
      </div>
    </div>
  )
}
