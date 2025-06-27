import { useEffect, useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { useRequestStore } from '@/stores/useRequestStore'
import { ENDPOINTS } from '@/constants/url'
import { validateUserInfo } from '../utils/validateUserInfo'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { trace } from '@opentelemetry/api'
import { UserInfoMessage } from '@/constants/PU/userInfoMessage'
import { useAuthStore } from '@/stores/useAuthStore'

type UserInfoLogicProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  setToastMessage: (msg: string) => void
}

export const useUserInfoLogic = ({ setToastMessage }: UserInfoLogicProps) => {
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<{ name?: string }>({})
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)

  const { isLoggedIn, username, setUsername } = useAuthStore()
  const { getData, patchData } = useRequestStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN)
      return
    }

    const span = trace.getActiveSpan()
    if (span && username) {
      span.setAttribute('user_id', username)
    }

    const fetchUserInfo = async () => {
      try {
        const res = await getData(ENDPOINTS.USER_INFO)
        setEmail(res.data.user.email)
        setName(username ?? res.data.user.username)
      } catch (e) {
        console.error('유저 정보 조회 실패', e)
      }
    }
    fetchUserInfo()
  }, [])

  useEffect(() => {
    const result = validateUserInfo(name)

    setErrors(result.errors)

    const isDifferentFromCurrent = name !== username
    const isValid = result.isValid

    setIsButtonActive(isDifferentFromCurrent && isValid)
  }, [name, username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isButtonActive) return

    setToastMessage('')
    try {
      const res = await patchData(ENDPOINTS.USER_INFO, { nickname: name })
      if (res?.success) {
        setUsername(name)
        setIsButtonActive(false)
        setToastMessage(UserInfoMessage.TOAST_SUCCESS)
      }
    } catch (error) {
      console.error('닉네임 수정 실패', error)
      setToastMessage(UserInfoMessage.TOAST_FAIL)
    }
  }

  return {
    email,
    text,
    setText,
    name,
    setName,
    errors,
    isButtonActive,
    handleSubmit,
    isInputModalOpen,
    setIsInputModalOpen,
  }
}
