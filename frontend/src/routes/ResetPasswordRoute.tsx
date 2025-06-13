import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect } from 'react'

export const ResetPasswordRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const token = params.get('token')

  useEffect(() => {
    if (isLoggedIn && token) {
      navigate(location.pathname, { replace: true })
    }
  }, [isLoggedIn, token, location.pathname, navigate])

  const canAccess = (isLoggedIn && !token) || (!isLoggedIn && !!token)

  return canAccess ? <Outlet /> : <Navigate to="/login" replace />
}
