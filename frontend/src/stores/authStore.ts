import { handleToken } from '@/utils/handleToken'
import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  login: (token: string) => void
  logout: () => void
  checkAuth: () => void
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp
    if (!exp) return false

    const now = Math.floor(Date.now() / 1000)
    return exp > now
  } catch (err) {
    console.error('토큰 파싱 오류', err)
    return false
  }
}

function clearAuthStorage() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('userName')
  localStorage.removeItem('role')
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token')
  const initialLoginState = isTokenValid(token)

  return {
    isLoggedIn: initialLoginState,

    login: (token: string) => {
      handleToken(token)
      set({ isLoggedIn: true })
    },

    logout: () => {
      clearAuthStorage()
      set({ isLoggedIn: false })
    },

    checkAuth: () => {
      const token = localStorage.getItem('token')
      const isValid = isTokenValid(token)
      set({ isLoggedIn: isValid })
      if (!isValid) clearAuthStorage()
    },
  }
})
