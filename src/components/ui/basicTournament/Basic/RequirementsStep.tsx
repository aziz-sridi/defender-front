'use client'

import Button from '@/components/ui/Button'
import { TournamentData } from '@/components/ui/basicTournament/TournamentCreator'
import FormSelect from '@/components/ui/FormSelect'
import CustomToggleSwitch from '@/components/ui/CustomToggleSwitch'

interface RequirementsStepProps {
  data: TournamentData
  updateData: (updates: Partial<TournamentData>) => void
  onNext: () => void
  onBack: () => void
}

export const RequirementsStep = ({ data, updateData, onNext, onBack }: RequirementsStepProps) => {
  return (
    <div className="space-y-6">
      {/* Country Restriction */}
      <FormSelect
        label="Country Restriction"
        options={[
          { value: 'Global (No Restriction)', label: 'Global (No Restriction)' },
          { value: 'North America', label: 'North America' },
          { value: 'Europe', label: 'Europe' },
          { value: 'Asia', label: 'Asia' },
          { value: 'Oceania', label: 'Oceania' },
        ]}
        placeholder="Select country restriction"
        value={data.countryRestriction}
        onChange={value => updateData({ countryRestriction: value })}
      />
      <p className="text-xs text-defendrGrey">
        Limit participation to players from specific countries
      </p>

      {/* Game Account Connection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-white">Require Game Account Connection</h4>
            <p className="text-xs text-defendrGrey">
              Participants must connect their game account to register
            </p>
          </div>
          <CustomToggleSwitch
            checked={data.requireGameAccount}
            label=""
            onChange={checked => updateData({ requireGameAccount: checked })}
          />
        </div>
      </div>

      {/* Discord Connection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-white">Require Discord Connection</h4>
            <p className="text-xs text-defendrGrey">
              Participants must connect their Discord account to register
            </p>
          </div>
          <CustomToggleSwitch
            checked={data.requireDiscord}
            label=""
            onChange={checked => updateData({ requireDiscord: checked })}
          />
        </div>
      </div>

      {/* Discord Joining Button */}
      <div className="pt-4">
        <Button label="📞 Discord joining" size="xxl" variant="contained-blue" />
      </div>

      <div className="flex justify-between pt-6">
        <Button label="Back" size="s" variant="outlined-grey" onClick={onBack} />
        <Button label="Next : Media" size="s" variant="contained-red" onClick={onNext} />
      </div>
    </div>
  )
}
