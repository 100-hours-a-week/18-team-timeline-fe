import { useEffect } from 'react'
import { useLocation, useNavigate, matchPath } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import usePageStore from '@/stores/usePageStore'

const allowedPaths = Object.values(ROUTES).filter((path) => typeof path === 'string' && !path.includes(':'))

const dynamicPaths = [ROUTES.NEWS_DETAIL]

export const RouteGuard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const setPage = usePageStore((state) => state.setPage)

  useEffect(() => {
    const currentPath = location.pathname

    const isAllowedStatic = allowedPaths.includes(currentPath)

    const isAllowedDynamic = dynamicPaths.some((pattern) => matchPath(pattern, currentPath))

    if (!isAllowedStatic && !isAllowedDynamic) {
      navigate(ROUTES.MAIN, { replace: true })
      setPage(ROUTES.MAIN)
    } else {
      setPage(currentPath)
    }
  }, [location.pathname, navigate, setPage])

  return null
}
