import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { ROUTES } from '@/constants/url'

export const LoginRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  return isLoggedIn ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}
