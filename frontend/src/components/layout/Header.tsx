import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Icon } from '../ui/Icon'
import { Text } from '../ui/Text'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { useSidebarMenuStore } from '@/stores/useSidebarMenuStore'
import { useSearchBarStore } from '@/stores/useSearchBarStore'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type HeaderProps = ReactDivProps & {}

export const Header = ({ className: _className }: HeaderProps) => {
  const className = clsx(
    'top-0 w-full h-[48px] bg-headerBackground',
    'flex items-center justify-between px-[20px]',
    _className,
  )

  const iconClass = 'text-headerIcon cursor-pointer'
  const iconsClass = 'flex gap-4'
  const logoClass = 'text-2xl font-extrabold cursor-pointer text-headerLogo'

  return (
    <div className={className}>
      <div className={iconsClass}>
        <Icon
          name="Bars3Icon"
          size={24}
          variant="solid"
          className={iconClass}
          onClick={() => useSidebarMenuStore.getState().toggle()}
        />
      </div>
      <Link to={ROUTES.MAIN}>
        <Text className={logoClass}>탐나라</Text>
      </Link>
      <div className={iconsClass}>
        <Icon
          name="MagnifyingGlassIcon"
          size={24}
          variant="solid"
          className={iconClass}
          onClick={() => useSearchBarStore.getState().toggle()}
        />
      </div>
    </div>
  )
}
