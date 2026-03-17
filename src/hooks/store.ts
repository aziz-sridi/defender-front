import { create } from 'zustand'

type aboutButtonType = {
  aboutButton: string
  changeAboutButton: any
}

export const useStoreAboutButton = create<aboutButtonType>(set => ({
  aboutButton: 'about',
  changeAboutButton: (newTour: string) => set({ aboutButton: newTour }),
}))
