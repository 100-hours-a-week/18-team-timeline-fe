import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/url'

export const LoginRoute = ({ children }: PropsWithChildren) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  return isLoggedIn ? children : <Navigate to={ROUTES.LOGIN} replace />
}
