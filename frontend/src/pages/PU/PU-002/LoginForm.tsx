import { useState } from 'react'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { Text } from '@/components/ui/Text'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { EmailInput } from '../components/form/EmailInput'
import { NavigationLink } from '@/constants/navigationLink'
import { Toast } from '@/components/ui/Toast'
import { LoginMessage } from '@/constants/PU/loginMessage'
import { PasswordInput } from '../components/form/PasswordInput'
import { useLoginLogic } from './useLoginLogic'

export const LoginForm = () => {
  const [toastMessage, setToastMessage] = useState('')

  const { email, setEmail, password, setPassword, errors, isButtonActive, handleSubmit } = useLoginLogic({
    setToastMessage,
  })

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
            <Link to={ROUTES.FIND_PASSWORD} className={linkClass}>
              <Text>{NavigationLink.FIND_PASSWORD}</Text>
            </Link>
          </div>
        </div>
      </form>
      {toastMessage && <Toast message={toastMessage} />}
    </>
  )
}
