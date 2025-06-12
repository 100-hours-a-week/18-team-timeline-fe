import { useState, useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES, ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { validateResetPassword } from '../utils/validateResetPassword'

type ResetPasswordLogicProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  setToastMessage: (msg: string) => void
}

export const useResetPasswordLogic = ({ setToastMessage }: ResetPasswordLogicProps) => {
  const [resetActionText, setresetActionText] = useState('재설정')
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
    if (!sessionStorage.getItem('email') !== null) {
      setEmail(sessionStorage.getItem('email') ?? '')
      return
    }

    setresetActionText('변경')

    const fetchUserInfo = async () => {
      try {
        const res = await getData(ENDPOINTS.USER_INFO)
        setEmail(res.data.email)
      } catch (e) {
        console.error('회원 정보 조회 실패', e)
      }
    }
    fetchUserInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateResetPassword(password, passwordCheck)
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }
    try {
      const res = await postData(ENDPOINTS.RESET_PASSWORD(token), { password })
      if (res?.success) {
        setToastMessage(`비밀번호가 ${resetActionText}되었습니다.`)
        sessionStorage.removeItem('email')
        navigate(ROUTES.LOGIN)
      }
    } catch (error) {
      console.error(`비밀번호 ${resetActionText} 실패`, error)
      setPassword('')
      setPasswordCheck('')
      navigate(ROUTES.FIND_PASSWORD)
      alert(`비밀번호 ${resetActionText} 중 오류가 발생했습니다.`)
    }
  }

  return {
    resetActionText,
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
