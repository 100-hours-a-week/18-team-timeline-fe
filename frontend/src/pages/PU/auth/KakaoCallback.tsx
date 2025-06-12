import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ENDPOINTS, ROUTES } from '@/constants/url'
import { handleToken } from '@/utils/handleToken'
import { axiosInstance } from '@/lib/axios'

export const KakaoCallback = () => {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchToken = async () => {
      if (!code) return
      try {
        const res = await axiosInstance.get(ENDPOINTS.KAKAO_LOGIN_CALLBACK(code), {
          validateStatus: () => true,
        })

        const authHeader = res.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new Error('Authorization 헤더가 없습니다.')
        }

        const token = authHeader.replace('Bearer ', '')

        handleToken(token)
        navigate(ROUTES.MAIN, { replace: true })
      } catch (err) {
        console.error('카카오 콜백 처리 실패', err)
        alert('로그인에 실패했습니다.')
        navigate(ROUTES.LOGIN)
      }
    }

    fetchToken()
  }, [code])

  return <div>카카오 로그인 처리 중입니다...</div>
}
