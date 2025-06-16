import { useState } from 'react'
import { Wrapper } from '@/components/layout/Wrapper'
import { PollForm } from './PollForm'
import { PollMessage } from '@/constants/PV/pollMessage'
import { usePollLogic } from './usePollLogic'
import { Toast } from '@/components/ui/Toast'

export default function PollPage() {
  const [toastMessage, setToastMessage] = useState('')
  const logic = usePollLogic({ setToastMessage })

  return (
    <div className="wrap bg-pvBg">
      <Wrapper title={PollMessage.TITLE(logic.title)} content={PollMessage.CONTENT(logic.endAt)} className="px-8">
        <PollForm
          handleSubmit={logic.handleSubmit}
          options={logic.options.map((opt, i) => ({ ...opt, id: i }))}
          selectOps={logic.selectOps}
          setSelectOps={logic.setSelectOps}
          minChoices={logic.minChoices ?? 1}
          maxChoices={logic.maxChoices ?? 3}
          isButtonActive={logic.isButtonActive}
        />
        {toastMessage && <Toast message={toastMessage} />}
      </Wrapper>
    </div>
  )
}
