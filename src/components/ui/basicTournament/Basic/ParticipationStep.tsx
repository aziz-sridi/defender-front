'use client'

import Button from '@/components/ui/Button'
import { TournamentData } from '@/components/ui/basicTournament/TournamentCreator'
import FormSelect from '@/components/ui/FormSelect'

interface ParticipationStepProps {
  data: TournamentData
  updateData: (updates: Partial<TournamentData>) => void
  onNext: () => void
  onBack: () => void
}

export const ParticipationStep = ({ data, updateData, onNext, onBack }: ParticipationStepProps) => {
  return (
    <div className="space-y-6">
      {/* Participation Type */}
      <FormSelect
        label="Participation Type"
        options={[
          { value: 'team', label: 'Team Tournament' },
          { value: 'solo', label: 'Solo Tournament' },
        ]}
        placeholder="Select participation type"
        value={data.participationType}
        onChange={value => updateData({ participationType: value as 'team' | 'solo' })}
      />

      {/* Team-specific settings */}
      {data.participationType === 'team' && (
        <>
          <FormSelect
            label="Number of Team Members"
            options={[2, 3, 4, 5, 6].map(num => ({
              value: num.toString(),
              label: num.toString(),
            }))}
            placeholder="Select team size"
            value={data.teamMembers.toString()}
            onChange={value => updateData({ teamMembers: parseInt(value) })}
          />
          <p className="text-xs text-defendrGrey">Number of players required per team</p>

          <FormSelect
            label="Number of substitutes"
            options={[0, 1, 2, 3, 4].map(num => ({
              value: num.toString(),
              label: `${num} ${num === 1 ? 'Substitute' : 'Substitutes'}`,
            }))}
            placeholder="Select substitutes count"
            value={data.substitutes.toString()}
            onChange={value => updateData({ substitutes: parseInt(value) })}
          />
          <p className="text-xs text-defendrGrey">Optional additional players allowed per team</p>
        </>
      )}

      {/* Solo tournament settings */}
      {data.participationType === 'solo' && (
        <div className="space-y-2">
          <FormSelect
            label="Max Enrollment (Solo)"
            options={[8, 16, 32, 64, 128].map(num => ({
              value: num.toString(),
              label: `${num} Solo`,
            }))}
            placeholder="Select max enrollment"
            value={data.maxEnrollment.toString()}
            onChange={value => updateData({ maxEnrollment: parseInt(value) })}
          />
          <p className="text-xs text-defendrGrey">Maximum number of teams that can participate</p>
        </div>
      )}

      {/* Max Enrollment for Teams */}
      {data.participationType === 'team' && (
        <div className="space-y-2">
          <FormSelect
            label="Max Enrollment (Teams)"
            options={[4, 8, 16, 32, 64].map(num => ({
              value: num.toString(),
              label: `${num} Teams`,
            }))}
            placeholder="Select max teams"
            value={data.maxEnrollment.toString()}
            onChange={value => updateData({ maxEnrollment: parseInt(value) })}
          />
          <p className="text-xs text-defendrGrey">Maximum number of teams that can participate</p>
        </div>
      )}

      {/* Tournament Format */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white">Tournament Format</h3>

        <FormSelect
          label="Bracket type"
          options={[
            { value: 'Single Elimination', label: 'Single Elimination' },
            { value: 'Double Elimination', label: 'Double Elimination' },
            { value: 'Round Robin', label: 'Round Robin' },
            { value: 'Swiss', label: 'Swiss' },
          ]}
          placeholder="Select bracket type"
          value={data.bracketType}
          onChange={value => updateData({ bracketType: value })}
        />
        <p className="text-xs text-defendrGrey">
          Determines how matches will be structured throughout the tournament
        </p>

        <FormSelect
          label="Score Reporting Method"
          options={[
            { value: 'Self reporting by players', label: 'Self reporting by players' },
            { value: 'Admin reporting', label: 'Admin reporting' },
            { value: 'Automatic', label: 'Automatic' },
          ]}
          placeholder="Select score reporting method"
          value={data.scoreReporting}
          onChange={value => updateData({ scoreReporting: value })}
        />
        <p className="text-xs text-defendrGrey">How match results will be submitted and verified</p>
      </div>

      <div className="flex justify-between pt-6">
        <Button label="Back" size="s" variant="outlined-grey" onClick={onBack} />
        <Button label="Next : Requirement" size="s" variant="contained-red" onClick={onNext} />
      </div>
    </div>
  )
}
