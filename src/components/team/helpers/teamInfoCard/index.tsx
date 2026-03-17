import { Twitter, Instagram, Facebook, Mail, Share } from 'lucide-react'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import getBadgeIcon from '@/lib/BadgeIcon'

interface TeamInfoCardProps {
  isUserTeam: boolean
  currentTab: string
  team: any
  onContactTeam?: () => void
  onShareProfile?: () => void
}

const TeamInfoCard: React.FC<TeamInfoCardProps> = ({
  isUserTeam,
  currentTab,
  team,
  onContactTeam,
  onShareProfile,
}) => {
  const badges = ['bronze', 'silver', 'gold', 'trophy', 'bronze', 'silver', 'gold', 'trophy']

  return (
    <div
      className={`w-full text-white bg-[#212529] rounded-[19px] p-6 font-poppins
    ${currentTab !== 'overview' ? 'hidden sm:block md:block' : 'block'}`}
    >
      <div className="mb-6">
        <Typo as="h2" className="md:text-lg text-sm mb-4 tracking-wider" fontFamily="poppins">
          Team info
        </Typo>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Typo as="span" className="text-gray-300 text-sm">
              Location
            </Typo>
            <div className="flex items-center gap-2">
              <Typo as="span" className="text-right text-sm">
                {team?.country || 'No location provided'}
              </Typo>
            </div>
          </div>
          <div className="flex justify-between">
            <Typo as="span" className="text-gray-300 text-sm">
              Founded
            </Typo>
            <Typo as="span" className="text-right text-sm">
              {new Date(team.datecreation || team.createdAt)
                .toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
                .replace(',', '')}
            </Typo>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Typo as="span" className="text-gray-300 text-sm">
              Website
            </Typo>
            <Typo
              as="span"
              className="text-right text-sm break-words sm:max-w-[15ch] md:max-w-full"
            >
              {team?.website || 'No website provided'}
            </Typo>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Typo as="h2" className="text-lg mb-4 tracking-wider" fontFamily="poppins">
          Social
        </Typo>
        <div className="flex gap-3">
          {team?.socialMedia && Object.values(team.socialMedia).every(value => !value) && (
            <Typo as="span" className="text-gray-400 text-sm">
              No social links available
            </Typo>
          )}
          {team?.socialMedia?.twitter && (
            <a
              className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
              href={team.socialMedia.twitter}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Twitter size={20} />
            </a>
          )}
          {team?.socialMedia?.instagram && (
            <a
              className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
              href={team.socialMedia.instagram}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Instagram size={20} />
            </a>
          )}
          {team?.socialMedia?.facebook && (
            <a
              className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
              href={team.socialMedia.facebook}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Facebook size={20} />
            </a>
          )}
          {team?.socialMedia?.email && (
            <a
              className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
              href={`mailto:${team.socialMedia.email}`}
            >
              <Mail size={20} />
            </a>
          )}
        </div>
      </div>

      <div className="mb-6">
        <Typo as="h2" className="text-lg mb-4 tracking-wider" fontFamily="poppins">
          Badges
        </Typo>
        <div className="grid grid-cols-4 gap-2">
          <Typo className="text-gray-400 text-sm" fontFamily="poppins">
            No Badges found
          </Typo>
        </div>
      </div>

      <div className="mb-6">
        <Typo as="h2" className="text-lg mb-2 tracking-wider" fontFamily="poppins">
          Quick Stats
        </Typo>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Typo className="text-xs text-gray-400 " fontFamily="poppins">
              wins
            </Typo>
            <Typo className="text-xs font-poppins ps-1">{team?.wins}</Typo>
          </div>
          <div className="space-y-2">
            <Typo className="text-xs text-gray-400 " fontFamily="poppins">
              Tournament won
            </Typo>
            <Typo className="text-xs ps-1" fontFamily="poppins">
              {team?.tournamentsWon || 0}
            </Typo>
          </div>
          <div className="space-y-2">
            <Typo className="text-xs text-gray-400" fontFamily="poppins">
              losses
            </Typo>
            <Typo className="text-xs ps-1" fontFamily="poppins">
              {team?.losses}
            </Typo>
          </div>
          <div className="space-y-2">
            <Typo className="text-xs text-gray-400 " fontFamily="poppins">
              Total Prize Money
            </Typo>
            <Typo className="text-xs ps-1 " fontFamily="poppins">
              $ {(team?.totalPrizeMoney || 0).toLocaleString('en-US')}
            </Typo>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 place-items-center">
        {!isUserTeam && (
          <Button
            className="btn-defendr-grey font-poppins w-auto min-w-0"
            icon={<Mail className="text-white" size={25} />}
            iconOrientation="left"
            label="Contact Team"
            size="s"
            textClassName="text-white text-sm"
            variant="outlined-grey"
            onClick={onContactTeam}
          />
        )}
        <Button
          className="btn-defendr-grey font-poppins border-white w-auto min-w-0"
          icon={<Share className="text-white" size={25} />}
          iconOrientation="left"
          label="Share Profile"
          size="s"
          textClassName="text-white text-sm"
          variant="outlined-grey"
          onClick={onShareProfile}
        />
      </div>
    </div>
  )
}

export default TeamInfoCard
