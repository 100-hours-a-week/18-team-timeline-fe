import { LogoutButton } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { ROUTES } from "@/constants/url"
import { useSidebarMenuStore } from "@/stores/useSidebarMenuStore"
import clsx from "clsx"
import { Link } from "react-router-dom"

export const LoginMenu = () => {
  const close = useSidebarMenuStore((state) => state.close)
  const lineClass = 'border-t border-ccLine'
  const menuClass = 'relative mx-4 flex flex-col'
  const titleClass = 'text-menuTitle text-2xl font-bold flex flex-col pl-1 pt-10 pb-4'
  const navClass = 'flex flex-col pl-1 pt-6 space-y-4'
  const navItemClass = 'text-menuItem hover:text-menuItemHover text-lg font-medium'
  
  return (
    <div className={menuClass}>
      <Text className={titleClass}>마이 페이지</Text>
      <div className={lineClass} />
      <nav className={navClass}>
        <Link to={ROUTES.USER_INFO} className={navItemClass} onClick={close}>
          회원정보 수정
        </Link>
        <Link to={ROUTES.BOOKMARK} className={navItemClass} onClick={close}>
          북마크 목록
        </Link>
        <Link to={ROUTES.POLL} className={navItemClass} onClick={close}>
          투표하기
        </Link>
        <LogoutButton className={clsx(navItemClass, 'block text-left')} onClick={close} />
      </nav>
    </div>
  )
}
