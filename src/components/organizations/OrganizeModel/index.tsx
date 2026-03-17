'use client'

import { useState } from 'react'

import { OrganizationProvider } from '@/components/context/OrganizationContext'
import OrganizationType from '@/components/organizations/OrganizationType'
import OrganizeNavsInfo from '@/components/organizations/OrganizeNavsInfo'
import OrganizeSuccess from '@/components/organizations/OrganizeSuccess'

interface OrganizationProps {
  action: () => void
}

const OrganizeModel = ({ action }: OrganizationProps) => {
  const [counter, setCounter] = useState(0)

  const redenderComponent = () => {
    switch (counter) {
      case 0:
        return <OrganizationType action={() => setCounter(counter + 1)} />
      case 1:
        return <OrganizeNavsInfo action={() => setCounter(counter + 1)} />
      case 2:
        return <OrganizeSuccess action={action} />
    }
  }

  return <OrganizationProvider>{redenderComponent()}</OrganizationProvider>
}

export default OrganizeModel
