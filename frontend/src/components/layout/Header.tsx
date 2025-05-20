import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Icon } from '../ui/Icon'
import { Text } from '../ui/Text'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { useSidebarStore } from '@/stores/sidebarStore'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type HeaderProps = ReactDivProps & {}

export const Header = ({ className: _className }: HeaderProps) => {
  const className = clsx(
    'top-0 w-full h-[48px] bg-headerBackground',
    'flex items-center justify-between px-[20px]',
    _className,
  )

  const iconClass = "text-headerIcon cursor-pointer"
  const logoClass = "text-2xl font-extrabold cursor-pointer text-headerLogo"

  return (
    <div className={className}>
      <Icon
        name="Bars3Icon"
        size={24}
        variant="solid"
        className={iconClass}
        onClick={() => useSidebarStore.getState().toggle()}
      />
      <Link to={ROUTES.MAIN}>
        <Text className={logoClass}>탐나라</Text>
      </Link>
      <Link to={ROUTES.SEARCH_RESULTS}>
        <Icon name="MagnifyingGlassIcon" size={24} variant="solid" className={iconClass} />
      </Link> 
    </div>
  )
}
