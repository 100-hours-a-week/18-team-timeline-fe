import { FindPasswordMessage } from '@/constants/PU/findPasswordMessage'
import { Wrapper } from '../../../components/layout/Wrapper'
import { FindPasswordForm } from './FindPasswordForm'

export default function FindPasswordPage() {
  return (
    <div className="wrap">
      <Wrapper title={FindPasswordMessage.TITLE} content={FindPasswordMessage.CONTENT} className="px-8">
        <FindPasswordForm />
      </Wrapper>
    </div>
  )
}
