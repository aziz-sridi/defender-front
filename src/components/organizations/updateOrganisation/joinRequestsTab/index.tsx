'use client'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

export default function JoinRequestsTab() {
  const handleApprove = (userId: string) => {
    toast.success(`User ${userId} approved!`)
  }

  const handleReject = (userId: string) => {
    toast.error(`User ${userId} rejected.`)
  }

  // const requests = [
  //   {
  //     id: '1',
  //     username: 'Krat0_s',
  //     role: 'Manager',
  //     message:
  //       'I would like to join Nexus Gaming because I believe my skills and dedication would be a great fit for your organization. I’ve been following your teams for years and would love to contribute to your success.',
  //     avatar: '/path/to/avatar.jpg',
  //   },
  //   {
  //     id: '2',
  //     username: 'Krat0_s',
  //     role: 'Manager',
  //     message:
  //       'I would like to join Nexus Gaming because I believe my skills and dedication would be a great fit for your organization. I’ve been following your teams for years and would love to contribute to your success.',
  //     avatar: '/path/to/avatar.jpg',
  //   },
  // ] // Replace with real data when you have it

  const requests: any[] = [] // Replace with real data

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col gap-6 max-w-7xl pb-10 mx-auto relative">
        <div className="bg-[#212529] rounded-xl p-7 sm:p-10 flex flex-col gap-6">
          <Typo as="p" className="text-gray-400">
            No join requests found.
          </Typo>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#212529] rounded-2xl flex flex-col p-10 gap-6">
      <div className="flex flex-col gap-1">
        <Typo as="h1" className="text-lg" color="white" fontFamily="poppins" fontVariant="h3">
          Join Requests
        </Typo>
        <Typo className="text-gray-500 text-sm md:text-[17px] mt-2" fontFamily="poppins">
          Review and manage requests to join your organization
        </Typo>
      </div>

      {requests.map(request => (
        <div
          key={request.id}
          className="bg-[#1f2327] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4 flex-grow">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Typo
                  as="h4"
                  className="text-lg"
                  color="white"
                  fontFamily="poppins"
                  fontVariant="h4"
                >
                  {request.username}
                </Typo>
                <span className="bg-[#312f31] text-gray-400 text-xs px-2 py-1 rounded-full font-poppins">
                  {request.role}
                </span>
              </div>
              <Typo className="text-gray-400 text-sm md:text-base mt-2" fontFamily="poppins">
                {request.message}
              </Typo>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white font-poppins text-sm w-full md:w-auto"
              icon={<Check className="w-4 h-4 text-white" />}
              iconOrientation="left"
              label="Approve"
              variant="contained-red"
              onClick={() => handleApprove(request.id)}
            />
            <Button
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-poppins text-sm w-full md:w-auto"
              icon={<X className="w-4 h-4 text-white" />}
              iconOrientation="left"
              label="Reject"
              variant="outlined-red"
              onClick={() => handleReject(request.id)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
