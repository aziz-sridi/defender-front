import { Meta, StoryObj } from '@storybook/react'

import Typo from '@/components/ui/Typo'

type Story = StoryObj<typeof Typo>

export default {
  component: Typo,
  title: 'components/Typo',
  tags: ['autodocs'],
} as Meta

export const H1: Story = {
  name: 'Header 1',
  args: {
    as: 'h1',
    fontVariant: 'h1',
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}

export const H2: Story = {
  name: 'Header 2',
  args: {
    as: 'h2',
    fontVariant: 'h2',
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}

export const H3: Story = {
  name: 'Header 3',
  args: {
    as: 'h3',
    fontVariant: 'h3',
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}

export const H4: Story = {
  name: 'Header 4',
  args: {
    as: 'h4',
    fontVariant: 'h4',
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}

export const H5: Story = {
  name: 'Header 5',
  args: {
    as: 'h5',
    fontVariant: 'h5',
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}
