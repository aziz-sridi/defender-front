'use client'

import React, { createContext, useContext } from 'react'

const SetupLayoutContext = createContext<boolean>(false)

export const useSetupLayout = () => useContext(SetupLayoutContext)

export function SetupLayoutProvider({ children }: { children: React.ReactNode }) {
  return <SetupLayoutContext.Provider value>{children}</SetupLayoutContext.Provider>
}
