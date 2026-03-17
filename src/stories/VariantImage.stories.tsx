import type { Meta, StoryObj } from '@storybook/react'

import { VariantImage } from '@/components/ui/VariantImage'

const meta = {
  title: 'Components/VariantImage',
  component: VariantImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'rounded', 'circle', 'bordered', 'shadowed', 'highlighted'],
    },
  },
} satisfies Meta<typeof VariantImage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/seed/picsum/200/300',
    alt: 'Default Image',
    variant: 'default',
  },
}

export const Rounded: Story = {
  args: {
    ...Default.args,
    variant: 'rounded',
  },
}

export const Circle: Story = {
  args: {
    ...Default.args,
    variant: 'circle',
  },
}

export const Bordered: Story = {
  args: {
    ...Default.args,
    variant: 'bordered',
  },
}

export const Shadowed: Story = {
  args: {
    ...Default.args,
    variant: 'shadowed',
  },
}

export const Highlighted: Story = {
  args: {
    ...Default.args,
    variant: 'highlighted',
  },
}
