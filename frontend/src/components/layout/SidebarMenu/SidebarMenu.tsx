import { useEffect, useRef } from 'react'
import { useSidebarMenuStore } from '@/stores/useSidebarMenuStore'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { INQUIRY_URL } from '@/constants/url'
import { Icon } from '../../ui/Icon'
import { Text } from '../../ui/Text'
import { useAuthStore } from '@/stores/useAuthStore'
import { LoginMenu } from './LoginMenu'
import { LogoutMenu } from './LogoutMenu'

export const SidebarMenu = () => {
  const isOpen = useSidebarMenuStore((state) => state.isOpen)
  const close = useSidebarMenuStore((state) => state.close)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

  const className = clsx(
    'absolute top-0 left-0 h-full w-[240px] bg-menuBackground z-50 transition-transform duration-300',
    isOpen ? 'translate-x-0' : '-translate-x-full',
  )

  const iconClass = 'flex justify-end p-4'
  const lineClass = 'border-t border-ccLine'
  const metaClass = 'absolute bottom-0 left-0 right-0 px-4'
  const metaItemClass = 'flex flex-col pl-1 space-y-1 text-xs font-semithin'

  return (
    <div ref={sidebarRef} className={className}>
      <div className={iconClass}>
        <Icon name="Bars3Icon" size={24} variant="solid" className="cursor-pointer text-menuItem" onClick={close} />
      </div>

      {isLoggedIn ? <LoginMenu /> : <LogoutMenu />}

      <div className={metaClass}>
        <div className={lineClass} />
        <div className={clsx(metaItemClass, 'pt-4 pb-8')}>
          <Link to={INQUIRY_URL} className="text-menuItem" onClick={close} target="_blank" rel="noopener noreferrer">
            문의하기
          </Link>
          <Text className="text-menuMetaText">v3.0.0 25.07.07</Text>
        </div>
      </div>
    </div>
  )
}
