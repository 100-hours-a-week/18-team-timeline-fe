import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Icon } from '@/components/ui/Icon'
import { useSearchStore } from '@/stores/useSearchStore'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type KeywordProps = ReactDivProps & {
  value: string
}

export function Keyword({ value }: KeywordProps) {
  const removeKeyword = useSearchStore((state) => state.removeKeyword)

  const KeywordClass = clsx(
    'bg-keywordBg text-sm text-keywordText px-2 py-[2px] rounded-2xl',
    'whitespace-nowrap flex items-center',
  )
  const iconClass = clsx('text-SearchBarIcon cursor-pointer ml-1')

  return (
    <div className={KeywordClass}>
      <span>{value}</span>
      <Icon name="XMarkIcon" size={10} variant="solid" className={iconClass} onClick={() => removeKeyword(value)} />
    </div>
  )
}
