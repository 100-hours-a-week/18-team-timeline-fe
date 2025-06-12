import { LoginForm } from './LoginForm'
import { Wrapper } from '../components/layout/Wrapper'
import { KaKaoButton } from '../components/ui/Button'

export default function LoginPage() {
  const lineClass = 'border-t border-ccLine my-5'

  return (
    <div className="wrap bg-puBg">
      <Wrapper title="로그인" className="px-8">
        <LoginForm />
        <div className={lineClass} />
        <KaKaoButton />
      </Wrapper>
    </div>
  )
}
