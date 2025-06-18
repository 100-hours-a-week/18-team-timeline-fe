import { useState, useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { validateLogin } from '../utils/validateLogin'
import { LoginMessage } from '@/constants/PU/loginMessage'

type LoginLogicProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  setToastMessage: (msg: string) => void
}

export const useLoginLogic = ({ setToastMessage }: LoginLogicProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const { postData } = useRequestStore()
  const navigate = useNavigate()

  useEffect(() => {
    const result = validateLogin(email, password)
    setErrors(result.errors)
    setIsButtonActive(result.isValid)
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateLogin(email, password)
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }
    try {
      const res = await postData(ENDPOINTS.LOGIN, { email, password })
      if (res?.success) {
        navigate(ROUTES.MAIN)
      }
    } catch (error) {
      console.error('로그인 실패:', error)
      setEmail('')
      setPassword('')
      setToastMessage(LoginMessage.TOAST_FAIL)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isButtonActive,
    handleSubmit,
  }
}
