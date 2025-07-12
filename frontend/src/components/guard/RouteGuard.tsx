import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import usePageStore from '@/stores/usePageStore'

const allowedPaths = Object.values(ROUTES)

export const RouteGuard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const setPage = usePageStore((state) => state.setPage)

  useEffect(() => {
    if (!allowedPaths.includes(location.pathname)) {
      navigate(ROUTES.MAIN, { replace: true })
      setPage(ROUTES.MAIN)
    } else {
      setPage(location.pathname)
    }
  }, [location.pathname, navigate, setPage])

  return null
}
