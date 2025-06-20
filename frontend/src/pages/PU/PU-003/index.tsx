import { UserInfoMessage } from '@/constants/PU/userInfoMessage'
import { Wrapper } from '../../../components/layout/Wrapper'
import { UserInfoForm } from './UserInfoForm'

export default function UserInfoPage() {
  return (
    <div className="wrap">
      <Wrapper title={UserInfoMessage.TITLE} className="px-8">
        <UserInfoForm />
      </Wrapper>
    </div>
  )
}
