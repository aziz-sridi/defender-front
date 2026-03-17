'use client'
import { useState } from 'react'
import { CircleQuestionMark, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import {
  EmptyHeart,
  FullHeart,
  HalfHeart,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  DiscordIcon,
  YoutubeIcon,
} from '@/components/user/userProfileTabs/constants'
import { TeamContainer } from '@/components/user/userProfileTabs/helpers/TeamContainer'
import Button from '@/components/ui/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { updateProfile } from '@/services/userService'
import AddSocialMediaModal from '@/components/user/userProfileTabs/helpers/addSocialMedia'
import { BioPrompt } from '@/components/user/userProfileTabs/helpers/addBio'

export const UserInfoCard: React.FC<{
  isUserProfile: boolean
  membership: any
  teams: any[]
  user: any
  userId: string
}> = ({ isUserProfile, userId, user, membership, teams }) => {
  const router = useRouter()
  const [propBio, showBioPropmt] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localUser, setLocalUser] = useState(user)
  const platforms = ['twitter', 'facebook', 'instagram', 'discord', 'youtube']
  const existingPlatforms = Object.keys(user?.socialMediaLinks || {}).filter(
    platform => user?.socialMediaLinks[platform],
  )
  const missingPlatforms = platforms.filter(platform => !existingPlatforms.includes(platform))

  const saveNewBio = async (bio: string, bio_url: string) => {
    const formdata = new FormData()
    formdata.append('user_bio', bio)
    formdata.append('link_bio', bio_url)

    try {
      await updateProfile(formdata)
      toast.success('Bio saved')

      //Update UI immediately
      setLocalUser((prev: any) => ({
        ...prev,
        user_bio: bio,
        link_bio: bio_url,
      }))
    } catch (error) {
      toast.error('Error occurred while saving bio, please try again')
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-[19px] bg-[#212529] p-5 w-full">
      {/* Section header */}
      <Typo as="p" fontFamily="poppins" fontVariant="p3" className="font-semibold text-white">
        Infos
      </Typo>

      {/* Souls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Typo as="p" fontFamily="poppins" fontVariant="p4" className="text-gray-300">
            Souls Remaining
          </Typo>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleQuestionMark className="text-[#b0b8c9] w-4 h-4 cursor-pointer ml-1" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <Typo as="p" className="font-bold" fontFamily="poppins" fontVariant="p5">
                  This Is Your Souls Remaining, 1 Soul = Participate For Free In Tournament That Its
                  Entry Fees Not Surpass 10dt
                </Typo>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-1">
          {(() => {
            const hearts = []
            const souls = user?.souls ?? 0
            const fullHearts = Math.floor(souls)
            const hasHalfHeart = souls % 1 !== 0
            const totalHearts = souls === 0 ? 1 : souls
            for (let i = 0; i < fullHearts; i++) hearts.push(<FullHeart key={`full-${i}`} />)
            if (hasHalfHeart) hearts.push(<HalfHeart key="half" />)
            while (hearts.length < totalHearts)
              hearts.push(<EmptyHeart key={`empty-${hearts.length}`} />)
            return hearts
          })()}
        </div>
      </div>

      {/* Membership */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Typo as="p" fontFamily="poppins" fontVariant="p4" className="text-gray-300">
            Membership
          </Typo>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleQuestionMark className="text-[#b0b8c9] w-4 h-4 cursor-pointer ml-1" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <Typo as="p" className="font-bold" fontFamily="poppins" fontVariant="p5">
                  This Is Your Defendr Membership That You Have Paid For It Contain Bonus Missions,
                  Quests, Coins, ...
                </Typo>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-xs font-semibold bg-defendrRed/20 text-defendrRed px-2 py-0.5 rounded-full">
          {membership?.membershipLevel?.name ?? 'Freemium'}
        </span>
      </div>

      <div className="h-px bg-white/10" />

      {/* About */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Typo as="p" fontFamily="poppins" fontVariant="p4" className="font-semibold">
            About
          </Typo>
          {isUserProfile &&
            (user?.user_bio?.trim() === 'No bio yet' ? (
              <Button
                className="w-auto"
                label="add bio"
                textClassName="text-red-800 text-xs"
                variant="text"
                onClick={() => showBioPropmt(true)}
              />
            ) : (
              <Button
                className="w-auto"
                label={<Pencil className="w-4 h-4 text-defendrRed" />}
                variant="text"
                onClick={() => showBioPropmt(true)}
              />
            ))}
        </div>
        <Typo
          as="p"
          color="ghostGrey"
          fontFamily="poppins"
          fontVariant="p4"
          className="wrap-break-word line-clamp-4 text-sm leading-relaxed"
        >
          {localUser?.user_bio}
        </Typo>
        {user?.link_bio && (
          <a
            className="underline cursor-pointer text-red-800 text-xs truncate block"
            href={user.link_bio}
          >
            {localUser.link_bio}
          </a>
        )}
      </div>

      {propBio && (
        <BioPrompt user={localUser} onClose={() => showBioPropmt(false)} onSave={saveNewBio} />
      )}

      <div className="h-px bg-white/10" />

      {/* Social */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Typo as="p" fontFamily="poppins" fontVariant="p4" className="font-semibold">
            Social
          </Typo>
          {isUserProfile &&
            (existingPlatforms.length > 0 ? (
              <Button
                className="w-auto"
                label={<Pencil className="w-4 h-4 text-defendrRed" />}
                variant="text"
                onClick={() => setIsModalOpen(true)}
              />
            ) : missingPlatforms.length > 0 ? (
              <Button
                className="w-auto"
                label="Add"
                textClassName="text-red-800 text-xs"
                variant="text"
                onClick={() => setIsModalOpen(true)}
              />
            ) : null)}
        </div>
        <div className="flex gap-3 flex-wrap">
          {user?.socialMediaLinks?.twitter && (
            <a href={user.socialMediaLinks.twitter} rel="noopener noreferrer" target="_blank">
              <TwitterIcon />
            </a>
          )}
          {user?.socialMediaLinks?.facebook && (
            <a href={user.socialMediaLinks.facebook} rel="noopener noreferrer" target="_blank">
              <FacebookIcon />
            </a>
          )}
          {user?.socialMediaLinks?.instagram && (
            <a href={user.socialMediaLinks.instagram} rel="noopener noreferrer" target="_blank">
              <InstagramIcon />
            </a>
          )}
          {user?.socialMediaLinks?.discord && (
            <a href={user.socialMediaLinks.discord} rel="noopener noreferrer" target="_blank">
              <DiscordIcon />
            </a>
          )}
          {user?.socialMediaLinks?.youtube && (
            <a href={user.socialMediaLinks.youtube} rel="noopener noreferrer" target="_blank">
              <YoutubeIcon />
            </a>
          )}
          {existingPlatforms.length === 0 && (
            <Typo as="p" fontFamily="poppins" fontVariant="p5" className="text-gray-500 text-xs">
              No social links added
            </Typo>
          )}
        </div>
        {isUserProfile && isModalOpen && (
          <AddSocialMediaModal
            platforms={platforms}
            socialMediaLinks={user?.socialMediaLinks}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>

      <div className="h-px bg-white/10" />

      {/* Teams */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Typo as="p" fontFamily="poppins" fontVariant="p4" className="font-semibold">
            Teams
          </Typo>
          {isUserProfile && teams.length === 0 && (
            <Button
              className="w-auto"
              label="Create"
              textClassName="text-red-800 text-xs"
              variant="text"
              onClick={() => router.push('/team/create')}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          {teams.length === 0 ? (
            <Typo as="p" fontFamily="poppins" fontVariant="p5" className="text-gray-500 text-xs">
              Not part of any team yet
            </Typo>
          ) : (
            teams.map(team => <TeamContainer key={team.id || team._id} team={team} />)
          )}
        </div>
      </div>
    </div>
  )
}
