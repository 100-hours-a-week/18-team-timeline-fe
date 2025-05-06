import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch (err) {
    console.error('토큰 파싱 오류:', err);
    return false;
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('accessToken');
  const initialLoginState = isTokenValid(token);

  return {
    isLoggedIn: initialLoginState,

    login: (token: string) => {
      localStorage.setItem('accessToken', token);
      set({ isLoggedIn: true });
    },

    logout: () => {
      localStorage.removeItem('accessToken');
      set({ isLoggedIn: false });
    },

    checkAuth: () => {
      const token = localStorage.getItem('accessToken');
      const isValid = isTokenValid(token);
      set({ isLoggedIn: isValid });
      if (!isValid) localStorage.removeItem('accessToken');
    },
  };
});
