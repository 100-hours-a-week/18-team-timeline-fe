import { LogoutButton } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { ROUTES } from '@/constants/url'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

export const LogoutMenu = () => {
  const lineClass = 'border-t border-ccLine'
  const menuClass = 'relative mx-4 flex flex-col'
  const titleClass = 'text-menuTitle text-2xl font-bold flex flex-col pl-1 pt-10 pb-4'
  const navClass = 'flex flex-col pl-1 pt-6 space-y-4'
  const navItemClass = 'text-menuItem hover:text-menuItemHover text-lg font-medium'

  return (
    <div className={menuClass}>
      <Text className={clsx(titleClass)}>
        로그인이
        <br />
        필요합니다.
      </Text>
      <div className={lineClass} />
      <nav className={navClass}>
        <Link to={ROUTES.LOGIN} className={navItemClass} onClick={close}>
          로그인
        </Link>
        <Link to={ROUTES.SIGNUP} className={navItemClass} onClick={close}>
          회원가입
        </Link>
      </nav>
    </div>
  )
}
