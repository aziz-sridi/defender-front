import Typo from '@/components/ui/Typo'
import { GRADIENTS } from '@/lib/constants'
interface TournamentImageProps {
  title: string
  index: number
  className?: string
}

const TournamentImage: React.FC<TournamentImageProps> = ({ title, index, className = '' }) => {
  const gradients = GRADIENTS

  const gradient = gradients[index % gradients.length]

  return (
    <div
      className={`${gradient} rounded-xl flex items-center justify-center text-white font-bold ${className}`}
    >
      <div className="text-center p-2">
        <div className="text-2xl mb-1">🏆</div>
        <Typo as="p" color="custom868484" fontVariant="p6">
          {title.split(' ')[0]}
        </Typo>
      </div>
    </div>
  )
}

export default TournamentImage
