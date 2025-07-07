import clsx from 'clsx'
import { Keyword } from './Keyword'
import { useSearchStore } from '@/stores/useSearchStore'

export const KeywordBox = () => {
  const keywords = useSearchStore((state) => state.keywords)

  const className = clsx(
    'top-0 w-full bg-keywordBoxBg',
    'flex items-center gap-2 px-[8px] py-[4px]',
    'border-b border-b-keywordBoxLine',
    'overflow-x-auto whitespace-nowrap',
  )

  return (
    <div className={className}>
      {keywords.map((word, idx) => (
        <Keyword key={idx} value={word} />
      ))}
    </div>
  )
}
