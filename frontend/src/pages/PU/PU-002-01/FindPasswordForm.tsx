import { Input } from '@/components/form/Input'
import { useEffect, useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { validateFindPassword } from '../utils/validateFindPassword'
import { Link, useNavigate } from 'react-router-dom'
import { useRequestStore } from '@/stores/requestStore'
import { ENDPOINTS, ROUTES } from '@/constants/url'
import { Button } from '../components/ui/Button'
import { Text } from '@/components/ui/Text'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type FindPasswordFormProps = ReactDivProps & {}

export const FindPasswordForm = ({}: FindPasswordFormProps) => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [isButtonActive, setIsButtonActive] = useState(false)

  useEffect(() => {
    const result = validateFindPassword(email)
    setErrors(result.errors)
    setIsButtonActive(result.isValid)
  }, [email])

  const navigate = useNavigate()
  const { postData } = useRequestStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = validateFindPassword(email)
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }

    try {
      const res = await postData(ENDPOINTS.PASSWORD_RESET, { email })
      if (res?.success) {
        navigate(ROUTES.LOGIN)
      }
    } catch (error) {
      console.error('로그인 실패', error)
      alert('이메일 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
      setEmail('')
    }
  }

  const formClass = clsx('w-full flex flex-col justify-center', 'space-y-3')

  const buttonClass = clsx('flex flex-col pt-3 space-y-1')

  const navigationClass = clsx('w-full justify-center flex flex-row space-x-1', 'text-sm text-navText')

  const linkClass = clsx('hover:text-navTextHover')

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <Input
        id={'email'}
        type={'text'}
        placeholder={'이메일을 입력하세요.'}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        helperText={errors.email}
      />
      <div className={buttonClass}>
        <Button text={'이메일 확인하기'} isActive={isButtonActive}></Button>
        <div className={navigationClass}>
          <Link to={ROUTES.LOGIN} className={linkClass}>
            <Text>로그인하러 가기</Text>
          </Link>
        </div>
      </div>
    </form>
  )
}
