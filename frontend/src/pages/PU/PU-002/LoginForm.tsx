import { useState, useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Input } from '@/components/form/Input'
import { Button } from '../components/ui/Button'
import { Text } from '@/components/ui/Text'
import { Link } from 'react-router-dom'
import { ROUTES, ENDPOINTS } from '@/constants/url'
import { validateLogin } from '../utils/validateLogin'
import { useNavigate } from 'react-router-dom'
import { useRequestStore } from '@/stores/requestStore'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type LoginFormProps = ReactDivProps & {}

export const LoginForm = ({}: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isButtonActive, setIsButtonActive] = useState(false)

  useEffect(() => {
    const result = validateLogin(email, password)
    setErrors(result.errors)
    setIsButtonActive(result.isValid)
  }, [email, password])

  const navigate = useNavigate()
  const { postData } = useRequestStore()

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
      console.error('로그인 실패', error)
      alert('로그인 중 오류가 발생했습니다.')
    }
  }

  const formClass = clsx('w-full flex flex-col justify-center', 'space-y-3')

  const buttonClass = clsx('flex flex-col pt-8 space-y-1')

  const navigationClass = clsx('w-full justify-center flex flex-row space-x-1', 'text-sm text-navText')

  const linkClass = clsx('hover:text-navTextHover')

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <Input
        id="email"
        type="text"
        placeholder="이메일을 입력하세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        helperText={errors.email}
      />
      <Input
        id="password"
        type="password"
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText={errors.password}
      />
      <div className={buttonClass}>
        <Button text="로그인하기" isActive={isButtonActive} />
        <div className={navigationClass}>
          <Link to={ROUTES.SIGNUP} className={linkClass}>
            <Text>회원가입</Text>
          </Link>
          <Text>|</Text>
          <Link to={''} className={linkClass}>
            <Text>비밀번호 찾기</Text>
          </Link>
        </div>
      </div>
    </form>
  )
}
