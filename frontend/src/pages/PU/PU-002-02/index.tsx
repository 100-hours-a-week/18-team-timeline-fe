import { ResetPasswordMessage } from '@/constants/PU/resetPasswordMessage'
import { Wrapper } from '../../../components/layout/Wrapper'
import { ResetPasswordForm } from './ResetPasswordForm'
import { useAuthStore } from '@/stores/useAuthStore'

export default function ResetPasswordPage() {
  const title = ResetPasswordMessage.TITLE(useAuthStore((state) => state.isLoggedIn))
  return (
    <div className="wrap">
      <Wrapper title={title} className="px-8">
        <ResetPasswordForm />
      </Wrapper>
    </div>
  )
}
