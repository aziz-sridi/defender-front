import type { Meta, StoryObj } from '@storybook/react'

import SectionLayout from '@/components/SectionLayout'

const meta: Meta<typeof SectionLayout> = {
  title: 'Components/SectionLayout',
  component: SectionLayout,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof SectionLayout>

export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: args => {
    return (
      <SectionLayout {...args}>
        <div className="bg-blue h-full w-full min-h-screen py-2">
          <h1>This is where the content will go</h1>
        </div>
      </SectionLayout>
    )
  },
}

export const Full: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    sectionVariant: 'full',
  },
  render: args => {
    return (
      <SectionLayout {...args}>
        <div className="bg-blue h-full w-full min-h-screen py-2">
          <h1>This is where the content will go</h1>
        </div>
      </SectionLayout>
    )
  },
}
