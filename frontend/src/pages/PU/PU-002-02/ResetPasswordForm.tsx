import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { StaticField } from '../components/ui/StaticField'
import { validateResetPassword } from '../utils/validateResetPassword'
import { useResetPasswordLogic } from './useResetPasswordLogic'
import { Toast } from '@/components/ui/Toast'
import { PasswordInput } from '../components/form/PasswordInput'
import { PasswordCheckInput } from '../components/form/PasswordCheckInput'
import { ResetPasswordMessage } from '@/constants/PU/resetPasswordMessage'
import { useAuthStore } from '@/stores/useAuthStore'

export const ResetPasswordForm = () => {
  const [toastMessage, setToastMessage] = useState('')
  const {
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
  }, [password, passwordCheck, setErrors, setIsButtonActive])

  const formClass = clsx('w-full flex flex-col justify-center', 'space-y-3')
  const buttonClass = clsx('flex flex-col pt-8 space-y-1')

  return (
    <>
      <form className={formClass} onSubmit={handleSubmit}>
        <StaticField label="이메일" content={email} />
        <PasswordInput
          isLabel={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText={errors.password}
        />
        <PasswordCheckInput
          isLabel={true}
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          helperText={errors.passwordCheck}
        />
        <div className={buttonClass}>
          <Button
            text={ResetPasswordMessage.BTN_NAME(useAuthStore((state) => state.isLoggedIn))}
            isActive={isButtonActive}
          />
        </div>
      </form>

      {toastMessage && <Toast message={toastMessage} />}
    </>
  )
}
