import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Icon } from '../ui/Icon'
import { Text } from '../ui/Text'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { useSidebarMenuStore } from '@/stores/useSidebarMenuStore'
import { useSearchBarStore } from '@/stores/useSearchBarStore'
import { useSidebarAlarmStore } from '@/stores/useSidebarAlarmStore'
import { useAuthStore } from '@/stores/useAuthStore'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type HeaderProps = ReactDivProps & {}

export const Header = ({ className: _className }: HeaderProps) => {
  const isLogin = useAuthStore((state) => state.isLoggedIn)

  const className = clsx(
    'relative w-full h-[48px] bg-headerBackground',
    'flex items-center justify-between px-[20px]',
    _className,
  )

  const iconClass = 'text-headerIcon cursor-pointer'
  const iconsClass = 'flex gap-6'
  const logoWrapperClass = 'absolute left-1/2 -translate-x-1/2'
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
      <Link to={ROUTES.MAIN} className={logoWrapperClass}>
        <Text className={logoClass}>탐나라</Text>
      </Link>
      <div className={iconsClass}>
        {isLogin && (
          <Icon
            name="BellIcon"
            size={24}
            variant="solid"
            className={iconClass}
            onClick={() => useSidebarAlarmStore.getState().toggle()}
          />
        )}
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
