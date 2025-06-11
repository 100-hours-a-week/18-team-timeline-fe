import { useNavigate } from 'react-router-dom'
import { useRequestStore } from '@/stores/requestStore'
import clsx from 'clsx'
import type { DetailedHTMLProps, HTMLAttributes } from 'node_modules/@types/react'
import { ENDPOINTS, ROUTES } from '@/constants/url'

type SideBarButtonProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  url: string
  data?: any
  redirectTo?: string
  children: React.ReactNode
  onClick?: () => void
}

export const SideBarButton = ({
  url,
  data,
  redirectTo,
  children,
  onClick,
  className: _className,
}: SideBarButtonProps) => {
  const className = clsx(_className)

  const navigate = useNavigate()
  const { postData } = useRequestStore()

  const handleClick = async () => {
    try {
      if (data) {
        const res = await postData(url, data)
        if (res?.success && redirectTo) {
          navigate(redirectTo)
        }
      } else {
        const res = await postData(url)
        if (res?.success && redirectTo) {
          navigate(redirectTo)
        }
      }

      if (onClick) {
        onClick()
      }
    } catch (error) {
      console.error(`요청 처리 실패:`, error)
    }
  }

  return (
    <button className={clsx(className)} onClick={handleClick}>
      {children}
    </button>
  )
}

type LogoutButtonProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  onClick?: () => void
}

export const LogoutButton = ({ onClick, className: _className }: LogoutButtonProps) => {
  const className = clsx(_className)

  const navigate = useNavigate()
  const { postData } = useRequestStore()

  const handleClick = async () => {
    try {
      const res = await postData(ENDPOINTS.LOGOUT)
      if (res?.success) {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        localStorage.removeItem('role')
        navigate(ROUTES.MAIN)
        window.location.reload()
      }

      if (onClick) {
        onClick()
      }
    } catch (error) {
      console.error(`로그아웃 실패:`, error)
    }
  }

  return (
    <button className={clsx(className)} onClick={handleClick}>
      로그아웃
    </button>
  )
}
