import { LoginForm } from './LoginForm'
import { Wrapper } from '../components/layout/Wrapper'
import { KaKaoButton } from '../components/ui/Button'
import { LoginMessage } from '@/constants/PU/loginMessage'

export default function LoginPage() {
  const lineClass = 'border-t border-ccLine my-5'

  return (
    <div className="wrap bg-puBg">
      <Wrapper title={LoginMessage.TITLE} className="px-8">
        <LoginForm />
        <div className={lineClass} />
        <KaKaoButton />
      </Wrapper>
    </div>
  )
}
