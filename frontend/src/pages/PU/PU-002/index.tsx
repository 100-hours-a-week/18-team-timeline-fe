import { Wrapper } from '../../../components/layout/Wrapper'
import { LoginMessage } from '@/constants/PU/loginMessage'
import { KaKaoButton } from '../components/ui/KakaoButton'

export default function LoginPage() {
  return (
    <div className="wrap">
      <Wrapper title={LoginMessage.TITLE} className="px-8">
        {/* <LoginForm />
        <div className={lineClass} /> */}
        <KaKaoButton />
      </Wrapper>
    </div>
  )
}
