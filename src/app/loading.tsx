import Image from 'next/image'

const loading = () => {
  return (
    <section className="h-screen flexCenter w-full mx-auto overflow-y-hidden">
      <Image
        unoptimized
        alt="Loader"
        className="w-full  object-cover"
        height={180}
        src={'/assets/images/Loader.gif'}
        width={180}
      />
    </section>
  )
}

export default loading
