'use client'

import Button from '@/components/ui/Button'
import Rightarrow from '@/components/ui/Icons/Rightarrow'

interface InfoProps {
  action: () => void
}

const InformationOrganize = ({ action }: InfoProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    action()
  }

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto">
        {/* Info cards */}
        <div className="space-y-4 sm:space-y-5 mb-8">
          {/* Card 1 */}
          <div className="bg-[#111114] border border-white/[0.07] rounded-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-defendrRed/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-defendrRed font-bold text-base sm:text-lg font-poppins">
                  1
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg font-poppins mb-1.5">
                  Read the Terms &amp; Privacy Rules
                </h3>
                <p className="text-gray-400 text-sm sm:text-base font-poppins leading-relaxed">
                  Before organising any tournaments, please make sure to read and understand{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noreferrer"
                    className="text-defendrRed hover:text-red-400 underline underline-offset-2 transition-colors"
                  >
                    the terms and privacy rules
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111114] border border-white/[0.07] rounded-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-defendrRed/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-defendrRed font-bold text-base sm:text-lg font-poppins">
                  2
                </span>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-white font-semibold text-base sm:text-lg font-poppins mb-1.5">
                    Defendr Organisation Services
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base font-poppins leading-relaxed">
                    Whether you're a player or organiser, Defendr offers all the tools you need to
                    run tournaments.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-white font-semibold text-sm font-poppins mb-1">
                      Personal Organisation
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm font-poppins leading-relaxed">
                      Players can organise community tournaments using the Personal type.
                    </p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 opacity-60">
                    <p className="text-gray-300 font-semibold text-sm font-poppins mb-1 flex items-center gap-2">
                      Business Organisation
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                        Soon
                      </span>
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm font-poppins leading-relaxed">
                      Organisations can run both community and official tournaments using the
                      Business type.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111114] border border-white/[0.07] rounded-2xl p-5 sm:p-6 opacity-60">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-gray-400 font-bold text-base sm:text-lg font-poppins">3</span>
              </div>
              <div>
                <h3 className="text-gray-300 font-semibold text-base sm:text-lg font-poppins mb-1.5">
                  Business Organisation Requirements{' '}
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full font-normal align-middle">
                    Currently Disabled
                  </span>
                </h3>
                <ul className="text-gray-400 text-sm sm:text-base font-poppins space-y-1.5 list-disc list-outside ml-4 leading-relaxed">
                  <li>Verify the owner&apos;s identity with a Government-issued ID.</li>
                  <li>Provide a valid Wallet ID to receive payment.</li>
                  <li>Confirmation takes up to 3 business days after submission.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-[#111114] border border-white/[0.07] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <label
              htmlFor="agree"
              className="flex items-start sm:items-center gap-3 cursor-pointer group flex-1"
            >
              <input
                required
                id="agree"
                type="checkbox"
                className="mt-0.5 sm:mt-0 h-5 w-5 rounded border-gray-600 bg-[#1c1c20] text-defendrRed accent-red-600 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm sm:text-base text-gray-200 font-poppins leading-relaxed group-hover:text-white transition-colors">
                I have read and agree to all terms and conditions above
              </span>
            </label>

            <Button
              className="w-full sm:w-auto rounded-xl transition-transform hover:scale-105 flex-shrink-0"
              icon={<Rightarrow className="ml-2 w-4 h-4" fill="white" />}
              iconOrientation="right"
              label="Continue"
              size="xxs"
              type="submit"
              variant="contained-red"
            />
          </div>
        </form>
      </div>
    </section>
  )
}

export default InformationOrganize
