'use client'

// no local state needed after simplification

import CreateTournament from '@/components/organizations/Tournament/CreateTournament'
const CreateTournamentModel = () => {
  return (
    <CreateTournament
      action={() => {
        /* navigation handled inside component */
      }}
    />
  )
}

export default CreateTournamentModel
