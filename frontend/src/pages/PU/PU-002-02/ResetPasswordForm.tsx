import { Input } from '@/components/form/Input'
import { useEffect, useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { StaticField } from '../components/ui/StaticField'
import { validateResetPassword } from '../utils/validateResetPassword'
import { useResetPasswordLogic } from './useResetPasswordLogic'
import { Toast } from '@/components/ui/Toast'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type ResetPasswordFormProps = ReactDivProps & {}

export const ResetPasswordForm = ({}: ResetPasswordFormProps) => {
  const [toastMessage, setToastMessage] = useState('')
  const {
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
  } = useResetPasswordLogic({ setToastMessage })

  useEffect(() => {
    const result = validateResetPassword(password, passwordCheck)
    setErrors(result.errors)
    setIsButtonActive(result.isValid)
  }, [password, passwordCheck])

  const formClass = clsx('w-full flex flex-col justify-center', 'space-y-3')

  const buttonClass = clsx('flex flex-col pt-8 space-y-1')

  return (
    <>
      <form className={formClass} onSubmit={handleSubmit}>
        <StaticField label="이메일" content={email} />
        <Input
          id="password"
          labelName="비밀번호"
          required={true}
          type="password"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText={errors.password}
        />
        <Input
          id="password-check"
          labelName="비밀번호 확인"
          required={true}
          type="password"
          placeholder="비밀번호를 한 번 더 입력하세요."
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          helperText={errors.passwordCheck}
        />
        <div className={buttonClass}>
          <Button text={`비밀번호 ${resetActionText}하기`} isActive={isButtonActive} />
        </div>
      </form>

      {toastMessage && <Toast message={toastMessage} />}
    </>
  )
}
