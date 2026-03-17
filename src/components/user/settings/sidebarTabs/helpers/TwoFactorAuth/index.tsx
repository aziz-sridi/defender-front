'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import Typo from '@/components/ui/Typo'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import { disable2FA, generate2FA, verify2FA } from '@/services/userService'
import { OtpInput } from '@/components/user/settings/sidebarTabs/helpers/InputOTP'
import PasswordInput from '@/components/user/settings/sidebarTabs/helpers/passwordInput2FA'

export function TwoFactorSection({ user }: { user: any }) {
  const [editTwoFactorAuth, setEditTwoFactorAuth] = useState(false)
  const [Enable2FA, setEnable2FA] = useState(user?.is2FAEnabled ?? false)
  const [twoFAQr, setTwoFAQr] = useState<string | null>(null)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [password, setPassword] = useState('')

  const onEnable2FAF = async () => {
    try {
      const response = await generate2FA()
      setTwoFAQr(response.qrCode)
      setEditTwoFactorAuth(true)
    } catch {
      toast.error('Failed to generate 2FA secret')
    }
  }

  const onVerify2FAF = async () => {
    const token = otp.join('')
    if (token.length < 6) {
      return toast.error('Enter 6-digit OTP code')
    }
    try {
      await verify2FA({ token })
      setEnable2FA(true)
      setTwoFAQr(null)
      setOtp(Array(6).fill(''))
      setEditTwoFactorAuth(false)
      toast.success('2FA enabled successfully')
    } catch {
      toast.error('Invalid token, please try again')
    }
  }

  const onDisable2FAF = async () => {
    if (!password) {
      return toast.error('Please enter your password')
    }
    try {
      await disable2FA({ password })
      setEnable2FA(false)
      setEditTwoFactorAuth(false)
      setShowPasswordPrompt(false)
      setPassword('')
      toast.success('2FA disabled successfully')
    } catch {
      toast.error('Failed to disable 2FA')
    }
  }

  return (
    <div
      className={`flex ${
        editTwoFactorAuth
          ? 'flex-col gap-3'
          : 'flex-col gap-3 items-start md:flex-row md:justify-between'
      }`}
    >
      <div className="flex md:gap-2 flex-1">
        <Typo
          as="p"
          className="font-semibold text-sm md:text-lg"
          color="white"
          fontFamily="poppins"
          fontVariant="p1"
          fontWeight="regular"
        >
          Two Factor Authentication
        </Typo>
        <Tag
          color="defendrBlack"
          text={Enable2FA ? 'enabled' : 'disabled'}
          textSize="small"
          variant="filled"
        />
      </div>

      {editTwoFactorAuth ? (
        <div className="space-y-4 sm:bg-[#1E1F23] mt-5 sm:mt-0 sm:p-6 rounded-xl w-full sm:max-w-lg sm:mx-auto text-white font-poppins">
          {/* Instructions Section */}
          <div className="text-sm space-y-2">
            <Typo as="p" className="font-semibold text-base" fontFamily="poppins">
              Two-Factor Authentication
            </Typo>
            <Typo as="p" className="font-semibold" fontFamily="poppins" fontVariant="p4">
              Compatible to use with:
            </Typo>
            <ul className="list-disc space-y-2 ml-6">
              <li>
                <Typo as="p" className="text-gray-300" fontFamily="poppins" fontVariant="p5">
                  Authenticator app
                </Typo>
              </li>
              <li>
                <Typo as="p" className="text-gray-300" fontFamily="poppins" fontVariant="p5">
                  Back-up Codes
                </Typo>
              </li>
            </ul>

            <div className="mt-3">
              <Typo as="p" className="font-semibold" fontFamily="poppins" fontVariant="p4">
                Steps to enable:
              </Typo>
              <ol className="list-decimal font-poppins space-y-2 ml-6 mt-2">
                <li>
                  <Typo as="p" className="text-gray-300" fontFamily="poppins" fontVariant="p5">
                    Download and install an authenticator app.
                  </Typo>
                </li>
                {!Enable2FA && (
                  <li>
                    <Typo as="p" className="text-gray-300" fontFamily="poppins" fontVariant="p5">
                      Scan the QR code and enter the generated OTP code.
                    </Typo>
                  </li>
                )}
              </ol>
            </div>
          </div>

          {twoFAQr ? (
            <>
              <Typo
                as="p"
                className="text-xs sm:text-sm text-center font-semibold"
                fontFamily="poppins"
              >
                Scan QR Code with your authenticator app
              </Typo>
              <img alt="2FA QR Code" className="w-48 h-48 mx-auto" src={twoFAQr} />
              <OtpInput otp={otp} setOtp={setOtp} />
              <div className="flex gap-2 justify-center items-center mt-2">
                <Button
                  className="w-auto"
                  label="Verify"
                  textClassName="font-poppins"
                  variant="contained-red"
                  onClick={onVerify2FAF}
                />
                <Button
                  className="w-auto"
                  label="Cancel"
                  textClassName="font-poppins"
                  variant="contained-dark"
                  onClick={() => setEditTwoFactorAuth(false)}
                />
              </div>
            </>
          ) : !Enable2FA ? (
            <Button
              className="w-auto"
              label="TURN ON 2FA"
              textClassName="font-poppins"
              variant="contained-red"
              onClick={onEnable2FAF}
            />
          ) : showPasswordPrompt ? (
            <div className="space-y-3">
              <Typo as="p" className="text-gray-300" fontVariant="p5">
                Please enter your password to disable 2FA:
              </Typo>
              <PasswordInput password={password} setPassword={setPassword} />
              <div className="flex gap-2">
                <Button
                  className="w-auto"
                  label="Confirm"
                  textClassName="font-poppins"
                  variant="contained-red"
                  onClick={onDisable2FAF}
                />
                <Button
                  className="w-auto"
                  label="Cancel"
                  textClassName="font-poppins"
                  variant="contained-dark"
                  onClick={() => setShowPasswordPrompt(false)}
                />
              </div>
            </div>
          ) : (
            <Button
              className="w-auto"
              label="TURN OFF 2FA"
              textClassName="font-poppins"
              variant="contained-dark"
              onClick={() => setShowPasswordPrompt(true)}
            />
          )}
        </div>
      ) : (
        <button onClick={() => setEditTwoFactorAuth(true)}>
          <Typo
            as="p"
            className="font-semibold text-xs md:text-sm mt-2 md:mt-0"
            color="red"
            fontFamily="poppins"
            fontVariant="p1"
            fontWeight="regular"
          >
            Edit
          </Typo>
        </button>
      )}
    </div>
  )
}
