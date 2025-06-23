import { Wrapper } from '../../../components/layout/Wrapper'
import { LoginMessage } from '@/constants/PU/loginMessage'
import { KaKaoButton } from '../components/ui/KakaoButton'
import { LoginNotice } from './LoginNotice'

export default function LoginPage() {
  return (
    <div className="wrap">
      <Wrapper title={LoginMessage.TITLE} className={'px-8'}>
        <LoginNotice />
        <KaKaoButton />
      </Wrapper>
    </div>
  )
}
