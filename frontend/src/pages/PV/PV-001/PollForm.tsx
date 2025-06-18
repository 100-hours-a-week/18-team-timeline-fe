import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Button } from '@/pages/PU/components/ui/Button'
import { PollOptionsForm } from './PollOptionsForm'
import { PollMessage } from '@/constants/PV/pollMessage'
import { Text } from '@/components/ui/Text'

type Option = {
  id: number
  title: string
  imageUrl?: string
}

type PollFormProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  options: Option[]
  selectOps: number[]
  setSelectOps: (ids: number[]) => void
  minChoices: number
  maxChoices: number
  isButtonActive: boolean
}

export const PollForm = ({
  handleSubmit,
  options,
  selectOps,
  setSelectOps,
  maxChoices,
  isButtonActive
}: PollFormProps) => {
  const formClass = 'flex flex-col gap-2'
  const metaTextClass = 'text-[10px] text-center mt-2'

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <PollOptionsForm
        options={options}
        selectOps={selectOps}
        setSelectOps={setSelectOps}
        maxChoices={maxChoices}
      />
      <Button text={PollMessage.BTN_NAME} isActive={isButtonActive} />
      <Text className={metaTextClass}>{PollMessage.METATEXT}</Text>
    </form>
  )
}