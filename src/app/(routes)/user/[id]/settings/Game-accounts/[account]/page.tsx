'use client'

import React from 'react'

import ConnectAccount from '@/components/user/settings/sidebarTabs/gameAccount/[account]/page'

interface PageProps {
  params: Promise<{
    id: string
    account: string
  }>
}

export default function AccountLinkingPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  return <ConnectAccount params={{ account: resolvedParams.account }} />
}
