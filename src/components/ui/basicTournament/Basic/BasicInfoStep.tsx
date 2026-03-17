'use client'

import Button from '@/components/ui/Button'
import { TournamentData } from '@/components/ui/basicTournament/TournamentCreator'
import FormInput from '@/components/ui/FormInput'
import FormTextarea from '@/components/ui/FormTextarea'
import FormSelect from '@/components/ui/FormSelect'

interface BasicInfoStepProps {
  data: TournamentData
  updateData: (updates: Partial<TournamentData>) => void
  onNext: () => void
}

export const BasicInfoStep = ({ data, updateData, onNext }: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      {/* Tournament Title */}
      <FormInput
        label="Tournament Title"
        placeholder="Tournament Title"
        value={data.title}
        onChange={value => updateData({ title: value })}
      />

      {/* Game */}
      <FormSelect
        label="Game"
        options={[
          { value: 'valorant', label: 'Valorant' },
          { value: 'csgo', label: 'CS:GO' },
          { value: 'league', label: 'League of Legends' },
          { value: 'fortnite', label: 'Fortnite' },
          { value: 'apex', label: 'Apex Legends' },
        ]}
        placeholder="Select a game"
        value={data.game}
        onChange={value => updateData({ game: value })}
      />

      {/* Date and Time Row */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Start Date"
          placeholder=""
          type="date"
          value={data.startDate}
          onChange={value => updateData({ startDate: value })}
        />
        <FormInput
          label="Start Time"
          placeholder=""
          type="time"
          value={data.startTime}
          onChange={value => updateData({ startTime: value })}
        />
      </div>

      {/* Register Date and Time Row */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Register Date"
          placeholder=""
          type="date"
          value={data.registerDate}
          onChange={value => updateData({ registerDate: value })}
        />
        <FormInput
          label="Register Time"
          placeholder=""
          type="time"
          value={data.registerTime}
          onChange={value => updateData({ registerTime: value })}
        />
      </div>

      {/* Tournament Location */}
      <div className="space-y-4">
        <FormSelect
          label="Tournament Location"
          options={[
            { value: 'online', label: 'Online Tournament' },
            { value: 'physical', label: 'Physical Location' },
            { value: 'hybrid', label: 'Hybrid (Online & Physical)' },
          ]}
          placeholder="Select tournament location type"
          value={data.locationType}
          onChange={value =>
            updateData({ locationType: value as 'online' | 'physical' | 'hybrid' })
          }
        />
        <p className="text-xs text-defendrGrey">Set the location for your tournament</p>

        {data.locationType !== 'online' && (
          <div className="space-y-4 mt-4">
            <FormInput
              label="Enter Location Details"
              placeholder="Ex. (Discord: @Discord#123456)"
              value={data.locationDetails}
              onChange={value => updateData({ locationDetails: value })}
            />

            <FormTextarea
              label="Hybrid Format Details"
              placeholder="Provide Description about this process"
              value={data.locationDetails}
              onChange={value => updateData({ locationDetails: value })}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-6">
        <Button label="Next : Participation" size="s" variant="contained-red" onClick={onNext} />
      </div>
    </div>
  )
}
