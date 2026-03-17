'use client'

import Button from '@/components/ui/Button'

interface TournamentStepsProps {
  steps: string[]
  currentStep: number
  onStepClick: (step: number) => void
}

export const TournamentSteps = ({ steps, currentStep, onStepClick }: TournamentStepsProps) => {
  return (
    <div className="flex space-x-2">
      {steps.map((step, index) => (
        <Button
          key={step}
          label={step}
          size="xxs"
          variant={index === currentStep ? 'contained-red' : 'outlined-grey'}
          onClick={() => onStepClick(index)}
        />
      ))}
    </div>
  )
}
