import Typo from '@/components/ui/Typo'

interface NavButtonProps {
  label: string
  active?: boolean
  onClick?: () => void
}

interface NavBarProps {
  items: { id: string; label: string }[]
  activeId: string
  onItemClick?: (id: string) => void
}

const NavButton: React.FC<NavButtonProps> = ({ label, active = false, onClick }) => (
  <button
    className={`px-2 sm:px-5 py-2 sm:py-3 rounded-full text-white transition-colors duration-200 whitespace-nowrap text-xs sm:text-sm ${
      active ? 'bg-rose-900 border-2 border-rose-500' : 'bg-gray-700 hover:bg-gray-600'
    } `}
    onClick={onClick}
  >
    <Typo as="p" fontFamily="poppins" fontVariant="p4">
      {label}
    </Typo>
  </button>
)

export const NavBar: React.FC<NavBarProps> = ({ items, activeId, onItemClick }) => {
  const handleClick = (id: string) => {
    if (onItemClick) {
      onItemClick(id)
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 mt-7 bg-[#161616] rounded-lg w-full overflow-x-auto">
      {items.map(item => (
        <NavButton
          key={item.id}
          active={item.id === activeId}
          label={item.label}
          onClick={() => handleClick(item.id)}
        />
      ))}
    </div>
  )
}
