'use client'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import HCaptcha from '@hcaptcha/react-hcaptcha'

import Button from '@/components/ui/Button'
import CloudUpload from '@/components/ui/Icons/CloudUpload'
import Document from '@/components/ui/Icons/Document'
import Download from '@/components/ui/Icons/Download'
import Typo from '@/components/ui/Typo'
import Select from '@/components/ui/Select'
import { INTERNSHIP_TOPICS, getTopicPdfUrl } from '@/lib/constants/jobs'

export default function JobsPage() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [fullName, setFullName] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [motivationLetterFile, setMotivationLetterFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const cvInputRef = useRef<HTMLInputElement>(null)
  const motivationLetterInputRef = useRef<HTMLInputElement>(null)
  const captchaRef = useRef<HCaptcha>(null)

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document for CV')
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('CV file size must be less than 10MB')
        return
      }
      setCvFile(file)
      toast.success('CV file selected')
    }
  }

  const handleMotivationLetterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document for Motivation Letter')
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Motivation Letter file size must be less than 10MB')
        return
      }
      setMotivationLetterFile(file)
      toast.success('Motivation Letter file selected')
    }
  }

  const removeCvFile = () => {
    setCvFile(null)
    if (cvInputRef.current) {
      cvInputRef.current.value = ''
    }
  }

  const removeMotivationLetterFile = () => {
    setMotivationLetterFile(null)
    if (motivationLetterInputRef.current) {
      motivationLetterInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!fullName.trim()) {
      toast.error('Please enter your full name')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(applicantEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!selectedTopic) {
      toast.error('Please select an internship topic')
      return
    }

    if (!portfolioUrl.trim()) {
      toast.error('Please provide your portfolio or website URL')
      return
    }

    // Validate URL format
    try {
      new URL(portfolioUrl.trim())
    } catch {
      toast.error('Please enter a valid URL (e.g., https://yourportfolio.com)')
      return
    }

    if (!cvFile) {
      toast.error('Please upload your CV')
      return
    }

    if (!motivationLetterFile) {
      toast.error('Please upload your motivation letter')
      return
    }

    // Verify captcha before submitting
    if (!captchaToken) {
      toast.error('Please complete the captcha verification')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('fullName', fullName.trim())
      formData.append('applicantEmail', applicantEmail.trim())
      formData.append('portfolioUrl', portfolioUrl.trim())
      formData.append('topic', selectedTopic)
      formData.append('cv', cvFile)
      formData.append('motivationLetter', motivationLetterFile)
      formData.append('hcaptchaToken', captchaToken)

      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      toast.success('Application submitted successfully! We will contact you soon.')

      // Reset form
      setSelectedTopic('')
      setFullName('')
      setApplicantEmail('')
      setPortfolioUrl('')
      setCvFile(null)
      setMotivationLetterFile(null)
      setCaptchaToken(null)
      if (cvInputRef.current) {
        cvInputRef.current.value = ''
      }
      if (motivationLetterInputRef.current) {
        motivationLetterInputRef.current.value = ''
      }
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit application. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 mt-[80px]">
      <div className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] flex flex-col ml-0 sm:ml-10 lg:ml-20 w-full py-4">
        <Typo as="h1" className="text-xxl font-bold" fontFamily="poppins" fontVariant="h1">
          Join Defendr - Internship Opportunities
        </Typo>
        <Typo
          as="p"
          className="text-sm sm:text-base md:text-lg text-gray-400 mt-1"
          fontVariant="p4"
        >
          Apply for an internship position and be part of the Defendr team
        </Typo>
      </div>

      <section className="flex flex-col xl:flex-row gap-6 lg:gap-14 justify-between mt-7 w-full">
        <form
          className="p-4 sm:p-6 lg:p-9 bg-[#212529] text-white rounded-lg flex-1 ml-0 sm:ml-5 lg:ml-10"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-6">
            {/* Topic Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm pl-1.5" htmlFor="topic">
                Select Internship Topic *
              </label>
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                <div className="flex-1 w-full">
                  <Select
                    label=""
                    options={[
                      { value: '', label: 'Select a topic...' },
                      ...INTERNSHIP_TOPICS.map(t => ({ value: t.value, label: t.label })),
                    ]}
                    value={selectedTopic}
                    onChange={setSelectedTopic}
                    className="w-full"
                  />
                </div>
                {selectedTopic && getTopicPdfUrl(selectedTopic) && (
                  <a
                    href={getTopicPdfUrl(selectedTopic)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:py-1.5 bg-defendrRed hover:bg-defendrHoverRed text-white rounded-full transition-colors duration-200 font-poppins text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
                  >
                    <Download size={18} color="#ffffff" />
                    <span>View PDF Ebook</span>
                  </a>
                )}
              </div>
              {!selectedTopic && (
                <Typo as="p" className="text-xs text-red-400 mt-1" fontVariant="p5">
                  Please select an internship topic
                </Typo>
              )}
              {selectedTopic && getTopicPdfUrl(selectedTopic) && (
                <Typo as="p" className="text-xs text-gray-400 mt-1" fontVariant="p5">
                  Click "View PDF Ebook" to consult the details about this internship topic
                </Typo>
              )}
            </div>

            {/* Applicant Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm pl-1.5" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  className="rounded-full bg-[#312F31] px-4 py-2 sm:py-1.5 outline-none font-poppins text-sm sm:text-base text-white placeholder:text-gray-400 border border-transparent focus:border-defendrRed transition-colors"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm pl-1.5" htmlFor="applicantEmail">
                  Email Address *
                </label>
                <input
                  className="rounded-full bg-[#312F31] px-4 py-2 sm:py-1.5 outline-none font-poppins text-sm sm:text-base text-white placeholder:text-gray-400 border border-transparent focus:border-defendrRed transition-colors"
                  id="applicantEmail"
                  name="applicantEmail"
                  placeholder="Enter your email address"
                  type="email"
                  value={applicantEmail}
                  onChange={e => setApplicantEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm pl-1.5" htmlFor="portfolioUrl">
                Portfolio / Website *
              </label>
              <input
                className="rounded-full bg-[#312F31] px-4 py-2 sm:py-1.5 outline-none font-poppins text-sm sm:text-base text-white placeholder:text-gray-400 border border-transparent focus:border-defendrRed transition-colors"
                id="portfolioUrl"
                name="portfolioUrl"
                placeholder="https://..."
                type="url"
                value={portfolioUrl}
                onChange={e => setPortfolioUrl(e.target.value)}
                required
              />
            </div>

            {/* CV Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm pl-1.5" htmlFor="cvFile">
                CV / Resume * (PDF or Word Document, Max 10MB)
              </label>
              <div className="relative">
                <label
                  className="bg-[#312F31] min-h-[120px] px-4 py-4 rounded-xl border-2 border-defendrRed border-dashed text-white flex-1 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#3a383a]"
                  htmlFor="cvFile"
                >
                  {cvFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <Document className="text-3xl text-defendrRed" />
                      <Typo as="span" fontVariant="p5" className="text-center max-w-xs truncate">
                        {cvFile.name}
                      </Typo>
                      <Typo as="span" fontVariant="p6" className="text-gray-400">
                        {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typo>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <CloudUpload size={48} className="text-defendrRed" />
                      <Typo as="span" fontVariant="p5">
                        Click to upload CV
                      </Typo>
                      <Typo as="span" fontVariant="p6" className="text-gray-400">
                        PDF or Word Document
                      </Typo>
                    </div>
                  )}
                </label>
                <input
                  ref={cvInputRef}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="cvFile"
                  type="file"
                  onChange={handleCvFileChange}
                />
                {cvFile && (
                  <button
                    type="button"
                    onClick={removeCvFile}
                    className="mt-2 text-defendrRed hover:text-defendrHoverRed text-sm font-poppins"
                  >
                    Remove CV
                  </button>
                )}
              </div>
            </div>

            {/* Motivation Letter Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm pl-1.5" htmlFor="motivationLetterFile">
                Motivation Letter * (PDF or Word Document, Max 10MB)
              </label>
              <div className="relative">
                <label
                  className="bg-[#312F31] min-h-[120px] px-4 py-4 rounded-xl border-2 border-defendrRed border-dashed text-white flex-1 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#3a383a]"
                  htmlFor="motivationLetterFile"
                >
                  {motivationLetterFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <Document className="text-3xl text-defendrRed" />
                      <Typo as="span" fontVariant="p5" className="text-center max-w-xs truncate">
                        {motivationLetterFile.name}
                      </Typo>
                      <Typo as="span" fontVariant="p6" className="text-gray-400">
                        {(motivationLetterFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typo>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <CloudUpload size={48} className="text-defendrRed" />
                      <Typo as="span" fontVariant="p5">
                        Click to upload Motivation Letter
                      </Typo>
                      <Typo as="span" fontVariant="p6" className="text-gray-400">
                        PDF or Word Document
                      </Typo>
                    </div>
                  )}
                </label>
                <input
                  ref={motivationLetterInputRef}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="motivationLetterFile"
                  type="file"
                  onChange={handleMotivationLetterFileChange}
                />
                {motivationLetterFile && (
                  <button
                    type="button"
                    onClick={removeMotivationLetterFile}
                    className="mt-2 text-defendrRed hover:text-defendrHoverRed text-sm font-poppins"
                  >
                    Remove Motivation Letter
                  </button>
                )}
              </div>
            </div>

            {/* hCaptcha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm pl-1.5">Security Verification *</label>
              <div className="flex justify-start">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
                  onVerify={(token: string) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  onError={() => {
                    setCaptchaToken(null)
                    toast.error('Captcha verification failed. Please try again.')
                  }}
                />
              </div>
              {!captchaToken && (
                <Typo as="p" className="text-xs text-red-400 mt-1" fontVariant="p5">
                  Please complete the captcha verification
                </Typo>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <Button
                className="w-full mb-4 sm:mb-7 font-poppins text-sm sm:text-base"
                disabled={
                  isSubmitting ||
                  !selectedTopic ||
                  !fullName.trim() ||
                  !applicantEmail.trim() ||
                  !portfolioUrl.trim() ||
                  !cvFile ||
                  !motivationLetterFile ||
                  !captchaToken
                }
                label={isSubmitting ? 'Submitting...' : 'Submit Application'}
                size="xl"
                type="submit"
                variant="contained-red"
              />
              <Typo
                as="p"
                className="text-xs sm:text-sm text-gray-400 text-center leading-relaxed"
                fontFamily="poppins"
                fontVariant="p4"
              >
                By clicking "Submit Application", you confirm that you agree to the processing of
                your personal data by DEFENDR as described in the Privacy Policy.
              </Typo>
            </div>
          </div>
        </form>

        {/* Info Sidebar */}
        <aside className="flex-1">
          <div className="bg-[#212529] rounded-lg p-6 mb-6">
            <Typo as="h3" className="text-xl font-bold mb-4" fontFamily="poppins" fontVariant="h3">
              Application Process
            </Typo>
            <Typo
              as="p"
              className="text-gray-300 text-sm mb-4"
              fontFamily="poppins"
              fontVariant="p4"
            >
              Follow these steps to apply for an internship at Defendr:
            </Typo>
            <div className="space-y-3">
              <Typo
                as="p"
                className="flex items-start gap-2 text-sm text-gray-300"
                fontVariant="p4"
              >
                <span className="text-defendrRed font-bold">1.</span>
                <span>Select the internship topic that interests you from the dropdown menu.</span>
              </Typo>
              <Typo
                as="p"
                className="flex items-start gap-2 text-sm text-gray-300"
                fontVariant="p4"
              >
                <span className="text-defendrRed font-bold">2.</span>
                <span>Upload your CV/Resume (PDF or Word document, max 10MB).</span>
              </Typo>
              <Typo
                as="p"
                className="flex items-start gap-2 text-sm text-gray-300"
                fontVariant="p4"
              >
                <span className="text-defendrRed font-bold">3.</span>
                <span>
                  Upload your motivation letter explaining why you want to join Defendr (PDF or Word
                  document, max 10MB).
                </span>
              </Typo>
              <Typo
                as="p"
                className="flex items-start gap-2 text-sm text-gray-300"
                fontVariant="p4"
              >
                <span className="text-defendrRed font-bold">4.</span>
                <span>Submit your application. We will review it and contact you soon!</span>
              </Typo>
            </div>
          </div>

          <div className="bg-[#212529] rounded-lg p-6">
            <Typo as="h3" className="text-xl font-bold mb-4" fontFamily="poppins" fontVariant="h3">
              Why Join Defendr?
            </Typo>
            <div className="space-y-3">
              <Typo
                as="p"
                className="flex items-center gap-2 text-sm text-gray-300"
                fontVariant="p4"
              >
                <svg
                  fill="var(--Primary-Color-Color, #D62555)"
                  height="18"
                  viewBox="0 0 16 16"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8" fill="var(--Primary-Color-Color, #D62555)" r="8" />
                  <path
                    d="M4 8.5L7 11.5L12 6.5"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Gain real-world experience in the esports industry
              </Typo>
              <Typo
                as="p"
                className="flex items-center gap-2 text-gray-300 text-sm"
                fontVariant="p4"
              >
                <svg
                  fill="var(--Primary-Color-Color, #D62555)"
                  height="18"
                  viewBox="0 0 16 16"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8" fill="var(--Primary-Color-Color, #D62555)" r="8" />
                  <path
                    d="M4 8.5L7 11.5L12 6.5"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Work with a passionate and dedicated team
              </Typo>
              <Typo
                as="p"
                className="flex items-center gap-2 text-gray-300 text-sm"
                fontVariant="p4"
              >
                <svg
                  fill="var(--Primary-Color-Color, #D62555)"
                  height="18"
                  viewBox="0 0 16 16"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8" fill="var(--Primary-Color-Color, #D62555)" r="8" />
                  <path
                    d="M4 8.5L7 11.5L12 6.5"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Build your portfolio with meaningful projects
              </Typo>
              <Typo
                as="p"
                className="flex items-center gap-2 text-gray-300 text-sm"
                fontVariant="p4"
              >
                <svg
                  fill="var(--Primary-Color-Color, #D62555)"
                  height="18"
                  viewBox="0 0 16 16"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8" fill="var(--Primary-Color-Color, #D62555)" r="8" />
                  <path
                    d="M4 8.5L7 11.5L12 6.5"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Learn from industry experts
              </Typo>
            </div>
          </div>

          <div className="bg-[#212529] rounded-lg p-6 mt-6">
            <Typo as="h3" className="text-xl font-bold mb-2" fontFamily="poppins" fontVariant="h3">
              Already 200+ Applications Received
            </Typo>
            <Typo as="p" className="text-gray-300 text-sm" fontFamily="poppins" fontVariant="p4">
              Our internship program is in high demand. Submit your application now to join the next
              wave of talents at Defendr.
            </Typo>
          </div>
        </aside>
      </section>
    </main>
  )
}
