import React, { FunctionComponent } from 'react'
import HelperText from '@components/HelperText'
import Typo, { FontColor } from '@components/Typo'

export type TextFieldProps = {
  label?: React.ReactNode
  error?: string
  required?: boolean
  children?: React.ReactNode
  labelColor?: FontColor
  onClick?: () => void
}

const InputWrapper: FunctionComponent<TextFieldProps> = ({
  error,
  label,
  children,
  labelColor,
  required,
  onClick,
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex flex-row">
          <Typo as="h3" className="py-3" color={labelColor} fontVariant="p5">
            {label}
          </Typo>
          {required && <span className="text-[#FB6D10] mt-2 ml-1">*</span>}
        </div>
      )}
      <div className="flex items-center relative" onClick={onClick}>
        {children}
      </div>
      {error && <HelperText>{error}</HelperText>}
    </div>
  )
}

export default InputWrapper
