import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import Button from '@/components/ui/Button'
import Warning from '@/components/ui/Icons/warning'

type Story = StoryObj<typeof Button>

export default {
  component: Button,
  title: 'components/Button',
  tags: ['autodocs'],
} as Meta

export const ContainedRed: Story = {
  args: {
    label: 'button',
    variant: 'contained-red',
  },
}

export const ContainedBlue: Story = {
  args: {
    label: 'button',
    variant: 'contained-blue',
  },
}

export const ContainedGhostRed: Story = {
  args: {
    label: 'button',
    variant: 'contained-ghostRed',
  },
}

export const ContainedGhostRedSelected: Story = {
  args: {
    label: 'button',
    variant: 'contained-ghostRed',
    selected: true,
  },
}

export const ContainedBlack: Story = {
  args: {
    label: 'button',
    variant: 'contained-black',
  },
}

export const ContainedGreen: Story = {
  args: {
    label: 'button',
    variant: 'contained-green',
  },
}

export const ContainedAllWhite: Story = {
  args: {
    label: 'button',
    variant: 'contained-all-white',
  },
}

export const ContainedWithoutOutlineGhostRed: Story = {
  args: {
    label: 'button',
    variant: 'containedWithoutOutline-ghostRed',
  },
}

export const OutlinedRed: Story = {
  args: {
    label: 'button',
    variant: 'outlined-red',
  },
}

export const OutlinedYellow: Story = {
  args: {
    label: 'button',
    variant: 'outlined-yellow',
  },
}

export const OutlinedGrey: Story = {
  args: {
    label: 'button',
    variant: 'outlined-grey',
  },
}

export const Text: Story = {
  args: {
    label: 'button',
    variant: 'text',
    icon: React.createElement(Warning),
  },
}

export const TextSelected: Story = {
  args: {
    label: 'button',
    variant: 'text',
    selected: true,
  },
}

export const SizeXXS: Story = {
  args: {
    label: 'XXS Button',
    variant: 'contained-blue',
    size: 'xxs',
  },
}

export const SizeXS: Story = {
  args: {
    label: 'XS Button',
    variant: 'contained-blue',
    size: 'xs',
  },
}

export const SizeS: Story = {
  args: {
    label: 'S Button',
    variant: 'contained-blue',
    size: 's',
  },
}

export const SizeM: Story = {
  args: {
    label: 'M Button',
    variant: 'contained-blue',
    size: 'm',
  },
}

export const SizeL: Story = {
  args: {
    label: 'L Button',
    variant: 'contained-blue',
    size: 'l',
  },
}

export const SizeXL: Story = {
  args: {
    label: 'XL Button',
    variant: 'contained-blue',
    size: 'xl',
  },
}

export const SizeXXL: Story = {
  args: {
    label: 'XXL Button',
    variant: 'contained-blue',
    size: 'xxl',
  },
}

export const WithIconRight: Story = {
  args: {
    label: 'With Icon Right',
    variant: 'contained-blue',
    icon: React.createElement(Warning),
    iconOrientation: 'right',
  },
}

export const WithIconLeft: Story = {
  args: {
    label: 'With Icon Left',
    variant: 'contained-blue',
    icon: React.createElement(Warning),
    iconOrientation: 'left',
  },
}

export const OnlyIcon: Story = {
  args: {
    variant: 'contained-blue',
    icon: React.createElement(Warning),
  },
}

export const DisabledButton: Story = {
  args: {
    label: 'Disabled Button',
    variant: 'contained-blue',
    disabled: true,
  },
}

export const LinkButton: Story = {
  args: {
    label: 'Link Button',
    variant: 'contained-blue',
    href: '#',
  },
}
