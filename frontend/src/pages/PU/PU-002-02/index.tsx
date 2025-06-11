import { Wrapper } from '../components/layout/Wrapper'
import { ResetPasswordForm } from './ResetPasswordForm'

export default function ResetPasswordPage() {
  const resetActionText = localStorage.getItem('token') ? '변경' : '재설정'
  return (
    <div className="wrap bg-puBg">
      <Wrapper title={`비밀번호 ${resetActionText}`} className="px-8">
        <ResetPasswordForm />
      </Wrapper>
    </div>
  )
}
