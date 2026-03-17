import React from 'react'
import { cookies } from 'next/headers'

import PictureUploadServer from '@/components/ui/PictureUpload'

export default async function picturesUploadPage() {
  const cookieStore = await cookies()
  const userName = cookieStore.get('userName')?.value || 'User'
  const tournamentIdFromCookie = cookieStore.get('createdTournamentId')?.value || null

  return (
    <div className="h-screen bg-defendrBg">
      <PictureUploadServer
        tournamentIdFromServer={tournamentIdFromCookie}
        userNameFromServer={userName}
      />
    </div>
  )
}
