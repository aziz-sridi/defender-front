import Image from 'next/image'

const BannerAccount = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Desktop Image */}
      <div className="hidden sm:block h-[75vh] w-full h-full">
        <Image
          alt="Tournament Cover"
          className="w-full h-full"
          height={1920}
          src="/assets/newHome/Cover_platform.jpg"
          width={1080}
        />
      </div>

      {/* Mobile Image */}
      <div className="r sm:hidden">
        <Image
          alt="Prepare Your Team"
          className="w-full"
          height={1920}
          src="/assets/newHome/Cover_platform.jpg"
          width={1080}
        />
      </div>
    </div>
  )
}

export default BannerAccount
