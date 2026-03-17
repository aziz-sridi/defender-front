'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Inputs'
import Typo from '@/components/ui/Typo'
import { updateTeam } from '@/services/teamService'

interface GeneralSectionProps {
  team: any
  teamId: string
}

export default function GeneralSection({ team, teamId }: GeneralSectionProps) {
  const [teamData, setTeamData] = useState<any>()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [foundedYear, setFoundedYear] = useState('')

  useEffect(() => {
    //console.log('team updated:', team)
    if (team) {
      setTeamData(team)
      setName(team?.name || '')
      setDescription(team?.description || '')
      setFoundedYear(
        new Date(team?.datecreation).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      )
    } else {
      setTeamData(null)
      setName('')
      setDescription('')
      setFoundedYear('')
    }
  }, [teamId])
  const onSaveChanges = async () => {
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      const teamId = teamData?._id
      console.log('teamId from save changes general section', teamId)
      const response = await updateTeam(teamId, formData)
      console.log('response from save changes general section', response)
      toast.success('Team updated successfully')
    } catch (error) {
      console.error('Error updating team general section:', error)
      toast.error('error updating team')
    }
  }
  const onCancelChanges = () => {
    console.log('Cancel changes clicked')
    setName(teamData?.name || '')
    setDescription(teamData?.description || '')
    setFoundedYear(
      new Date(teamData?.datecreation).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    )
  }

  return (
    <div className="bg-[#212529] rounded-xl mx-auto p-7 sm:p-10 flex flex-col gap-4 max-w-7xl">
      <div className="sm:flex gap-4 absolute right-10 top-36">
        <Button
          className="font-poppins hidden w-auto pb-10 sm:block"
          label="cancel"
          variant="contained-black"
          onClick={onCancelChanges}
        />
        <Button
          className="font-poppins w-auto hidden pb-10 sm:block"
          label="save changes"
          variant="contained-red"
          onClick={onSaveChanges}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Typo
          as="p"
          className="text-xs sm:text-sm md:text-lg"
          color="white"
          fontFamily="poppins"
          fontVariant="p1"
          fontWeight="regular"
        >
          Team Name
        </Typo>
        <Input
          className="text-white  rounded-3xl bg-[rgb(49_47_49)] text-xs sm:text-sm md:text-lg"
          type="text"
          value={name}
          onChange={setName}
        />
        <Typo as="p" className="text-gray-500 text-xs">
          Full name of your Team
        </Typo>
      </div>
      <div className="flex flex-col gap-2">
        <Typo className="text-gray-500 text-sm md:text-[17px]" fontFamily="poppins">
          Ex : Dominating the competitive scene since 2020
        </Typo>
      </div>
      <div className="flex flex-col gap-2">
        <Typo
          as="p"
          className="text-xs sm:text-sm md:text-lg"
          color="white"
          fontFamily="poppins"
          fontVariant="p1"
          fontWeight="regular"
        >
          Description
        </Typo>
        <Input
          className=" text-white rounded-3xl bg-[rgb(49_47_49)] text-xs sm:text-sm md:text-lg"
          type="text"
          value={description}
          onChange={setDescription}
        />
        <Typo className="text-gray-500 text-sm md:text-[17px]" fontFamily="poppins">
          A brief description of your team (max 500 characters).
        </Typo>
      </div>
      <div className="flex flex-col gap-2">
        <Typo
          as="p"
          className="text-xs sm:text-sm md:text-lg"
          color="white"
          fontFamily="poppins"
          fontVariant="p1"
          fontWeight="regular"
        >
          Founded Year
        </Typo>
        <Input
          disabled
          readOnly
          className="border-none text-white rounded-3xl bg-[rgb(49_47_49)] text-xs sm:text-sm md:text-lg"
          type="text"
          value={foundedYear}
          onChange={setFoundedYear}
        />
        <Typo className="text-gray-500 text-sm md:text-[17px]" fontFamily="poppins">
          The year your team was established
        </Typo>
      </div>
      <div className="flex gap-4 mt-10 justify-center items-center sm:hidden pb-10">
        <Button
          className="font-poppins w-auto"
          label="cancel"
          variant="contained-dark"
          onClick={onCancelChanges}
        />
        <Button
          className="font-poppins w-auto"
          label="save changes"
          variant="contained-red"
          onClick={onSaveChanges}
        />
      </div>
    </div>
  )
}
