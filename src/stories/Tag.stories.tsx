import type { Meta, StoryObj } from '@storybook/react'

import Tag from '@/components/ui/Tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  args: {
    text: 'Live',
    color: 'defendrRed',
    variant: 'filled',
    textSize: 'medium',
    textColor: '#FFFFFF',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      options: ['defendrRed', 'defendrBlue', 'defendrBeige'],
      control: { type: 'radio' },
    },
    variant: {
      options: ['filled', 'hollow'],
      control: { type: 'radio' },
    },
    textSize: {
      options: ['small', 'medium', 'large', 'xlarge'],
      control: { type: 'radio' },
    },
    textColor: {
      control: { type: 'color' },
    },
  },
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {}
export const SmallTag: Story = { args: { textSize: 'small' } }
export const LargeTag: Story = { args: { textSize: 'large' } }
export const XLargeTag: Story = { args: { textSize: 'xlarge' } }

export const BlueHollowLarge: Story = {
  args: { color: 'defendrBlue', variant: 'hollow', textSize: 'large', textColor: 'defendrBlue' },
}

export const GoldFilledCustomFont: Story = {
  args: { color: 'defendrBeige', variant: 'filled', textSize: 'xlarge' },
}

export const CustomTextColor: Story = {
  args: { color: 'defendrBeige', variant: 'hollow', textColor: 'defenderBeige' },
}
