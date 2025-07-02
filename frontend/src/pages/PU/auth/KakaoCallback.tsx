import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ENDPOINTS, ROUTES } from '@/constants/url'
import { PUMessage } from '@/constants/PU/puMessage'
import { useRequestStore } from '@/stores/useRequestStore'
import LoadingPage from '@/pages/PL'
import { useAuthStore } from '@/stores/useAuthStore'

export const KakaoCallback = () => {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const navigate = useNavigate()
  const { getData } = useRequestStore()
  const { login } = useAuthStore()

  useEffect(() => {
    const fetchToken = async () => {
      if (!code) {
        console.warn('카카오 인증 코드 없음')
        return
      }

      try {
        const res = await getData(ENDPOINTS.KAKAO_LOGIN_CALLBACK(code))

        if (!res?.success) {
          throw new Error('로그인 실패')
        }

        login()
        navigate(ROUTES.MAIN, { replace: true })
      } catch (err) {
        console.error('카카오 콜백 처리 실패', err)
        alert(PUMessage.KAKAO_BTN_LOGIN_FAIL)
        navigate(ROUTES.LOGIN)
      }
    }

    fetchToken()
  }, [code])

  return <LoadingPage />
}
