import React from 'react'

interface PlatformFormProps {
  platform: string
  formData: any
  onInputChange: (field: string, value: string) => void
  displayName: string
}

export default function PlatformForm({
  platform,
  formData,
  onInputChange,
  displayName,
}: PlatformFormProps) {
  const inputClasses =
    'w-full p-3 bg-[#302F31] text-white rounded-lg border border-gray-600 focus:border-defendrRed focus:outline-none'

  const renderTwoFields = (
    field1: string,
    label1: string,
    field2: string,
    label2: string,
    placeholder1: string,
    placeholder2: string,
  ) => (
    <div className="space-y-6">
      <div>
        <label className="block text-white mb-2 font-semibold">{label1}</label>
        <input
          className={inputClasses}
          placeholder={placeholder1}
          value={formData[field1] || ''}
          onChange={e => onInputChange(field1, e.target.value)}
        />
      </div>
      <div>
        <label className="block text-white mb-2 font-semibold">{label2}</label>
        <input
          className={inputClasses}
          placeholder={placeholder2}
          value={formData[field2] || ''}
          onChange={e => onInputChange(field2, e.target.value)}
        />
      </div>
    </div>
  )

  switch (platform) {
    case 'psn':
      return renderTwoFields(
        'nickname',
        'PSN Nickname',
        'confirmNickname',
        'Confirm PSN Nickname',
        'Enter your PSN nickname',
        'Confirm your PSN nickname',
      )

    case 'xbox':
      return renderTwoFields(
        'gamertag',
        'Xbox Gamertag',
        'confirmGamertag',
        'Confirm Gamertag',
        'Enter your Xbox Gamertag',
        'Confirm your Xbox Gamertag',
      )

    case 'battlenet':
      return renderTwoFields(
        'battletag',
        'BattleTag',
        'confirmBattletag',
        'Confirm BattleTag',
        'Enter your BattleTag (e.g., Player#1234)',
        'Confirm your BattleTag',
      )

    case 'riot':
      return renderTwoFields(
        'riotId',
        'Riot ID',
        'tagline',
        'Tagline',
        'Enter your Riot ID',
        'Enter your tagline (e.g., #NA1)',
      )

    case 'discord':
      return renderTwoFields(
        'discordUsername',
        'Discord Username',
        'confirmDiscordUsername',
        'Confirm Discord Username',
        'Enter your Discord username',
        'Confirm your Discord username',
      )

    default:
      return (
        <div>
          <label className="block text-white mb-2 font-semibold">Username</label>
          <input
            className={inputClasses}
            placeholder={`Enter your ${displayName} username`}
            value={formData.username || ''}
            onChange={e => onInputChange('username', e.target.value)}
          />
        </div>
      )
  }
}
