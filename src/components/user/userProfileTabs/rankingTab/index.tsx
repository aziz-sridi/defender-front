import Image from 'next/image'

export default function Leaderboard() {
  {
    /* just a skeleton for now */
  }
  return (
    <div className="min-h-screen blur-sm animate-pulse text-white flex flex-col items-center py-10">
      <p className="text-lg mb-6">
        Your Ranking is : <span className="font-bold">110</span>
      </p>

      <div className="flex bg-[#1a1a1a] rounded-full overflow-hidden mb-6">
        <button className="px-6 py-2 bg-pink-600 font-semibold">DEFENDR RANK</button>
        <button className="px-6 py-2">WINS</button>
      </div>

      <div className="flex gap-3 mb-10">
        <button className="px-4 py-1 rounded-full bg-pink-600 text-sm">All time</button>
        <button className="px-4 py-1 rounded-full bg-[#1a1a1a] text-sm">Last Month</button>
        <button className="px-4 py-1 rounded-full bg-[#1a1a1a] text-sm">Last Week</button>
      </div>

      <div className="flex items-end gap-12 mb-12">
        <div className="flex flex-col items-center mt-4">
          <img
            alt="2nd Place"
            className="rounded-full"
            height={80}
            src="https://media.istockphoto.com/id/1341077372/vector/girls-gamer-mascot-esport-design.jpg?s=612x612&w=0&k=20&c=EDrYFRuBcmmLLiomkFs69yVnGlhAYyFO-ZpkzX3CkB8="
            width={80}
          />
          <p className="mt-2">2nd</p>
        </div>

        <div className="flex flex-col items-center">
          <img
            alt="1st Place"
            className="rounded-full border-4 border-yellow-400"
            height={100}
            src="https://img.freepik.com/premium-vector/logo-kid-gamer_573604-730.jpg"
            width={100}
          />
          <p className="mt-2">1st</p>
        </div>

        <div className="flex flex-col items-center mt-4">
          <img
            alt="3rd Place"
            className="rounded-full"
            height={80}
            src="https://img.freepik.com/free-photo/cartoon-man-wearing-glasses_23-2151136831.jpg"
            width={80}
          />
          <p className="mt-2">3rd</p>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-2">
        {[1, 2, 3].map(item => (
          <div
            key={item}
            className="flex items-center justify-between bg-[#1a1a1a] px-4 py-3 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-gray-400">{item}</span>
              <img
                alt="avatar"
                className="rounded-full"
                height={32}
                src="https://i.pinimg.com/736x/a2/d5/cd/a2d5cdf5b72df62c2604aae5a31394ed.jpg"
                width={32}
              />
              <div>
                <p className="font-bold">Kratos</p>
                <p className="text-xs text-gray-400">
                  Won 50 <span className="text-green-500">Win</span> Lost 35
                </p>
              </div>
            </div>
            <p className="text-pink-500 font-semibold">125020 DF</p>
          </div>
        ))}

        <div className="flex justify-center my-4">
          <span className="h-2 w-2 bg-gray-500 rounded-full mx-1" />
          <span className="h-2 w-2 bg-pink-600 rounded-full mx-1" />
          <span className="h-2 w-2 bg-gray-500 rounded-full mx-1" />
        </div>

        <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-3 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="bg-pink-600 px-2 py-1 rounded-lg font-bold text-sm">110</span>
            <img
              alt="avatar"
              className="rounded-full"
              height={32}
              src="https://i.pinimg.com/736x/a2/d5/cd/a2d5cdf5b72df62c2604aae5a31394ed.jpg"
              width={32}
            />
            <div>
              <p className="font-bold">Kratos</p>
              <p className="text-xs text-gray-400">
                Won 50 <span className="text-green-500">Win</span> Lost 35
              </p>
            </div>
          </div>
          <p className="text-pink-500 font-semibold">125020 DF</p>
        </div>
      </div>
    </div>
  )
}
