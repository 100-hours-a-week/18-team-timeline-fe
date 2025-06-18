import { useState, useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { validateFindPassword } from '../utils/validateFindPassword'
import { FindPasswordMessage } from '@/constants/PU/findPasswordMessage'

type FindPasswordLogicProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  setToastMessage: (msg: string) => void
}

export const useFindPasswordLogic = ({ setToastMessage }: FindPasswordLogicProps) => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [isButtonActive, setIsButtonActive] = useState(false)

  const { postData } = useRequestStore()

  useEffect(() => {
    const result = validateFindPassword(email)
    setErrors(result.errors)
    setIsButtonActive(result.isValid)
  }, [email])

  const handleSetEmail = (value: string) => {
    setEmail(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = validateFindPassword(email)
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }

    try {
      const res = await postData(ENDPOINTS.FIND_PASSWORD, { email })
      if (res?.success) {
        setToastMessage(FindPasswordMessage.TOAST_SUCCESS)
      }
    } catch (error) {
      console.error('이메일 확인 중 오류 발생:', error)
      setToastMessage(FindPasswordMessage.TOAST_FAIL)
      setEmail('')
    }
  }

  return {
    email,
    setEmail: handleSetEmail,
    errors,
    isButtonActive,
    handleSubmit,
  }
}
