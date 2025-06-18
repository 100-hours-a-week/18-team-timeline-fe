import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Text } from '@/components/ui/Text'

type Option = {
  id: number
  title: string
  imageUrl?: string
}

type PollOptionsFormProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  options: Option[]
  selectOps: number[]
  setSelectOps: (ids: number[]) => void
  maxChoices: number
}

export const PollOptionsForm = ({ options, selectOps, setSelectOps, maxChoices }: PollOptionsFormProps) => {
  const wrapperClass = 'border border-pollBoxBorder rounded-md px-2 py-4 grid gap-2'
  const optionBoxClass = 'flex w-full gap-2 pr-1'
  const optionClass = 'text-sm text-pollOptionText flex flex-1 w-full flex-col rounded px-4 py-2 cursor-pointer'
  const imageClass = 'w-full h-28 object-cover my-1 rounded'
  const radioBtnClass = 'flex w-4 h-4 rounded-full border border-radioBtnBorder items-center justify-center mt-2'
  const radioBtnSelectClass = 'w-2.5 h-2.5 rounded-full bg-radioBtnCircle'

  const toggleOption = (id: number) => {
    const isSelected = selectOps.includes(id)
    if (isSelected) {
      setSelectOps(selectOps.filter((item) => item !== id))
    } else if (selectOps.length < maxChoices) {
      setSelectOps([...selectOps, id])
    }
  }

  return (
    <div className={wrapperClass}>
      {options.map((option) => {
        const isSelected = selectOps.includes(option.id)
        return (
          <div key={option.id} className={optionBoxClass} onClick={() => toggleOption(option.id)}>
            <div className={radioBtnClass}>{isSelected && <div className={radioBtnSelectClass} />}</div>
            <div className={`${optionClass} ${isSelected ? 'bg-pollOptionSelectBg font-semibold' : 'bg-pollOptionBg'}`}>
              <Text>{option.title}</Text>
              {option.imageUrl && <img src={option.imageUrl} alt={option.title} className={imageClass} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
