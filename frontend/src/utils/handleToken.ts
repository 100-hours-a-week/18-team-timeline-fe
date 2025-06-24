import { jwtDecode, type JwtPayload } from 'jwt-decode'

export interface TokenJwtPayload extends JwtPayload {
  sub?: string
  username?: string
  role?: string
}

const isTokenExpired = (exp?: number): boolean => {
  if (!exp) return true
  const currentTime = Math.floor(Date.now() / 1000)
  return exp < currentTime
}

export const handleToken = (token: string): void => {
  try {
    const decoded = jwtDecode<TokenJwtPayload>(token)

    if (isTokenExpired(decoded.exp)) {
      console.log('액세스 토큰이 만료되었습니다.')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      return
    }

    if (decoded.sub && decoded.username && decoded.role) {
      localStorage.setItem('token', token)
      localStorage.setItem('userId', decoded.sub)
      localStorage.setItem('username', decoded.username)
      localStorage.setItem('role', decoded.role)
    } else {
      console.warn('JWT에서 필수 정보 누락: sub, username, role', {
        sub: decoded.sub,
        username: decoded.username,
        role: decoded.role,
      })
    }
  } catch (error) {
    console.error('JWT 처리 중 오류 발생', error)
    localStorage.clear()
  }
}
