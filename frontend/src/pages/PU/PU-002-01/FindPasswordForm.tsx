import { Input } from '@/components/form/Input'
import { useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { Button } from '../components/ui/Button'
import { Text } from '@/components/ui/Text'
import { useFindPasswordLogic } from './useFindPasswordLogic'
import { Toast } from '@/components/ui/Toast'
import { EmailInput } from '../components/form/EmailInput'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type FindPasswordFormProps = ReactDivProps & {}

export const FindPasswordForm = ({}: FindPasswordFormProps) => {
  const [toastMessage, setToastMessage] = useState('')
  const { email, setEmail, errors, isButtonActive, handleSubmit } = useFindPasswordLogic({ setToastMessage })

  const formClass = clsx('w-full flex flex-col justify-center', 'space-y-3')
  const buttonClass = clsx('flex flex-col pt-3 space-y-1')
  const navigationClass = clsx('w-full justify-center flex flex-row space-x-1', 'text-sm text-navText')
  const linkClass = clsx('hover:text-navTextHover')

  return (
    <>
      <form className={formClass} onSubmit={handleSubmit}>
        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} helperText={errors.email} />
        <div className={buttonClass}>
          <Button text={'이메일 확인하기'} isActive={isButtonActive}></Button>
          <div className={navigationClass}>
            <Link to={ROUTES.LOGIN} className={linkClass}>
              <Text>로그인하러 가기</Text>
            </Link>
          </div>
        </div>
      </form>

      {toastMessage && <Toast message={toastMessage} />}
    </>
  )
}
