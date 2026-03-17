'use client'

import Level from '@/components/LevelPlayer/Level'
import Button from '@/components/ui/Button'
import Typo from '@/components/ui/Typo'

const Staff = ({ organization }) => {
  return (
    <div className="bg-gray-80 rounded-lg p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <Typo as="h3" color="white" fontVariant="h3">
          Staff
        </Typo>
        <Button
          className="uppercase text-defendrRed px-3 py-1"
          label="See all"
          size="xxs"
          variant="outlined-grey"
        />
      </div>
      <div className="flex flex-col gap-3">
        {organization.staff.map((staff, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <Level
                image="/assets/organization/default-user-icon.jpg"
                levelColor={'bleu'}
                percentage={0}
                svgWidthHeigth={56}
              />
              <span className="bg-black text-center px-2 py-0.5 absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full regular-12">
                {i + 1}
              </span>
            </div>
            <Typo as="span" color="white" fontVariant="p4">
              {staff.user.nickname}
            </Typo>
            <Typo as="span" color="grey" fontVariant="p5">
              {staff.role}
            </Typo>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Staff
