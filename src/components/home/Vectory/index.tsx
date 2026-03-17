import Image from 'next/image'

interface VectoryProps {
  vectory?: boolean
  team: string
  states: {
    damage: number
    KDA: string
    gold: number
  }
  image?: string
}

const Vectory = ({ vectory = true, team, states, image }: VectoryProps) => {
  return (
    <div className="flex bg-gray-80 text-white overflow-hidden rounded-lg w-fit">
      <div className="relative">
        <Image
          alt="Game"
          className="w-[120px] h-[160px] object-cover brightness-75"
          height={400}
          src={
            image ||
            'https://i.gadgets360cdn.com/large/arcane_season_2_release_window_1693903728217.jpg'
          }
          width={200}
        />
        <h3 className="absolute left-1/2 bottom-2 -translate-x-1/2 text-lg">
          {vectory ? 'Victory' : 'Defeat'}
        </h3>
      </div>
      <div className="min-w-[300px] py-2.5 px-5">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl capitalize">{team}</h2>
          <span className="text-gray-300 text-sm">Custom</span>
        </div>
        <div className="flex text-sm justify-between items-center text-gray-300">
          <span className="p-2 text-center">
            <p>Damage</p>
            <p>{states.damage.toLocaleString()}</p>
          </span>
          <div className="w-[2px] h-[60px] bg-gray-700" />
          <span className="p-2 text-center">
            <p>KDA</p>
            <p>{states.KDA}</p>
          </span>
          <div className="w-[2px] h-[60px] bg-gray-700" />
          <span className="p-2 text-center">
            <p>Gold</p>
            <p>{states.gold.toLocaleString()}</p>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Vectory
