'use client'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { toast } from 'sonner'

import { BASE_URL } from '@/lib/api/constants'

import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    ticket: 'Partner',
    message: '',
    additionalDetails: '',
    newsletterConsent: false,
  })
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<HCaptcha>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, newsletterConsent: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.firstName.trim()) {
      toast.error('Please enter your first name')
      return
    }

    if (!formData.lastName.trim()) {
      toast.error('Please enter your last name')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!formData.message.trim()) {
      toast.error('Please enter a message')
      return
    }

    // Verify captcha before submitting
    if (!captchaToken) {
      toast.error('Please complete the captcha verification')
      return
    }

    try {
      const response = await axios.post(`${BASE_URL}partnerContact`, {
        ...formData,
        hcaptchaToken: captchaToken,
      })
      console.log('Form submitted successfully:', response.data)
      toast.success('Message sent successfully! We will contact you soon.')

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        ticket: 'Partner',
        message: '',
        additionalDetails: '',
        newsletterConsent: false,
      })
      setCaptchaToken(null)
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to send message. Please try again.')
    }
  }

  return (
    <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 mt-[80px]">
      <div className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] flex flex-col ml-0 sm:ml-10 lg:ml-20 w-full py-4">
        <Typo as="h1" className="text-xxl font-bold" fontFamily="poppins" fontVariant="h1">
          Contact DEFENDR Team
        </Typo>
        <Typo
          as="p"
          className="text-sm sm:text-base md:text-lg text-gray-400 mt-1"
          fontVariant="p4"
        >
          Let's connect and get you acquainted with Defendr
        </Typo>
      </div>
      <section className="flex flex-col xl:flex-row gap-6 lg:gap-14 justify-between mt-7 w-full">
        <form
          className="p-4 sm:p-6 lg:p-9 bg-[#212529] text-white rounded-lg flex-1 ml-0 sm:ml-5 lg:ml-10"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs sm:text-sm pl-1.5" htmlFor="firstName">
                First name
              </label>
              <input
                className="rounded-full bg-[#312F31] px-4 py-2 sm:py-1.5 outline-none font-poppins text-sm sm:text-base"
                id="firstName"
                name="firstName"
                placeholder="First name"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs sm:text-sm pl-1.5" htmlFor="lastName">
                Last name
              </label>
              <input
                className="rounded-full bg-[#312F31] px-4 py-2 sm:py-1.5 outline-none font-poppins text-sm sm:text-base"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <br />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm pl-1.5" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-full bg-[#312F31] px-4 py-2 sm:py-1.5 outline-none font-poppins text-sm sm:text-base"
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <br />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm pl-1.5" htmlFor="ticket">
              Ticket
            </label>
            <select
              className="rounded-full bg-[#312F31] px-4 py-2 sm:py-1.5 outline-none font-poppins text-sm sm:text-base"
              id="ticket"
              name="ticket"
              value={formData.ticket}
              onChange={handleInputChange}
            >
              <option value="Partner">Partner</option>
              <option value="job Offer">Job offer </option>
              <option value="Organizer">Organizer </option>
              <option value="Sponsor">Sponsor </option>
            </select>
          </div>
          <br />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm pl-1.5" htmlFor="message">
              Message
            </label>
            <input
              className="rounded-md bg-[#312F31] px-4 py-2 sm:py-2 outline-none font-poppins text-sm sm:text-base"
              id="message"
              name="message"
              placeholder="message"
              type="text"
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>
          <br />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm pl-1.5" htmlFor="additionalDetails">
              Additional details
            </label>
            <textarea
              className="rounded-md bg-[#312F31] px-4 py-2 sm:py-2 outline-none resize-none h-[80px] sm:h-[60px] font-poppins text-sm sm:text-base"
              id="additionalDetails"
              name="additionalDetails"
              placeholder="Additional details"
              value={formData.additionalDetails}
              onChange={handleInputChange}
            />
          </div>
          <br />
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="relative inline-flex items-start cursor-pointer">
              <input className="sr-only peer" type="checkbox" />
              <div className="w-5 h-5 bg-white border border-gray-300 rounded peer-checked:bg-defendrRed peer-focus:ring-2 peer-focus:ring-defendrRed transition mt-0.5 flex-shrink-0" />
            </label>
            <label
              className="text-xs sm:text-sm font-poppins text-gray-300 leading-relaxed"
              htmlFor="newsletterConsent"
            >
              Yes, I would like to receive newsletter from DEFENDR. I can unsubscribe at any time.
            </label>
          </div>
          <br />
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
          <br />
          <Button
            className="w-full mb-4 sm:mb-7 font-poppins text-sm sm:text-base"
            disabled={
              !formData.firstName.trim() ||
              !formData.lastName.trim() ||
              !formData.email.trim() ||
              !formData.message.trim() ||
              !captchaToken
            }
            label="Submit"
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
            By clicking "Submit", you confirm that you agree to the processing of your personal data
            by DEFENDR as described in the Privacy Policy.
          </Typo>
        </form>
        <aside className="flex-1">
          {/* Booking Meeting Section */}
          <div className="bg-[#212529] rounded-lg p-6 mb-6">
            <Typo as="h3" className="text-xl font-bold mb-4" fontFamily="poppins" fontVariant="h3">
              Schedule a Meeting
            </Typo>
            <Typo
              as="p"
              className="text-gray-300 text-sm mb-4"
              fontFamily="poppins"
              fontVariant="p4"
            >
              Book a 30-minute meeting with the DEFENDR team to discuss your needs and explore
              partnership opportunities.
            </Typo>
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-5 h-5 text-defendrRed"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <Typo
                as="span"
                className="text-gray-300 text-sm"
                fontFamily="poppins"
                fontVariant="p4"
              >
                30 minutes duration
              </Typo>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-5 h-5 text-defendrRed"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <Typo
                as="span"
                className="text-gray-300 text-sm"
                fontFamily="poppins"
                fontVariant="p4"
              >
                UTC Timezone support
              </Typo>
            </div>
            <a
              className="inline-block bg-defendrRed text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 font-poppins"
              href="https://defendr.youcanbook.me/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Book Meeting Now
            </a>
          </div>

          {/* Benefits Section */}
          <div className="space-y-3">
            <Typo as="p" className="flex items-center gap-2 text-sm text-gray-300" fontVariant="p4">
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
              Explore use cases specific to your needs.
            </Typo>
            <Typo as="p" className="flex items-center gap-2 text-gray-300 text-sm" fontVariant="p4">
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
              Get DEFENDR newsletter and future project plans
            </Typo>
            <Typo as="p" className="flex items-center gap-2 text-gray-300 text-sm" fontVariant="p4">
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
              Get potential partnership with DEFENDR
            </Typo>
          </div>

          <Typo as="h3" className="text-lg pt-8" fontVariant="h3">
            Trusted by gamers, organizers and esports communities.
          </Typo>
        </aside>
      </section>
    </main>
  )
}
