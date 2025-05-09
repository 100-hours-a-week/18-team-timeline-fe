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
    'top-0 w-full h-[50px] bg-headerColor',
    'flex items-center justify-between px-[20px]',
    _className,
  )

  return (
    <div className={className}>
      <Icon
        name="Bars3Icon"
        size={24}
        variant="solid"
        className="text-headerIconColor cursor-pointer"
        onClick={() => useSidebarStore.getState().toggle()}
      />
      <Link to={ROUTES.MAIN}>
        <Text className="text-2xl font-extrabold cursor-pointer text-headerTextColor">탐나라</Text>
      </Link>
      <Icon name="MagnifyingGlassIcon" size={24} variant="solid" className="text-headerIconColor cursor-pointer" />
    </div>
  )
}
