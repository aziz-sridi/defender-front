import type { Preview } from '@storybook/react'
import '@/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

export default preview
