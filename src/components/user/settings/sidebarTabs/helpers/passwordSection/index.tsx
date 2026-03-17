'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'
import { updatePassword } from '@/services/userService'
import { ApiError } from '@/lib/api/errors'

export function PasswordSection() {
  const [editPassword, setEditPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const validateNewPassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*()?"{}|<>]/.test(password)
    const isLongEnough = password.length >= 8
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!hasNumber) {
      return 'Password must contain at least one number'
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character'
    }
    if (!isLongEnough) {
      return 'Password must be at least 8 characters long'
    }
    return ''
  }

  const validateConfirmPassword = (confirm: string, newPass: string) =>
    confirm !== newPass ? 'Passwords do not match' : ''

  const isSaveButtonEnabled = () =>
    currentPassword &&
    newPassword &&
    confirmPassword &&
    !currentPasswordError &&
    !newPasswordError &&
    !confirmPasswordError

  useEffect(() => {
    if (confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, newPassword))
    }
  }, [newPassword, confirmPassword])

  const onSaveChanges = async () => {
    try {
      const response = await updatePassword({ oldPassword: currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setEditPassword(false)
      toast.success(response.message)
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        toast.error('Wrong old password')
      } else {
        toast.error('Failed to update password')
      }
    }
  }

  const onCancelChangePassword = () => {
    setEditPassword(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return editPassword ? (
    <>
      <Typo
        as="p"
        className="font-regualr text-sm md:text-lg"
        color="white"
        fontFamily="poppins"
        fontVariant="p1"
        fontWeight="regular"
      >
        Password
      </Typo>
      <div className="space-y-4">
        <div className="relative">
          <input
            className="bg-[#2F2C2F] text-white font-poppins placeholder-white/70 rounded-full px-4 py-3 w-full outline-none pr-10"
            placeholder="Current Password"
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={e => {
              setCurrentPassword(e.target.value)
              setCurrentPasswordError(e.target.value ? '' : 'Current password is required')
            }}
          />
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
            {showCurrentPassword ? (
              <Eye
                className="h-5 w-5 text-white"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            ) : (
              <EyeOff
                className="h-5 w-5 text-white"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            )}
          </span>
        </div>
        {currentPasswordError && <p className="text-red-500 text-xs">{currentPasswordError}</p>}

        <div className="relative">
          <input
            className="bg-[#2F2C2F] text-white font-poppins placeholder-white/70 rounded-full px-4 py-3 w-full outline-none pr-10"
            placeholder="New Password"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={e => {
              setNewPassword(e.target.value)
              setNewPasswordError(validateNewPassword(e.target.value))
            }}
          />
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
            {showNewPassword ? (
              <Eye
                className="h-5 w-5 text-white"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            ) : (
              <EyeOff
                className="h-5 w-5 text-white"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            )}
          </span>
        </div>
        {newPasswordError && <p className="text-red-500 text-xs">{newPasswordError}</p>}

        <div className="relative">
          <input
            className="bg-[#2F2C2F] text-white font-poppins placeholder-white/70 rounded-full px-4 py-3 w-full outline-none pr-10"
            placeholder="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value)
              setConfirmPasswordError(validateConfirmPassword(e.target.value, newPassword))
            }}
          />
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
            {showConfirmPassword ? (
              <Eye
                className="h-5 w-5 text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            ) : (
              <EyeOff
                className="h-5 w-5 text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          </span>
        </div>
        {confirmPasswordError && <p className="text-red-500 text-xs">{confirmPasswordError}</p>}
      </div>

      <div className="flex gap-4 pt-2">
        <Button
          className="w-auto rounded-md "
          disabled={!isSaveButtonEnabled()}
          label="SAVE"
          textClassName="font-poppins"
          variant="contained-red"
          onClick={onSaveChanges}
        />
        <Button
          className="w-auto rounded-md "
          label="CANCEL"
          textClassName="font-poppins"
          variant="contained-dark"
          onClick={onCancelChangePassword}
        />
      </div>
    </>
  ) : (
    <div className="flex flex-col items-start md:flex-row justify-between">
      <div className="flex flex-col gap-1">
        <Typo
          as="p"
          className="font-semibold text-sm md:text-lg"
          color="white"
          fontFamily="poppins"
          fontVariant="p1"
          fontWeight="regular"
        >
          Password
        </Typo>
        <Typo as="p" className="text-xs text-gray-400 ps-1 tracking-widest">
          ********
        </Typo>
      </div>
      <button onClick={() => setEditPassword(true)}>
        <Typo
          as="p"
          className="cursor-pointer font-semibold text-xs md:text-sm"
          color="red"
          fontFamily="poppins"
          fontVariant="p1"
          fontWeight="regular"
        >
          Edit
        </Typo>
      </button>
    </div>
  )
}
