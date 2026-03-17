import Link from 'next/link'

import Typo from '@/components/ui/Typo'

interface NavBarTab {
  id: string
  label: string
  disabled?: boolean
}

interface NavBarProps {
  items: NavBarTab[]
  activeId: string
}

const NavButton = ({
  id,
  label,
  active,
  disabled,
}: {
  id: string
  label: string
  active: boolean
  disabled?: boolean
}) => {
  const className = `px-2 sm:px-5 py-2 sm:py-3 rounded-full text-white transition-colors duration-200 whitespace-nowrap text-xs sm:text-sm ${
    active
      ? 'bg-rose-900 border-2 border-rose-500'
      : disabled
        ? 'bg-gray-900 text-gray-500 cursor-not-allowed'
        : 'bg-gray-700 hover:bg-gray-600'
  } ${disabled ? 'pointer-events-none opacity-60' : ''}`

  if (disabled) {
    return (
      <span aria-disabled className={className} role="button" tabIndex={-1}>
        <Typo as="p" fontFamily="poppins" fontVariant="p4">
          {label}
        </Typo>
      </span>
    )
  }

  return (
    <Link className={className} href={`?tab=${id}`} role="button">
      <Typo as="p" fontFamily="poppins" fontVariant="p4">
        {label}
      </Typo>
    </Link>
  )
}

export const NavigationBar = ({ items, activeId }: NavBarProps) => {
  return (
    <div className="flex items-center gap-2 p-2 mt-7 bg-[#161616] rounded-lg w-full overflow-x-auto overflow-visible">
      {items.map(item => (
        <NavButton
          key={item.id}
          active={item.id === activeId}
          disabled={item.disabled}
          id={item.id}
          label={item.label}
        />
      ))}
    </div>
  )
}
