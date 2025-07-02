import { create } from 'zustand'
import { axiosInstance } from '@/lib/axios'
import { ENDPOINTS } from '@/constants/url'

interface AuthState {
  isLoggedIn: boolean
  userId: number | null
  username: string | null
  setUsername: (newUsername: string) => void
  isAuthChecked: boolean
  login: () => void
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userId: null,
  username: null,
  isAuthChecked: false,

  login: () => {
    set({ isLoggedIn: true })
  },

  logout: () => {
    set({ isLoggedIn: false, userId: null, username: null })
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get(ENDPOINTS.CHECK_AUTH)

      if (res.data.success) {
        const { userId, username } = res.data.data
        set({
          isLoggedIn: true,
          userId,
          username,
          isAuthChecked: true,
        })
      } else {
        throw new Error('인증 실패')
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await axiosInstance.post(ENDPOINTS.REFRESH_TOKEN)

          const retryRes = await axiosInstance.get(ENDPOINTS.CHECK_AUTH)
          if (retryRes.data.success) {
            const { userId, username } = retryRes.data.data
            set({
              isLoggedIn: true,
              userId,
              username,
              isAuthChecked: true,
            })
          } else {
            set({
              isLoggedIn: false,
              userId: null,
              username: null,
              isAuthChecked: true,
            })
          }
        } catch {
          set({
            isLoggedIn: false,
            userId: null,
            username: null,
            isAuthChecked: true,
          })
        }
      } else {
        set({
          isLoggedIn: false,
          userId: null,
          username: null,
          isAuthChecked: true,
        })
      }
    }
  },

  setUsername: (newUsername) => {
    set({ username: newUsername })
  },
}))
