import Typo from '@/components/ui/Typo'

export default function TermsOfService() {
  return (
    <div className="bg-[#161616] min-h-screen py-12 px-4 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <Typo as="h1" className="text-4xl font-bold text-white mb-8" fontVariant="h1">
          Terms and Conditions
        </Typo>

        <Typo as="p" className="text-gray-300 mb-8" fontVariant="p4">
          Last updated: 2025-9-5
        </Typo>

        <div className="space-y-8 text-gray-300">
          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              1. Acceptance of Terms
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              By accessing or using our Service, you agree to be bound by these Terms. If you
              disagree with any part of the terms, then you may not access the Service.
            </Typo>
          </section>

          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              2. Accounts
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              When you create an account with us, you must provide accurate, complete, and current
              information at all times. Failure to do so constitutes a breach of the Terms, which
              may result in immediate termination of your account on our Service.
            </Typo>
          </section>

          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              3. Content
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              You may create and/or upload content (text, images) to our Service. You retain any and
              all of your rights to any content you submit, post, or display on or through the
              Service, and you are responsible for protecting those rights.
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              We take no responsibility and assume no liability for content you or any third party
              posts on or through the Service.
            </Typo>
          </section>

          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              4. Purchases
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              If you wish to purchase any product, item, or service made available through the
              Service ("Purchase"), you may be asked to supply certain information relevant to your
              Purchase including, without limitation, your credit card number, the expiration date
              of your credit card, your billing address, and your shipping information.
            </Typo>
          </section>

          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              5. Subscription Plans
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              We offer subscription plans that involve recurring payments. However, we do not offer
              a free trial for our subscription plans.
            </Typo>
          </section>

          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              6. Intellectual Property
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              The Service and its original content (excluding content provided by users), features,
              and functionality are and will remain the exclusive property of Defendr and its
              licensors.
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              Our trademarks and trade dress may not be used in connection with any product or
              service without the prior written consent of Defendr.
            </Typo>
          </section>

          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              7. Feedback and Suggestions
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              We do not use feedback or suggestions provided by users without compensation or
              credits given.
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              If you have any feedback or suggestions, please contact us.
            </Typo>
          </section>

          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              8. Termination
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              We may terminate or suspend your account immediately, without prior notice or
              liability, for any reason whatsoever, including without limitation if you breach the
              Terms.
            </Typo>
          </section>

          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              9. Governing Law
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              These Terms shall be governed and construed in accordance with the laws of Tunisia,
              without regard to its conflict of law provisions.
            </Typo>
          </section>

          <section>
            <Typo as="h2" className="text-2xl font-bold text-white mb-4" fontVariant="h2">
              10. Contact Us
            </Typo>
            <Typo as="p" className="mb-4" fontVariant="p4">
              If you have any questions about these Terms, please contact us:
            </Typo>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>By email: Contact@defendr.gg</li>
              <li>By visiting this page on our website: https://defendr.vercel.app/</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
