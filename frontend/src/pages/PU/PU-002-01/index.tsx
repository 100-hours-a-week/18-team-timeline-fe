import { userMessage } from '@/constants/userMessage'
import { Wrapper } from '../components/layout/Wrapper'
import { FindPasswordForm } from './FindPasswordForm'

export default function FindPasswordPage() {
  return (
    <div className="wrap bg-puBg">
      <Wrapper title={userMessage.FIND_PASSWORD_TITLE} content={userMessage.FIND_PASSWORD_CONTENT} className="px-8">
        <FindPasswordForm />
      </Wrapper>
    </div>
  )
}
