import { useState, useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { Text } from '@/components/ui/Text'
import { Link } from 'react-router-dom'
import { ROUTES, ENDPOINTS } from '@/constants/url'
import { validateLogin } from '../utils/validateLogin'
import { useNavigate } from 'react-router-dom'
import { useRequestStore } from '@/stores/requestStore'
import { EmailInput } from '../components/form/EmailInput'
import { NavigationLink } from '@/constants/navigationLink'
import { Toast } from '@/components/ui/Toast'
import { LoginMessage } from '@/constants/PU/loginMessage'
import { PasswordInput } from '../components/form/PasswordInput'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type LoginFormProps = ReactDivProps & {}

export const LoginForm = ({}: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

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
      console.error('로그인 실패:', error)
      setToastMessage(LoginMessage.TOAST_FAIL)
    }
  }

  const formClass = clsx('w-full flex flex-col justify-center', 'space-y-3')
  const buttonClass = clsx('flex flex-col pt-8 space-y-1')
  const navigationClass = clsx('w-full justify-center flex flex-row space-x-1', 'text-sm text-navText')
  const linkClass = clsx('hover:text-navTextHover')

  return (
    <>
      <form className={formClass} onSubmit={handleSubmit}>
        <EmailInput
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          helperText={errors.email}
        />
        <PasswordInput
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          helperText={errors.password}
        />
        <div className={buttonClass}>
          <Button text={LoginMessage.BTN_NAME} isActive={isButtonActive} />
          <div className={navigationClass}>
            <Link to={ROUTES.SIGNUP} className={linkClass}>
              <Text>{NavigationLink.SIGNUP}</Text>
            </Link>
            <Text>|</Text>
            <Link to={''} className={linkClass}>
              <Text>{NavigationLink.FIND_PASSWORD}</Text>
            </Link>
          </div>
        </div>
      </form>
      {toastMessage && <Toast message={toastMessage} />}
    </>
  )
}
