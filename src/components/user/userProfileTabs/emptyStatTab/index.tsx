import Image from 'next/image'

import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'

interface EmptyStatTabProps {
  isUserProfile: boolean
}

export const EmptyStatTab: React.FC<EmptyStatTabProps> = ({ isUserProfile }) => {
  const onJoin = () => {
    //redirect to browse tournaments
    window.location.href = '/tournaments/'
  }
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center w-full bg-[#181B20] rounded-xl py-8 px-4 gap-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Typo as="h2" className="text-white text-xl md:text-3xl" fontFamily="poppins">
            No Stats Found Yet
          </Typo>
          {isUserProfile && (
            <Button
              className="font-poppins"
              label="Join tournaments"
              size="s"
              textClassName="text-md"
              variant="contained-red"
              onClick={onJoin} //redirect to browse tournaments
            />
          )}
        </div>
        <div className="flex items-center justify-center">
          <Image
            alt="Sleeping Poro"
            className="object-contain"
            height={160}
            src="/pngwing.com1 1.png"
            width={160}
          />
        </div>
      </div>
    </>
  )
}
