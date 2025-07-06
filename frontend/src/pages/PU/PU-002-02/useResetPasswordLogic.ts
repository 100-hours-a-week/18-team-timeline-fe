import { useState, useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES, ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { validateResetPassword } from '../utils/validateResetPassword'
import { useAuthStore } from '@/stores/useAuthStore'
import { ResetPasswordMessage } from '@/constants/PU/resetPasswordMessage'

type ResetPasswordLogicProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  setToastMessage: (msg: string) => void
}

export const useResetPasswordLogic = ({ setToastMessage }: ResetPasswordLogicProps) => {
  const isLogin = useAuthStore((state) => state.isLoggedIn)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string
    passwordCheck?: string
  }>({})

  const [searchParam] = useSearchParams()
  const token = searchParam.get('token') ?? ''

  const { getData, postData } = useRequestStore()
  const navigate = useNavigate()

  useEffect(() => {
    const result = validateResetPassword(password, passwordCheck)
    setErrors(result.errors)
    setIsButtonActive(result.isValid)
  }, [password, passwordCheck])

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getData(ENDPOINTS.USER_INFO)
        setEmail(res.data.user.email)
      } catch (err) {
        console.error('회원 정보 조회 실패', err)
      }
    }

    const checkTokenValid = async () => {
      try {
        const res = await getData(ENDPOINTS.CHECK_TOKEN_VALID(token))
        setEmail(res.data.email)
      } catch (err) {
        navigate(ROUTES.MAIN)
        console.error('토큰 유효성 확인 실패', err)
      }
    }

    if (isLogin) {
      fetchUserInfo()
    } else {
      checkTokenValid()
    }
  }, [token, isLogin, getData, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateResetPassword(password, passwordCheck)
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }

    try {
      const res = await postData(isLogin ? ENDPOINTS.RESET_PASSWORD_LOGIN : ENDPOINTS.RESET_PASSWORD_LOGOUT(token), {
        password,
      })
      if (res?.success) {
        setToastMessage(ResetPasswordMessage.TOAST_SUCCESS(isLogin))
        navigate(ROUTES.LOGIN)
      }
    } catch (error) {
      console.error(`${ResetPasswordMessage.TITLE(isLogin)} 실패`, error)

      setPassword('')
      setPasswordCheck('')

      if (!isLogin) {
        navigate(ROUTES.MAIN)
      }

      setToastMessage(ResetPasswordMessage.TOAST_FAIL(isLogin))
    }
  }

  return {
    email,
    password,
    setPassword,
    passwordCheck,
    setPasswordCheck,
    errors,
    setErrors,
    isButtonActive,
    setIsButtonActive,
    handleSubmit,
  }
}
