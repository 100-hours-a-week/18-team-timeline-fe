import { useEffect, useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { useRequestStore } from '@/stores/requestStore'
import { ENDPOINTS } from '@/constants/url'
import { validateUserInfo } from '../utils/validateUserInfo'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { trace } from '@opentelemetry/api'
import { UserInfoMessage } from '@/constants/PU/userInfoMessage'

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
  const [isNameChecked, setIsNameChecked] = useState(false)

  const { getData, patchData } = useRequestStore()
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName')

  useEffect(() => {
    if (!userName) {
      navigate(ROUTES.LOGIN)
      return
    }

    setName(userName)

    const span = trace.getActiveSpan()
    if (span) {
      span.setAttribute('user_id', userName)
    }

    const fetchUserInfo = async () => {
      try {
        const res = await getData(ENDPOINTS.USER_INFO)
        setEmail(res.data.user.email)
      } catch (e) {
        console.error('유저 정보 조회 실패', e)
      }
    }
    fetchUserInfo()
  }, [])

  useEffect(() => {
    const result = validateUserInfo(name)
    setErrors(result.errors)
    setIsButtonActive(result.isValid && isNameChecked)
  }, [name, isNameChecked])

  useEffect(() => {
    if (name !== userName) {
      setIsNameChecked(false)
    }
  }, [name])

  const checkNameDuplicate = async () => {
    if (!name || errors.name || name === userName) return

    const res = await getData(ENDPOINTS.CHECK_NAME(name))

    if (!res.data.available) {
      setErrors((prev) => ({ ...prev, name: UserInfoMessage.EMAIL_ALREADY_EXISTS }))
      setIsNameChecked(false)
    } else {
      setErrors((prev) => ({ ...prev, name: undefined }))
      setIsNameChecked(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isButtonActive) return
    try {
      const res = await patchData(ENDPOINTS.USER_INFO, { nickname: name })
      if (res?.success) {
        localStorage.setItem('userName', name)
        setToastMessage(UserInfoMessage.TOAST_SUCCESS)
        window.location.reload()
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
    checkNameDuplicate,
    errors,
    isButtonActive,
    handleSubmit,
    isInputModalOpen,
    setIsInputModalOpen,
  }
}
