import { Calendar, MapPin, Users, Trophy, CheckCircle } from 'lucide-react'

import { TournamentData } from '@/components/ui/basicTournament/TournamentCreator'
interface TournamentPreviewProps {
  data: TournamentData
}

export const TournamentPreview = ({ data }: TournamentPreviewProps) => {
  return (
    <div className="bg-defendrLightBlack border border-defendrGrey rounded-lg p-6 sticky top-8">
      <h3 className="text-xl font-bold mb-6 text-white">Tournament Preview</h3>

      {/* Tournament Banner */}
      <div className="bg-defendrGrey rounded-lg h-32 mb-6 flex items-center justify-center">
        <span className="text-defendrGrey">Tournament Banner</span>
      </div>

      {/* Tournament Title */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-1">{data.title || 'Tournament Title'}</h4>
        <div className="flex items-center gap-2 text-sm text-defendrGrey">
          <Trophy className="w-4 h-4" />
          <span>{data.game || 'Game'}</span>
        </div>
      </div>

      {/* Tournament Details */}
      <div className="space-y-4 mb-6">
        <h5 className="font-semibold text-white">Tournament Details</h5>

        <div className="space-y-2 text-sm text-white">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-defendrRed" />
            <span>{data.startDate || 'Start Date & Time'}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-defendrRed" />
            <span>
              {data.locationType === 'online'
                ? 'Online Tournament'
                : data.locationType === 'physical'
                  ? 'Physical Location'
                  : 'Hybrid (Online & Physical)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-defendrRed" />
            <span>
              {data.participationType === 'team'
                ? `Team Tournament (${data.teamMembers} + ${data.substitutes} subs)`
                : 'Solo Tournament'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-defendrRed" />
            <span>
              Max: {data.maxEnrollment} {data.participationType === 'team' ? 'teams' : 'players'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-defendrRed" />
            <span>{data.bracketType || 'Bracket Type'}</span>
          </div>
        </div>
      </div>

      {/* Participant Requirements */}
      <div className="space-y-4">
        <h5 className="font-semibold text-white">Participant Requirements</h5>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${data.requireGameAccount ? 'bg-defendrRed' : 'bg-defendrGrey'}`}
            />
            <span className="text-sm text-white">
              Game Account - {data.requireGameAccount ? 'Required' : 'Not Required'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${data.requireDiscord ? 'bg-defendrRed' : 'bg-defendrGrey'}`}
            />
            <span className="text-sm text-white">
              Discord {data.requireDiscord ? 'Required' : 'Not Required'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-defendrRed" />
            <span className="text-sm text-white">
              Region Restriction: {data.countryRestriction}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-defendrRed" />
            <span className="text-sm text-white">
              Team Size: {data.teamMembers} players per team
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-defendrRed" />
            <span className="text-sm text-white">Substitutes: {data.substitutes} allowed</span>
          </div>
        </div>

        {/* Registration Status Cards */}
        <div className="space-y-3 mt-6">
          <div className="bg-defendrGrey rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-defendrRed" />
              <span className="text-sm font-medium text-white">Registration Status</span>
            </div>
            <span className="text-xs text-defendrGrey">
              Registration will open immediately after tournament is created
            </span>
          </div>

          <div className="bg-defendrGrey rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-defendrRed" />
              <span className="text-sm font-medium text-white">Check-in Status</span>
            </div>
            <span className="text-xs text-defendrGrey">
              Check-in will be available before tournament starts
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
