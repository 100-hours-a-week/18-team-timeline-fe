import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Keyword } from './Keyword'
import { useSearchStore } from '@/stores/useSearchStore'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const KeywordBox = ({ className: _className }: ReactDivProps) => {
  const keywords = useSearchStore((state) => state.keywords)

  const className = clsx(
    'top-0 w-full bg-keywordBoxBg',
    'flex items-center gap-2 px-[8px] py-[4px]',
    'border-t border-t-keywordBoxLine',
    'overflow-x-auto whitespace-nowrap',
    _className,
  )

  return (
    <div className={className}>
      {keywords.map((word, idx) => (
        <Keyword key={idx} value={word} />
      ))}
    </div>
  )
}
